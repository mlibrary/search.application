describe Search::Presenters::Results::Filter do
  context ".for" do
    it "returns and active filter when the params are in the uri" do
      params = {
        uri: URI.parse("#{S.base_url}/catalog?filter.place_of_publication=United%20States%20--%20Maryland"),
        uid: "place_of_publication",
        value: "United States -- Maryland",
        count: 151
      }
      expect(described_class.for(**params).active?).to eq(true)
    end
    it "returns an inactive filter when the params aren't in the uri" do
      params = {
        uri: URI.parse("#{S.base_url}/catalog"),
        uid: "place_of_publication",
        value: "United States -- Maryland",
        count: 151
      }
      expect(described_class.for(**params).active?).to eq(false)
    end
  end
end
describe Search::Presenters::Results::Filter::Inactive do
  let(:encoded_value) { "United%20States%20--%20Maryland" }
  before(:each) do
    @params = {
      uri: URI.parse("#{S.base_url}/catalog"),
      uid: "place_of_publication",
      value: "United States -- Maryland",
      count: 151
    }
  end
  subject do
    described_class.new(**@params)
  end
  context "#group_name" do
    it "returns an appropriately capitalized group name" do
      expect(subject.group_name).to eq("Place of Publication")
    end
  end
  context "to_s" do
    it "returns the value" do
      expect(subject.to_s).to eq(@params[:value])
    end
  end
  context "url" do
    it "adds the param to given url" do
      expected = "#{@params[:uri]}?filter.place_of_publication=#{encoded_value}"
      expect(subject.url).to eq(expected)
    end
  end
  context "#active?" do
    it "is false" do
      expect(subject.active?).to eq(false)
    end
  end
end

describe Search::Presenters::Results::Filter::Active do
  let(:encoded_value) { "United%20States%20--%20Maryland" }
  let(:catalog_url) { "#{S.base_url}/catalog" }
  before(:each) do
    @params = {
      uri: URI.parse("#{catalog_url}?filter.place_of_publication=#{encoded_value}"),
      uid: "place_of_publication",
      value: "United States -- Maryland",
      count: 151
    }
  end
  subject do
    described_class.new(**@params)
  end
  context "#group_name" do
    it "returns an appropriately capitalized group name" do
      expect(subject.group_name).to eq("Place of Publication")
    end
  end
  context "to_s" do
    it "returns group_name: value" do
      expect(subject.to_s).to eq("Place of Publication: United States -- Maryland")
    end
  end
  context "url" do
    it "removes the param to given url" do
      expect(subject.url).to eq(catalog_url)
    end
  end
  context "#active?" do
    it "is true" do
      expect(subject.active?).to eq(true)
    end
  end
end

describe Search::Presenters::Results::BooleanFilter do
  let(:catalog_url) { "#{S.base_url}/catalog" }
  let(:params) do
    {
      uri: Addressable::URI.parse("#{catalog_url}#{@filter}"),
      uid: "search_only",
      label: "some label",
      default: @default
    }
  end

  before(:each) do
    @filter = "?filter.search_only=true"
    @default = "false"
  end
  subject do
    described_class.for(**params)
  end
  context "active?" do
    it "is true when the when the value in the uri is true" do
      expect(subject.active?).to eq(true)
    end
    it "is false when the filter is missing" do
      @filter = ""
      expect(subject.active?).to eq(false)
    end
    it "is false when the filter is invalid" do
      @filter = "?filter.search_only=some_invalid_value"
      expect(subject.active?).to eq(false)
    end
    it "is true if any of the search only values are true" do
      @filter = "?filter.search_only=some_invalid_value&filter.search_only=true&filter.search_only=something_else"
      expect(subject.active?).to eq(true)
    end
  end
  context "url for default false" do
    it "when no filter is given, it includes filter as true" do
      @filter = ""
      expect(subject.url).to eq("#{catalog_url}?filter.search_only=true")
    end
    it "when filter is true is given, removes the filter (i.e. returns to default value)" do
      expect(subject.url).to eq(catalog_url)
    end
    it "when mix of true and invalid it removes all filters (returns to default value)" do
      @filter = "?filter.search_only=some_invalid_value&filter.search_only=true&filter.search_only=something_else"
      expect(subject.url).to eq(catalog_url)
    end
    it "includes filter as true when all invalid filters" do
      @filter = "?filter.search_only=some_invalid_value&filter.search_only=something_else"
      expect(subject.url).to eq("#{catalog_url}?filter.search_only=true")
    end
  end
  context "url for default true" do
    before(:each) do
      @default = "true"
      @filter = "?filter.search_only=false"
    end
    it "when no filter is given, it includes filter as false" do
      @filter = ""
      expect(subject.url).to eq("#{catalog_url}?filter.search_only=false")
    end
    it "when filter is false is given, removes the filter (i.e. returns to default value)" do
      expect(subject.url).to eq(catalog_url)
    end
    it "when mix of true and invalid it removes all filters (returns to default value)" do
      @filter = "?filter.search_only=some_invalid_value&filter.search_only=false&filter.search_only=something_else"
      expect(subject.url).to eq(catalog_url)
    end
    it "includes filter as true when all invalid filters" do
      @filter = "?filter.search_only=some_invalid_value&filter.search_only=something_else"
      expect(subject.url).to eq("#{catalog_url}?filter.search_only=false")
    end
  end
end
