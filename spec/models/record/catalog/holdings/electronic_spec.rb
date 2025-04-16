RSpec.describe Search::Models::Record::Catalog::Holdings::Electronic do
  before(:each) do
    @data = {
      "holdings" => {
        "electronic_items" => [
          {
            "url" => "some_url",
            "status" => "available",
            "note" => "some note"
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
      expect(first_item.status).to eq("available")
      expect(first_item.note).to eq("some note")
    end
  end
end
