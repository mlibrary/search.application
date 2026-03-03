describe Addressable::URI do
  context "#query_hash" do
    it "returns a hash" do
      url = "#{S.base_url}/?one=one&two=two&one=1"
      actual = Addressable::URI.parse(url).query_hash
      expect(actual).to eq(
        {
          "one" => ["one", "1"],
          "two" => "two"
        }
      )
    end
  end
end
