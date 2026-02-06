describe Search::Actions::SMS do
  subject do
    # allow(@record).to receive(:bib).and_return(@bib)
    described_class.new(**@params)
  end
  context "#message" do
    it "returns n/total and the url" do
      @params = {
        index: 1,
        total: 10,
        url: Faker::Internet.url
      }
      expected = <<~TXT.strip
        1/10
        #{@params[:url]}
      TXT
      expect(subject.message).to eq expected
    end
  end
end
