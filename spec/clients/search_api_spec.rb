describe Search::Clients::SearchAPI do
  subject do
    described_class.new
  end
  context "boolean_params" do
    it "handles catalog search_only true" do
      expect(subject.boolean_params(["search_only:true"])).to eq({ht_search_only: true})
    end
    it "handles catalog search_only false" do
      expect(subject.boolean_params(["search_only:false"])).to eq({})
    end
    it "handles catalog search_only both true and false" do
      expect(subject.boolean_params(["search_only:false", "search_only:true"])).to eq({ht_search_only: true})
    end
    it "handles articles key flipping" do
      expect(subject.boolean_params(["holdings_only:false"], kind: :articles)).to eq({include_citation_only: true})
    end
  end
  context "articles_filters" do
    it "handles dates that look correct" do
      filters = ["subject:Art", "date:1900-1910"]
      expected = ["subject:Art", "date:1900,1910"]
      expect(subject.articles_filters(filters)).to eq(expected)
    end
    it "handles takes only the first two dates when there are multiple - dates that look correct" do
      filters = ["subject:Art", "date:1900-1910-2000"]
      expected = ["subject:Art", "date:1900,1910"]
      expect(subject.articles_filters(filters)).to eq(expected)
    end
    it "sends only one year when one is given" do
      filters = ["date:1900"]
      expected = ["date:1900"]
      expect(subject.articles_filters(filters)).to eq(expected)
    end
  end
end
