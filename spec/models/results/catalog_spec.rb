RSpec.describe Search::Models::Results::Catalog do
  let(:data) { create(:catalog_api_one_result) }

  subject { described_class.new(data) }

  it "has catalog records" do
    expect(subject.records.first.class.name).to eq("Search::Models::Record::Catalog")
  end

  it "has a limit" do
    data["limit"] = 5
    expect(subject.limit).to eq(5)
  end
  it "has a total" do
    data["total"] = 5
    expect(subject.total).to eq(5)
  end
  it "has an offset" do
    data["offset"] = 1
    expect(subject.offset).to eq(1)
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
