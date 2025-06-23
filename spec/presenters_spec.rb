RSpec.describe Search::Presenters do
  context "#title" do
    it "defaults to Library Search when empty" do
      expect(subject.title).to eq("Library Search")
    end
    it "returns the titles as a hyphen separated string" do
      @titles = ["Lorem", "Ipsum"]
      expect(subject.title(@titles)).to eq("#{@titles[0]} - #{@titles[1]} - Library Search")
    end
  end
end
