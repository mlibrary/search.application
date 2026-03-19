describe Search::Presenters::Page::List do
  context "#actions" do
    it "does not include the link action" do
      subject = described_class.for(patron: nil, uri: nil).actions
      expect(subject.map { |x| x.uid }).to include("ris")
      expect(subject.map { |x| x.uid }).not_to include("link")
    end
  end
end
