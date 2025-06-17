RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse do
  before(:each) do
    @call_number = "UM1"
    @data = []
    3.times{@data.push(create(:shelf_browse_item))}
    stub_request(:get, "#{S.catalog_browse_url}/carousel?query=#{@call_number}")
      .to_return(status: 200, body: @data, headers: {})
  end

  subject do
    described_class.for(call_number: @call_number)
  end

  context "#items" do
    it "returns ShelfBrowseItemEnd" do
      expect(subject.items[1]).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItem)
    end
    it "returns ShelfBrowseItemEnd" do
      expect(subject.items[0]).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemEnd)
    end
    it "returns ShelfBrowseItemCurrent" do
      @data[0]["call_number"] = @call_number
      expect(subject.items[0]).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemCurrent)
    end
  end

  context "#browse_url" do
    it "has a browse url" do
      expect(subject.browse_url).to eq("https://search.lib.umich.edu/catalog/browse/callnumber?query=#{@call_number}")
    end
  end

  context "#each" do
    it "iterates over the records with call numbers" do
      record_call_numbers = []
      subject.each do |record|
        record_call_numbers << record.call_number
      end

      expect(record_call_numbers).to eq(@data.map { |d| d["call_number"] } )
    end
  end

  context "when call_number is nil" do
    it "returns nil" do
      @call_number = nil
      expect(subject).to be_nil
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemBase do
  before(:each) do
    @item = {
      "call_number" => "UM1",
      "title" => "Shelf Browse Item",
      "url" => "https://search.lib.umich.edu/everything/"
    }
  end

  subject do
    described_class.new(@item)
  end

  context "#attributes" do
    it "has attributes" do
      expect(subject.attributes).to eq("class=\"shelf-browse__carousel--item\"")
    end
  end

  context "#url" do
    it "has a url" do
      expect(subject.url).to eq(@item["url"])
    end
  end

  context "#has_url?" do
    context "when URL is present" do
      it "is true" do
        expect(subject.has_url?).to be true
      end
    end

    context "when URL is nil" do
      it "is false" do
        @item["url"] = nil
        expect(subject.has_url?).to be false
      end
    end
  end

  context "#table_label" do
    it "has a table label" do
      expect(subject.table_label).to eq("Catalog browse record information for #{@item["title"]}")
    end
  end

  context "#caption" do
    it "is nil by default" do
      expect(subject.caption).to be_nil
    end
  end

  context "#has_caption?" do
    it "is false" do
      expect(subject.has_caption?).to eq(false)
    end
  end

  context "#call_number" do
    it "returns a row" do
      expect(subject.call_number).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemRow)
    end
    it "has a header" do
      expect(subject.call_number.header).to eq("Call Number")
    end
    it "has a uid" do
      expect(subject.call_number.uid).to eq("call_number")
    end
    it "has a value" do
      expect(subject.call_number.value).to eq(@item["call_number"])
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItem do
  before(:each) do
    @item = {
      "author" => "Author",
      "book_cover_url" => "https://search.lib.umich.edu/favicon.svg",
      "date" => "2025",
      "title" => "Title",
      "call_number" => "UM1"
    }
    @index = 2
  end

  subject do
    described_class.new(@item, @index)
  end

  context "#book_cover" do
    it "returns a row" do
      expect(subject.book_cover).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemRow)
    end
    it "has a header" do
      expect(subject.book_cover.header).to eq("Book Cover")
    end
    it "has a uid" do
      expect(subject.book_cover.uid).to eq("book_cover")
    end
    it "has a value" do
      expect(subject.book_cover.value).to eq("<img src=\"#{@item["book_cover_url"]}\" onerror=\"this.src='/images/placeholders/placeholder-#{@index % 15}.svg'\" alt=\"Book cover for #{@item["title"]}\">")
    end
  end

  [
    {uid: :title, header: "Title"},
    {uid: :author, header: "Author"},
    {uid: :date, header: "Date"}
  ].each do |f|
    context "##{f[:uid]}" do
      it "returns a row" do
        expect(subject.public_send(f[:uid])).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemRow)
      end
      it "has a header" do
        expect(subject.public_send(f[:uid]).header).to eq(f[:header])
      end
      it "has a uid" do
        expect(subject.public_send(f[:uid]).uid).to eq(f[:uid])
      end
      it "has a value" do
        expect(subject.public_send(f[:uid]).value).to eq(@item[f[:uid].to_s])
      end
    end
  end

  context "#rows" do
    it "sets an array of rows that only contain #book_cover, #title, #author, #date and #call_number" do
      expect(subject.rows.map { |row| row.value }).to eq([:book_cover, :title, :author, :date, :call_number].map { |method_name| subject.public_send(method_name).value })
    end

    it "excludes nil rows" do
      @item["author"] = nil
      expect(subject.rows.map { |row| row.value }).to eq([:book_cover, :title, :date, :call_number].map { |method_name| subject.public_send(method_name).value })
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemCurrent do
  before(:each) do
    @item = {
      "call_number" => "UM1"
    }
    @index = 23
  end

  subject do
    described_class.new(@item, @index)
  end

  context "#attributes" do
    it "has attributes" do
      expect(subject.attributes).to eq("class=\"shelf-browse__carousel--item highlighted-record current-record\" data-page=\"0\"")
    end
  end

  context "#caption" do
    it "has a caption" do
      expect(subject.caption).to eq("Current Record")
    end
  end

  context "#has_caption?" do
    it "is true" do
      expect(subject.has_caption?).to be true
    end
  end

  context "#url" do
    it "is nil" do
      expect(subject.url).to be_nil
    end
  end

  context "#has_url?" do
    it "is false" do
      expect(subject.has_url?).to be false
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemEnd do
  before(:each) do
    @item = {
      "call_number" => "UM1"
    }
  end

  subject do
    described_class.new(@item)
  end

  context "#attributes" do
    it "has attributes" do
      expect(subject.attributes).to eq("class=\"shelf-browse__carousel--item highlighted-record\"")
    end
  end

  context "#caption" do
    it "has a caption" do
      expect(subject.caption).to eq("<span class=\"material-symbols-rounded\" aria-hidden=\"true\">list</span>")
    end
  end

  context "#has_caption?" do
    it "is true" do
      expect(subject.has_caption?).to be true
    end
  end

  context "#navigate" do
    it "returns a row" do
      expect(subject.navigate).to be_a(Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemRow)
    end
    it "has a header" do
      expect(subject.navigate.header).to eq("Navigate")
    end
    it "has a uid" do
      expect(subject.navigate.uid).to eq("navigate")
    end
    it "has a value" do
      expect(subject.navigate.value).to eq("Continue browsing in call number list")
    end
  end

  context "#rows" do
    it "sets an array of rows that are only :navigate and :call_number" do
      expect(subject.rows.map { |row| row.value }).to eq([subject.navigate.value, subject.call_number.value])
    end

    it "excludes nil rows" do
      @item["call_number"] = nil
      expect(subject.rows.map { |row| row.value }).to eq([subject.navigate.value])
    end
  end

  context "#url" do
    it "has a url" do
      expect(subject.url).to eq("https://search.lib.umich.edu/catalog/browse/callnumber?query=#{@item["call_number"]}")
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseItemRow do
  before(:each) do
    @item = {
      "header" => "Shelf Browse Item",
      "uid" => "shelf_browse_item",
      "value" => "This is a shelf browse item"
    }
  end

  subject do
    described_class.for(header: @item["header"], uid: @item["uid"], value: @item["value"])
  end

  context "when it has a value" do
    it "sets the header" do
      expect(subject.header).to eq(@item["header"])
    end

    it "sets the uid" do
      expect(subject.uid).to eq(@item["uid"])
    end

    it "sets the value" do
      expect(subject.value).to eq(@item["value"])
    end
  end

  context "when value is nil" do
    it "returns nil" do
      @item["value"] = nil
      expect(subject).to be_nil
    end
  end
end
