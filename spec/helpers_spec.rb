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
  context "link_to" do
    it "removes trailing slashes from urls" do
      subject = klass.new.link_to(body: "JSTOR Security Studies (Thematic Collection)", url: "https://www.jstor.org/security-studies/")
      expect(subject).not_to include("security-studies/")
    end
  end
end
