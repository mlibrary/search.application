describe Search::Actions::RecordsData do
  let(:data) {
    {"catalog" => ["9912345"]}
  }
  subject do
    described_class.new(@data)
  end
  context "#text_urls" do
    it "returns appropriate catalog urls" do
      @data = data
      expect(subject.text_urls.first).to eq("#{S.base_url}/catalog/record/#{data["catalog"][0]}")
    end
  end
end
