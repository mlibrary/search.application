RSpec.describe Search::Models::Record::Catalog::Holdings do
  before(:each) do
    @data = {
      "holdings" => {
        "electronic_items" => [
          {
            "url" => "some_url",
            "status" => "available",
            "note" => "some note"
          }
        ],
        "hathi_trust_items" => [
          {
            "id" => "mdp.39015017893416",
            "rights" => "ic",
            "description" => "description",
            "collection_code" => "MIU",
            "access" => false,
            "source" => "University of Michigan",
            "status" => "Search only (no full text)"
          }
        ]
      }
    }
  end

  subject do
    described_class.new(@data)
  end

  context "#electronic" do
    it "returns electronic items" do
      first_item = subject.electronic.items.first
      expect(first_item.url).to eq("some_url")
      expect(first_item.status).to eq("available")
      expect(first_item.note).to eq("some note")
    end
  end
  context "#hathi_trust" do
    it "returns HathiTrust items" do
      first_item = subject.hathi_trust.items.first
      expect(first_item.rights).to eq("ic")
    end
  end
end
