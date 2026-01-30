RSpec.describe Search::Models::Record::Catalog::Holdings::HathiTrust do
  def search_only_item
    {
      "id" => "mdp.#{Faker::Barcode.ean}",
      "rights" => "ic",
      "description" => Faker::Lorem.sentence,
      "collection_code" => "MIU",
      "access" => false,
      "source" => Faker::Educator.university,
      "status" => "Search only (no full text)"
    }
  end

  def full_text_item
    {
      "id" => "mdp.#{Faker::Barcode.ean}",
      "rights" => "pd",
      "description" => Faker::Lorem.sentence,
      "collection_code" => "MIU",
      "access" => true,
      "source" => Faker::Educator.university,
      "status" => "Full text"
    }
  end

  let(:data) {
    {"holdings" => {"hathi_trust_items" => []}}
  }
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
    described_class.new(data)
  end

  context "#items" do
    it "passes an array of items containing the url and the other info from the api" do
      item = search_only_item
      data["holdings"]["hathi_trust_items"].push(item)

      first_item = subject.items.first
      expect(first_item.id).to eq(item["id"])
      expect(first_item.rights).to eq("ic")
      expect(first_item.description).to eq(item["description"])
      expect(first_item.access).to eq(false)
      expect(first_item.source).to eq(item["source"])
      expect(first_item.status).to eq("Search only (no full text)")
      expect(first_item.url).not_to be_nil
    end
    it "generates appropriate urls based on the hathi trust id" do
      item = search_only_item
      data["holdings"]["hathi_trust_items"].push(item)

      first_item = subject.items.first
      expect(first_item.url).to eq("http://hdl.handle.net/2027/#{item["id"]}")
    end

    context "Item #full_text" do
      it "generates appropriate urls based on the hathi trust id" do
        item = search_only_item
        data["holdings"]["hathi_trust_items"].push(item)

        first_item = subject.items.first
        expect(first_item.full_text?).to eq(false)
      end
      it "generates appropriate urls based on the hathi trust id" do
        item = full_text_item
        data["holdings"]["hathi_trust_items"].push(item)

        first_item = subject.items.first
        expect(first_item.full_text?).to eq(true)
      end
    end
  end
  context "#full_text_items" do
    it "returns only the full text items" do
      so_item = search_only_item
      ft_item = full_text_item
      data["holdings"]["hathi_trust_items"].push(so_item)
      data["holdings"]["hathi_trust_items"].push(ft_item)

      expect(subject.full_text_items.count).to eq(1)
      expect(subject.full_text_items.first.id).to eq(ft_item["id"])
    end
  end
  context "#search_only_items" do
    it "returns only the full text items" do
      so_item = search_only_item
      ft_item = full_text_item
      data["holdings"]["hathi_trust_items"].push(so_item)
      data["holdings"]["hathi_trust_items"].push(ft_item)

      expect(subject.search_only_items.count).to eq(1)
      expect(subject.search_only_items.first.id).to eq(so_item["id"])
    end
  end

  context "#full_text_count" do
    it "returns only the full text items" do
      data["holdings"]["hathi_trust_items"].push(search_only_item)
      data["holdings"]["hathi_trust_items"].push(full_text_item)
      data["holdings"]["hathi_trust_items"].push(search_only_item)

      expect(subject.full_text_count).to eq(1)
    end
  end
  context "#search_only_count" do
    it "returns only the full text items" do
      data["holdings"]["hathi_trust_items"].push(full_text_item)
      data["holdings"]["hathi_trust_items"].push(search_only_item)
      data["holdings"]["hathi_trust_items"].push(full_text_item)

      expect(subject.search_only_count).to eq(1)
    end
  end
end
