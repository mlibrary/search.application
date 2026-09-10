RSpec.describe Search::Models::Results::Catalog do
  let(:data) { create(:catalog_api_one_result) }

  context ".get_params filters" do
    it "does not contain any boolean filters" do
      result = described_class.get_params(
        uri: Addressable::URI.parse("#{S.base_url}/catalog?query=music,&filter.search_only=True&filter.search_only=false&filter.format=Music")
      )[:filters]

      expect(result).to eq(["format:Music", "library:aa"])
    end
    it "does not contain duplicate filters" do
      result = described_class.get_params(
        uri: Addressable::URI.parse("#{S.base_url}/catalog?filter.format=Music&filter.format=Music")
      )[:filters]

      expect(result).to eq(["format:Music", "library:aa"])
    end
  end

  subject { described_class.new(data: data, originating_uri: Addressable::URI.parse("#{S.base_url}/catalog")) }

  it "has catalog records" do
    expect(subject.records.first.class.name).to eq("Search::Models::Record::Catalog")
  end

  it "has pagination" do
    data["limit"] = 5
    data["total"] = 10
    data["offset"] = 0

    expect(subject.pagination.limit).to eq(5)
    expect(subject.pagination.total).to eq(10)
    expect(subject.pagination.current_page).to eq(1)
    expect(subject.pagination.first_index).to eq(1)
    expect(subject.pagination.last_index).to eq(5)
  end

  it "has a limit" do
    expect(subject.limit).to eq(10)
  end
  it "has a total" do
    expect(subject.total).to eq(1)
  end
  it "has an offset" do
    expect(subject.offset).to eq(0)
  end
  context "#filters" do
    it "has filters" do
      filter = subject.filters.first
      expect(filter.field).to eq(data["filters"].first["field"])
      expect(filter.values.first.value).to eq(data["filters"].first["values"].first["text"])
      expect(filter.values.first.count).to eq(data["filters"].first["values"].first["count"])
    end
  end
end
