RSpec.describe Search::Presenters::Browse do
  before(:each) do
    @datastore = "onlinejournals"
  end

  subject do
    described_class.new(datastore: @datastore)
  end

  context "#has_browse?" do
    it "returns true for datastores that support browse" do
      expect(subject.has_browse?).to be true
    end

    it "returns false for datastores that do not support browse" do
      datastore = "unsupported_datastore"
      subject = described_class.new(datastore: datastore)
      expect(subject.has_browse?).to be false
    end
  end

  context "#url" do
    it "returns the correct URL for the browse page" do
      expect(subject.url).to eq("/#{@datastore}/browse")
    end
  end

  context "#titles" do
    it "returns a Titles presenter" do
      expect(subject.titles).to be_a(Search::Presenters::Browse::Titles)
    end
  end

  context "#academic_discipline" do
    it "returns an AcademicDisciplines presenter" do
      expect(subject.academic_discipline).to be_a(Search::Presenters::Browse::AcademicDisciplines)
    end
  end
end
