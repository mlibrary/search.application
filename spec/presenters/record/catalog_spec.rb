describe Search::Presenters::Record::Catalog::Full do
  before(:each) do
    @bib_stub = instance_double(Search::Models::Record::Catalog::Bib,
      title: "This is a title", vernacular_title: "This is a v title")
  end
  subject do
    described_class.new(OpenStruct.new(bib: @bib_stub))
  end
  context "#title" do
    it "returns a title array for both title and v title when v title is present" do
      title = subject.title
      expect(title.first.text).to eq("This is a title")
      expect(title.first.css_class).to eq("title")
      expect(title[1].text).to eq("This is a v title")
      expect(title[1].css_class).to eq("vernacular")
    end
    it "only returns a default script title when there isn't a vernacular title" do
      allow(@bib_stub).to receive(:vernacular_title).and_return(nil)
      title = subject.title
      expect(title.count).to eq(1)
      expect(title.first.text).to eq("This is a title")
      expect(title.first.css_class).to eq("title")
    end
  end
end
