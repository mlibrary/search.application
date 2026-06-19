describe Search::ViewHelpers do
  let(:klass) do
    Class.new { include Search::ViewHelpers }
  end
  context "search_result_url" do
    it "removes duplicate positions" do
      record = Search::Presenters::Record::Catalog::Brief.new(create(:catalog_record, position: 2))
      uri = Addressable::URI.parse(klass.new.search_result_url(record: record, request_url: "#{S.base_url}/catalog?query=what&position=5"))
      expect(uri.query_hash["position"].class).to eq(String)
      expect(uri.query_hash["position"]).to eq("2")
    end
  end
end
