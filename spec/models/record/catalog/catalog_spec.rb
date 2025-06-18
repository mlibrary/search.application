RSpec.describe Search::Models::Record::Catalog do
  let(:data) { create(:catalog_api_record) }

  subject { described_class.new(data) }

  it "has an indexing_date" do
    expect(subject.indexing_date).to eq(Date.parse(data["indexing_date"]))
  end
  it "has marc output" do
    marc_json = {something: "else"}
    data["marc"] = marc_json
    expect(subject.marc).to eq(marc_json)
  end
end
