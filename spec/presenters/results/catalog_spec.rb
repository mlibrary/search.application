describe Search::Presenters::Results::Catalog do
  let(:api_results) { JSON.parse(fixture("results/catalog.json")) }
  let(:specialists) { Search::Models::Specialists.new(JSON.parse(fixture("results/specialists.json"))) }
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
  context "#show_specialists?(index)" do
    def results_model(data)
      Search::Models::Results::Catalog.new(data: data, originating_uri: Addressable::URI.parse(S.base_url))
    end
    it "is true when the current page is 0 and the index is 2 there are three or more results and there are any specialists" do
      1.upto(4).each do
        api_results["records"].push(
            Factories::CatalogAPIRecord.new(fields: [:id, :title, :citation, :holdings]).to_h
          )
      end
      subject = described_class.new(results_model(api_results), specialists)
      expect(subject.show_specialists?(2)).to eq(true)
      expect(subject.show_specialists?(1)).to eq(false)
      expect(subject.show_specialists?(3)).to eq(false)
    end
    it "is false when the current page is not 0" do
      api_results["offset"] = 1
      subject = described_class.new(results_model(api_results), specialists)
      expect(subject.show_specialists?(2)).to eq(false)
    end
    it "is after the first record when there is only 1" do
      subject = described_class.new(results_model(api_results), specialists)
      expect(subject.show_specialists?(0)).to eq(true)
      expect(subject.show_specialists?(1)).to eq(false)
    end
    it "is after the second record when there is only 2" do
      subject = described_class.new(results_model(api_results), specialists)
      api_results["records"].push(
          Factories::CatalogAPIRecord.new(fields: [:id, :title, :citation, :holdings]).to_h
        )
      expect(subject.show_specialists?(0)).to eq(false)
      expect(subject.show_specialists?(1)).to eq(true)
      expect(subject.show_specialists?(2)).to eq(false)
    end

    it "is false if there are no specialists" do
      subject = described_class.new(results_model(api_results), [])
      expect(subject.show_specialists?(0)).to eq(false)
      expect(subject.show_specialists?(1)).to eq(false)
      expect(subject.show_specialists?(2)).to eq(false)
    end
  end
end
