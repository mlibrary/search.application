describe Search::Presenters::Results::Catalog do
  context "#filters" do
    it "has the filters in the expected order" do
      api_results = JSON.parse(fixture("results/catalog.json"))
      results_model = Search::Models::Results::Catalog.new(data: api_results, originating_uri: S.base_url)
      subject = described_class.new(results_model)
      expect(subject.filters.first.name).to eq("Availability")
    end
  end
end
