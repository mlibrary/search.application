RSpec.describe Search::Presenters::Actions::Action::Link do
  url = "/catalog?query=example"
  before(:each) do
    @uri = Addressable::URI.parse(url)
  end

  subject do
    described_class.new(@uri)
  end

  context "#uri" do
    it "returns the full URI as a string" do
      expect(subject.uri).to eq(url)
    end

    it "returns the URI without query parameters if it contains `/record`" do
      @uri = Addressable::URI.parse("catalog/record/123?query=example")
      expect(subject.uri).to eq("catalog/record/123")
    end
  end
end
