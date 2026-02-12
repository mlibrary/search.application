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
  context "#first" do
    it "returns the datastore and id of the first item" do
      @data = data
      result = subject.first
      expect(result.datastore).to eq("catalog")
      expect(result.id).to eq(@data["catalog"][0])
    end
  end

  context "#single?" do
    it "returns true when there is only one record" do
      @data = data
      expect(subject.single?).to eq(true)
    end
    it "returns false when a datastore has multiple records" do
      @data = data
      @data["catalog"].push("some_other_record")
      expect(subject.single?).to eq(false)
    end
    it "returns false when two datastores have a single record" do
      @data = data
      @data["articles"] = ["some_other_record"]
      expect(subject.single?).to eq(false)
    end
  end
end
