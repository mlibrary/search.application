RSpec.describe Search::Models::Record::Catalog::Holdings::AlmaDigital do
  before(:each) do
    @data = {
      "holdings" => {
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

  context "#items" do
    it "passes an array of items containing the url, status, and note" do
      first_item = subject.items.first
      expect(first_item.url).to eq("some_url")
      expect(first_item.delivery_description).to eq("some delivery description")
      expect(first_item.label).to eq("some label")
      expect(first_item.public_note).to eq("some note")
    end
  end
end
