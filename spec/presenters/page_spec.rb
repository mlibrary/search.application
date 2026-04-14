describe Search::Presenters::Page::List do
  context "#actions" do
    it "does not include the link action" do
      subject = described_class.for(patron: nil, uri: nil).actions
      expect(subject.map { |x| x.uid }).to include("ris")
      expect(subject.map { |x| x.uid }).not_to include("link")
    end
  end

  context "#show_holdings?" do
    it "is false" do
      subject = described_class.for(patron: nil, uri: nil).show_holdings?
      expect(subject).to eq(false)
    end
  end
end

describe Search::Presenters::Page::Results do
  context "#show_holdings?" do
    it "is true" do
      subject = described_class.new(datastore: Search::Datastores.find("catalog"), uri: nil, patron: nil, results: []).show_holdings?
      expect(subject).to eq(true)
    end
  end
  context "#clear_filters_url" do
    it "removes the filters from the link" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1")
      subject = described_class.new(datastore: Search::Datastores.find("catalog"), uri: uri, patron: nil, results: [])
      param_keys = Addressable::URI.parse(subject.clear_filters_url).query_hash.keys
      expect(param_keys).to include("query")
      expect(param_keys).to include("page")
      expect(param_keys).not_to include("filter.availability")
      expect(param_keys).not_to include("filter.subject")
    end
  end
end
