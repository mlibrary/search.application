RSpec.describe Search::Models::Record::Catalog::Holdings::Electronic do
  before(:each) do
    @data = {
      "holdings" => {
        "electronic_items" => [
          {
            "url" => Faker::Internet.url,
            "is_available" => true,
            "note" => Faker::Lorem.sentence,
            "description" => Faker::Lorem.sentence
          }
        ]
      }
    }
  end

  subject do
    described_class.new(@data)
  end

  context "#items" do
    it "passes an array of items containing the url, status, description, and note" do
      expected = @data["holdings"]["electronic_items"][0]
      first_item = subject.items.first
      expect(first_item.url).to eq(expected["url"])
      expect(first_item.available?).to eq(true)
      expect(first_item.note).to eq(expected["note"])
      expect(first_item.description).to eq(expected["description"])
    end
  end
  context "#has_description?" do
    it "is true when at least one item has a description" do
      # make the first item have an empty description
      @data["holdings"]["electronic_items"].unshift({"description" => nil})
      expect(subject.has_description?).to eq(true)
    end
    it "is false when none of the items has a description" do
      @data["holdings"]["electronic_items"][0]["description"] = nil
      expect(subject.has_description?).to eq(false)
    end
  end
end
