RSpec.describe Search::Models::Record::Catalog::Holdings::HathiTrust do
  before(:each) do
    @data = {
      "holdings" => {
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

  context "#items" do
    it "passes an array of items containing the url and the other info from the api" do
      first_item = subject.items.first
      expect(first_item.id).to eq("mdp.39015017893416")
      expect(first_item.rights).to eq("ic")
      expect(first_item.description).to eq("description")
      expect(first_item.access).to eq(false)
      expect(first_item.source).to eq("University of Michigan")
      expect(first_item.status).to eq("Search only (no full text)")
      expect(first_item.url).not_to be_nil
    end
    it "generates appropriate urls based on the hathi trust id" do
      first_item = subject.items.first
      expect(first_item.url).to eq("http://hdl.handle.net/2027/mdp.39015017893416")
    end
  end
end
