RSpec.describe Search::Presenters::Record::Catalog::Holdings::FindingAids do
  let(:finding_aid_holding) do
    create(:finding_aid_holding)
  end
  subject do
    described_class.new(finding_aid_holding)
  end
  it "has a kind finding_aid" do
    expect(subject.kind).to eq("finding_aid")
  end

  it "has a location_url" do
    expect(subject.location_url).to eq(finding_aid_holding.physical_location.url)
  end

  it "has items" do
    first_item = subject.items.first
    expect(first_item.description.to_s).to eq(finding_aid_holding.items.first.description)
    expect(first_item.status.to_s).to eq("Building use only")
    expect(first_item.action.to_s).to eq("Request from finding aid")
  end
end
