RSpec.describe Search::Record::Bib::Catalog do
  before(:each) do
    @data = JSON.parse(fixture("record/bib/land_birds.json"))
  end
  subject do
    described_class.new(@data)
  end
  context "#title" do
    it "has a title" do
      expect(subject.title).to eq("Sanʼya no tori = Concise field guide to land birds / kaisetsu Saeki Akimitsu ; e Taniguchi Takashi.")
    end
  end
  context "#vernacular_title" do
    it "has a vernacular_title" do
      expect(subject.vernacular_title).to eq("山野の鳥 = Concise field guide to land birds / 解說佐伯彰光 ; 絵谷口高司.")
    end
    it "in nil if there is no vernacular_title" do
      @data["title"].delete_at(1)
      expect(subject.vernacular_title).to be_nil
    end
  end
  context "#format" do
    it "shows the icons for the formats in the marc" do
      format = subject.format.first
      expect(format.text).to eq("Book")
      expect(format.icon).to eq("book")
    end
  end
end
