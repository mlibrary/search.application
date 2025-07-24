RSpec.describe Search::Models::Record::Catalog::Holdings::FindingAids do
  before(:each) do
    @data = {
      "holdings" => {
        "finding_aids" => {
          "physical_location" => {
            "url" => "https://lib.umich.edu/locations-and-hours/hatcher-library",
            "text" => "Hatcher Graduate",
            "floor" => "6 South",
            "code" => {
              "library" => "HATCH",
              "location" => "GRAD"
            }
          },
          "items" => [
            {
              "url" => Faker::Internet.url,
              "description" => Faker::Lorem.sentence,
              "call_number" => Faker::Lorem.sentence
            }
          ]
        }
      }
    }
  end

  subject do
    described_class.new(@data)
  end

  context "#items" do
    it "passes an array of items containing the url, call_number, and description" do
      expected = @data["holdings"]["finding_aids"]["items"][0]
      first_item = subject.items.first
      expect(first_item.url).to eq(expected["url"])
      expect(first_item.call_number).to eq(expected["call_number"])
      expect(first_item.description).to eq(expected["description"])
    end
  end

  context "#physical_location" do
    let(:physical_location) { @data["holdings"]["finding_aids"]["physical_location"] }
    [:url, :text, :floor].each do |method|
      context "##{method}" do
        it "returns a string" do
          expect(subject.physical_location.public_send(method)).to eq(physical_location[method.to_s])
        end
      end
    end
  end
end
