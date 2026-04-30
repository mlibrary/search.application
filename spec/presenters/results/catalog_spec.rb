describe Search::Presenters::Results::Catalog do
  let(:api_results) { JSON.parse(fixture("results/catalog.json")) }
  context "#filters" do
    it "has the filters in the expected order" do
      results_model = Search::Models::Results::Catalog.new(data: api_results, originating_uri: Addressable::URI.parse(S.base_url))
      subject = described_class.new(results_model)
      expect(subject.filters.first.name).to eq("Availability")
    end
  end
  context "#sort_options" do
    it "has a list of sort options starting with relevance" do
      results_model = Search::Models::Results::Catalog.new(data: api_results, originating_uri: Addressable::URI.parse(S.base_url))
      subject = described_class.new(results_model).sort_options.first
      expect(subject.name).to eq("Relevance")
      expect(subject.uid).to eq("relevance")
      expect(subject.selected).to eq("selected")
    end
    it "has a selected sort option based on the sort query string" do
      results_model = Search::Models::Results::Catalog.new(data: api_results, originating_uri: Addressable::URI.parse("#{S.base_url}/catalog?sort=title_asc"))
      subject = described_class.new(results_model).sort_options
      expect(subject.first.selected).to eq("")
      expect(subject[6].selected).to eq("selected")
    end
  end
end
