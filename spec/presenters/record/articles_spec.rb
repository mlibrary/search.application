describe Search::Presenters::Record::Articles::Full do
  let(:record) do
    instance_double(Search::Models::Record::Articles,
      bib: instance_double(Search::Models::Record::Articles::Bib),
      holdings: instance_double(Search::Models::Record::Articles::Holdings),
      citation: instance_double(Search::Models::Record::Catalog::Citation))
  end
  def text(str)
    [double(text: str)]
  end

  subject do
    described_class.new(record)
  end

  context "#retraction" do
    it "is nil when there is no retraction" do
      allow(record).to receive(:retracted?).and_return(false)
      expect(subject.retraction).to be_nil
    end
    it "has a retraction when there is one" do
      allow(record).to receive(:retracted?).and_return(true)
      url = "http://some_url"
      allow(record.bib).to receive(:retraction_notice_url).and_return(url)
      retraction = subject.retraction
      expect(retraction.uid).to eq(:retraction)
      expect(retraction.field).to eq("Retracted")
      expect(retraction.partial).to eq("link_to")
      expect(retraction.values.count).to eq(1)
      expect(retraction.values.first.to_s).to eq("This article has been retracted.")
      expect(retraction.values.first.url).to eq(url)
    end
  end

  context "#published_in" do
    it "is nil when there are no parts" do
      allow(record.bib).to receive(:id).and_return("some_id")
      [:journal_title, :volume, :issue, :publication_date, :pages].each do |field|
        allow(record.bib).to receive(field).and_return(nil)
      end
      expect(subject.published_in).to be_nil
    end
    it "has all of the parts when it should" do
      allow(record.bib).to receive(:journal_title).and_return(text("Some journal"))
      allow(record.bib).to receive(:volume).and_return(text("3"))
      allow(record.bib).to receive(:issue).and_return(text("4"))
      allow(record.bib).to receive(:publication_date).and_return(text("2020"))
      allow(record.bib).to receive(:pages).and_return(text("55"))

      expect(subject.published_in.values.first.to_s).to eq("Some journal, Volume 3, Issue 4, 2020, pp. 55")
    end
  end
  context "#holdings" do
    it "is empty based on the value of whatever the count is in the holdings model" do
      allow(record.holdings).to receive(:count).and_return(1)
      holding = subject.holdings.list.first
      expect(holding.empty?).to eq(false)
    end
    it "has expected output for a full text lib key and alma holding" do
      allow(record).to receive(:retracted?).and_return(false)
      allow(record.bib).to receive(:id).and_return("some_id")
      lib_key_item = double(
        source: "lib_key", availability: "full_text", url: "http://lib-key-url"
      )
      alma_item = double(
        source: "alma", availability: "full_text", url: "http://alma_url"
      )

      allow(record.holdings).to receive(:items).and_return([lib_key_item, alma_item])
      holding = subject.holdings.list.first
      expect(holding.table_headings.map { |x| x.text }).to contain_exactly("Action", "Description", "Improving Access")
      lib_key_row = holding.rows[0]
      alma_row = holding.rows[1]

      expect(lib_key_row[0].text).to eq("View PDF")
      expect(lib_key_row[1].text).to eq("Full text available")
      expect(lib_key_row[1].intent).to eq("success")
      expect(lib_key_row[2].url).to include("LibKey")
      expect(alma_row[0].text).to eq("Go to item")
      expect(alma_row[1].text).to eq("Full text available")
      expect(alma_row[1].intent).to eq("success")
      expect(alma_row[2].url).to include("ArticlesSearch")
    end

    it "has intent warning when citation only" do
      allow(record).to receive(:retracted?).and_return(false)
      allow(record.bib).to receive(:id).and_return("some_id")
      alma_item = double(
        source: "alma", availability: "citation_only", url: "http://alma_url"
      )

      allow(record.holdings).to receive(:items).and_return([alma_item])
      holding = subject.holdings.list.first
      expect(holding.table_headings.map { |x| x.text }).to contain_exactly("Action", "Description")
      alma_row = holding.rows[0]

      expect(alma_row[1].intent).to eq("warning")
      expect(alma_row[1].text).to eq("Citation only")
    end
    it "has expected output for a retracted lib key and alma holding" do
      allow(record).to receive(:retracted?).and_return(true)
      allow(record.bib).to receive(:id).and_return("some_id")
      lib_key_item = double(
        source: "lib_key", availability: "full_text", url: "http://lib-key-url"
      )
      alma_item = double(
        source: "alma", availability: "full_text", url: "http://alma_url"
      )

      allow(record.holdings).to receive(:items).and_return([lib_key_item, alma_item])
      rows = subject.holdings.list.first.rows
      lib_key_row = rows[0]
      alma_row = rows[1]

      expect(lib_key_row[1].text).to eq("Retracted")
      expect(lib_key_row[1].intent).to eq("error")
      expect(alma_row[1].text).to eq("Retracted")
      expect(alma_row[1].intent).to eq("error")
    end
  end
