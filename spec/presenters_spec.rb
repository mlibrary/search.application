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
  context "#add_filter_param" do
    it "adds the filter param to a give url" do
      uri = URI.parse("#{S.base_url}/catalog?query=whatever blah")
      expected = "#{uri}&filter.format=Audio%20%28music%29"

      expect(subject.add_filter_param(uri: uri, uid: "format", value: "Audio (music)")).to eq(expected)
    end
    it "adds the filter parameter when there is no other parameters" do
      uri = URI.parse("#{S.base_url}/catalog")
      expected = "#{uri}?filter.format=Audio%20%28music%29"

      expect(subject.add_filter_param(uri: uri, uid: "format", value: "Audio (music)")).to eq(expected)
    end
  end
  context "#remove_filter_param" do
    it "removes the filter param when it exists to a give url" do
      uri = URI.parse("#{S.base_url}/catalog?query=whatever blah&filter.format=Audio (music)")
      expected = URI.parse("#{S.base_url}/catalog?query=whatever blah").to_s

      expect(subject.remove_filter_param(uri: uri, uid: "format", value: "Audio (music)")).to eq(expected)
    end
    it "returns the same url when the filter param isn't there" do
      expected = URI.parse("#{S.base_url}/catalog?query=whatever blah")

      expect(subject.remove_filter_param(uri: expected, uid: "format", value: "Audio (music)")).to eq(expected.to_s)
    end
  end
end
