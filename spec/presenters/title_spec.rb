RSpec.describe Search::Presenters::Title do
  before(:each) do
    @titles = []
  end

  subject do
    described_class.new(@titles)
  end

  context "#to_s" do
    it "defaults to Library Search when empty" do
      expect(subject.to_s).to eq("Library Search")
    end
    it "returns the titles as a hyphen separated string" do
      @titles = ["Lorem", "Ipsum"]
      expect(subject.to_s).to eq("#{@titles[0]} - #{@titles[1]} - Library Search")
    end
  end
end
