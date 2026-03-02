RSpec.describe Search::Models::Results::Catalog do
  let(:data) { create(:catalog_api_one_result) }

  subject { described_class.new(data) }

  it "has catalog records" do
    expect(subject.records.first.class.name).to eq("Search::Models::Record::Catalog")
  end

  xit "has a limit" do
  end
  xit "has a total" do
  end
  xit "has an offset" do
  end
  context "#filters" do
    xit "has filters" do
      filter = subject.filters.first
      expect(filter.field).to eq(data["filters"].first["field"])
      expect(filter.values.first.to_s).to eq(data["filters"].first["values"].first["text"])
      expect(filter.values.first.text).to eq(data["filters"].first["values"].first["text"])
      expect(filter.values.first.count).to eq(data["filters"].first["values"].first["count"])
    end
  end
end
