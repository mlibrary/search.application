RSpec.describe Search::Models::Record::Catalog::Holdings::Electronic do
  before(:each) do
    @data = {
      "holdings" => {
        "electronic_items" => [
          {
            "url" => Faker::Internet.url,
            "status" => "available",
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
      expect(first_item.status).to eq(expected["status"])
      expect(first_item.note).to eq(expected["note"])
      expect(first_item.description).to eq(expected["description"])
    end
  end
end
