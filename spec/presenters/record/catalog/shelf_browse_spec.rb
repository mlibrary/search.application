RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse do
  before(:each) do
    @call_number = "PN1995.9.F67 D432 2000"
  end

  subject do
    described_class.for(call_number: @call_number)
  end

  def browse_url
    "https://search.lib.umich.edu/catalog/browse/callnumber?query=#{@call_number}"
  end

  context "when call_number is nil" do
    before { @call_number = nil }

    it "returns nil" do
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
      before { @item["url"] = nil }

      it "is false" do
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
      "title" => "Title"
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
    it "sets an array of rows that are only :book_cover, :title, :author, :date and :call_number" do
      allow(subject).to receive(:attributes).and_return("Attributes row")
      allow(subject).to receive(:author).and_return("Author row")
      allow(subject).to receive(:book_cover).and_return("Book cover row")
      allow(subject).to receive(:call_number).and_return("Call Number row")
      allow(subject).to receive(:date).and_return("Date row")
      allow(subject).to receive(:title).and_return("Title row")

      expect(subject.rows).to eq(["Book cover row", "Title row", "Author row", "Date row", "Call Number row"])
    end

    it "excludes nil rows" do
      allow(subject).to receive(:author).and_return(nil)
      allow(subject).to receive(:book_cover).and_return("Book cover row")
      allow(subject).to receive(:call_number).and_return("Call Number row")
      allow(subject).to receive(:date).and_return("Date row")
      allow(subject).to receive(:title).and_return("Title row")

      expect(subject.rows).to eq(["Book cover row", "Title row", "Date row", "Call Number row"])
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::ShelfBrowse::ShelfBrowseCurrentItem do
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
      allow(subject).to receive(:call_number).and_return("Call Number row")
      allow(subject).to receive(:caption).and_return("Caption row")
      allow(subject).to receive(:navigate).and_return("Navigate row")

      expect(subject.rows).to eq(["Navigate row", "Call Number row"])
    end

    it "excludes nil rows" do
      allow(subject).to receive(:navigate).and_return(nil)
      allow(subject).to receive(:call_number).and_return("Call Number row")

      expect(subject.rows).to eq(["Call Number row"])
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
    before { @item["value"] = nil }

    it "returns nil" do
      expect(subject).to be_nil
    end
  end
end