end
describe Search::Presenters::Record::Articles::Brief do
  def text(str)
    [double(text: str)]
  end
  let(:record) do
    instance_double(Search::Models::Record::Articles,
      bib: instance_double(Search::Models::Record::Articles::Bib),
      holdings: instance_double(Search::Models::Record::Articles::Holdings),
      citation: instance_double(Search::Models::Record::Catalog::Citation))
  end

  subject do
    described_class.new(record)
  end

  context "#abstract" do
    it "is 240 characters when the text is longer than 300 characters" do
      allow(record.bib).to receive(:abstract).and_return([double(text: "a" * 301)])
      expect(subject.abstract.values.first.to_s).to eq("a" * 240 + "...")
    end

    it "is the exact number of characters if the items is up to 300 characters" do
      three_hundred_chars = "a" * 300
      allow(record.bib).to receive(:abstract).and_return([double(text: three_hundred_chars)])
      expect(subject.abstract.values.first.to_s).to eq(three_hundred_chars)
    end
  end

  context "#to_h and to_json" do
    it "returns the expected output" do
      allow(record).to receive(:retracted?).and_return(false)
      allow(record.bib).to receive(:title).and_return(double(text: "Some title"))
      allow(record.bib).to receive(:author).and_return(text("Some author"))
      allow(record.bib).to receive(:id).and_return("some_id")
      [:abstract, :journal_title, :volume, :issue, :publication_date, :pages].each do |field|
        allow(record.bib).to receive(field).and_return(nil)
      end

      allow(record.citation).to receive(:csl).and_return({})
      allow(record.citation).to receive(:ris).and_return([])
      expected = {
        title: {
          original: "Some title"
        },
        metadata: [
          {
            field: "Author",
            original: "Some author"
          }
        ],
        url: "#{S.base_url}/articles/record/some_id",
        citation: {
          ris: [],
          csl: {}
        }
      }
      expect(subject.to_h).to eq(expected)
      expect(subject.to_json).to eq(expected.to_json)
    end
  end
end
describe Search::Presenters::Record::Articles::Email do
  let(:record) do
    instance_double(Search::Models::Record::Articles,
      bib: instance_double(Search::Models::Record::Articles::Bib),
      holdings: instance_double(Search::Models::Record::Articles::Holdings),
      citation: instance_double(Search::Models::Record::Catalog::Citation))
  end
  subject do
    described_class.new(record)
  end
  context "#abstract" do
    it "is 240 characters when the text is longer than 300 characters" do
      allow(record.bib).to receive(:abstract).and_return([double(text: "a" * 301)])
      expect(subject.abstract.values.first.to_s).to eq("a" * 240 + "...")
    end
  end
  context "#table_headings" do
    it "has action and description" do
      expect(subject.holdings.list.first.table_headings).to contain_exactly("Action", "Description")
    end
  end
  context "#holdings" do
    it "has expected output for a full text lib key and alma holding" do
      allow(record).to receive(:retracted?).and_return(false)
      allow(record.bib).to receive(:id).and_return("some_id")
      lib_key_item = double(
        source: "lib_key", availability: "full_text", url: "http://lib-key-url"
      )
      alma_item = double(
        source: "alma", availability: "full_text", url: "http://alma_url"
      )

      allow(record.holdings).to receive(:items).and_return([lib_key_item, alma_item])
      rows = subject.holdings.list.first.rows
      lib_key_row = rows[0]
      alma_row = rows[1]
      expect(lib_key_row.count).to eq(2)
      expect(alma_row.count).to eq(2)

      expect(lib_key_row[0].text).to eq("View PDF")
      expect(lib_key_row[1].text).to eq("Full text available")
      expect(lib_key_row[1].intent).to eq("success")
      expect(alma_row[0].text).to eq("Go to item")
      expect(alma_row[1].text).to eq("Full text available")
      expect(alma_row[1].intent).to eq("success")
    end
  end
end
