RSpec.describe Search::Presenters::ShelfBrowseItemRow do
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
