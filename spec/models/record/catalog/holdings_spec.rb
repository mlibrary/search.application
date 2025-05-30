RSpec.describe Search::Models::Record::Catalog::Holdings do
  before(:each) do
    @data = {
      "holdings" => {
        "electronic_items" => [
          {
            "url" => "some_url",
            "is_available" => true,
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
        ],
        "alma_digital_items" => [
          {
            "url" => "some_url",
            "delivery_description" => "some delivery description",
            "label" => "some label",
            "public_note" => "some note"
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
      expect(first_item.available?).to eq(true)
      expect(first_item.note).to eq("some note")
    end
  end
  context "#hathi_trust" do
    it "returns HathiTrust items" do
      first_item = subject.hathi_trust.items.first
      expect(first_item.rights).to eq("ic")
    end
  end
  context "#alma_digital" do
    it "returns Alma Digital items" do
      first_item = subject.alma_digital.items.first
      expect(first_item.delivery_description).to eq("some delivery description")
    end
  end
end
