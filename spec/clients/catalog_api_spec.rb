describe Search::Clients::CatalogAPI do
  context "boolean_params" do
    it "handles catalog search_only true" do
      subject = described_class.new.boolean_params(["search_only:true"])
      expect(subject).to eq({ht_search_only: true})
    end
    it "handles catalog search_only false" do
      subject = described_class.new.boolean_params(["search_only:false"])
      expect(subject).to eq({})
    end
    it "handles catalog search_only both true and false" do
      subject = described_class.new.boolean_params(["search_only:false", "search_only:true"])
      expect(subject).to eq({ht_search_only: true})
    end
    it "handles articles key flipping" do
      subject = described_class.new.boolean_params(["um_library_materials_only:false"], kind: :articles)

      expect(subject).to eq({include_citation_only: true})
    end
  end
end
