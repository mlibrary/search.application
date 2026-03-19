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
end
