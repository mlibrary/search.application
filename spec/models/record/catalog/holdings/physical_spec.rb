RSpec.describe Search::Models::Record::Catalog::Holdings::Physical do
  before(:each) do
    @data = {
      "holdings" => {
        "physical" => [
          "holding_id" => "22#{Faker::Number.number(digits: 12)}6381",
          "call_number" => "LB 2331.72 .S371 1990",
          "physical_location" => {
            "url" => "https://lib.umich.edu/locations-and-hours/hatcher-library",
            "text" => "Hatcher Graduate",
            "floor" => "6 South",
            "code" => {
              "library" => "HATCH",
              "location" => "GRAD"
            }
          },
          "public_note" => Faker::Lorem.sentence,
          "summary" => Faker::Lorem.paragraph
        ]
      }
    }
    @holding = @data["holdings"]["physical"].first
  end
  subject do
    described_class.new(@data)
  end

  context "#list" do
    it "is an array with different holdings and items" do
      holding = subject.list.first
      expect(holding.holding_id).to eq(@holding["holding_id"])
    end
  end
  context "a holding" do
    subject do
      described_class.new(@data).list.first
    end
  end
end

RSpec.describe Search::Models::Record::Catalog::Holdings::Physical::Holding do
  before(:each) do
    @data =
      {"holding_id" => "22#{Faker::Number.number(digits: 12)}6381",
       "call_number" => "LB 2331.72 .S371 1990",
       "physical_location" => {
         "url" => "https://lib.umich.edu/locations-and-hours/hatcher-library",
         "text" => "Hatcher Graduate",
         "floor" => "6 South",
         "code" => {
           "library" => "HATCH",
           "location" => "GRAD"
         }
       },
       "public_note" => Faker::Lorem.sentence,
       "summary" => Faker::Lorem.paragraph,
       "items" => [
         {
           "item_id" => "22#{Faker::Number.number(digits: 12)}6381",
           "barcode" => Faker::Number.number(digits: 8),
           "description" => Faker::Lorem.sentence
         }
       ]}
  end
  subject do
    described_class.new(@data)
  end
  [:holding_id, :call_number, :public_note, :summary].each do |method|
    context "##{method}" do
      it "returns a string" do
        expect(subject.public_send(method)).to eq(@data[method.to_s])
      end
    end
  end

  context "#items" do
    it "returns an array of Item objects" do
      expect(subject.items.first.barcode).to eq(@data["items"][0]["barcode"])
    end
  end

  context "#physical_location" do
    let(:physical_location) { @data["physical_location"] }
    [:url, :text, :floor].each do |method|
      context "##{method}" do
        it "returns a string" do
          expect(subject.physical_location.public_send(method)).to eq(physical_location[method.to_s])
        end
      end
    end

    context "#code" do
      it "has a library" do
        expect(subject.physical_location.code.library).to eq(physical_location["code"]["library"])
      end
      it "has a location" do
        expect(subject.physical_location.code.location).to eq(physical_location["code"]["location"])
      end
    end
  end
end

RSpec.describe Search::Models::Record::Catalog::Holdings::Physical::Item do
  before(:each) do
    @data = {
      "item_id" => "22#{Faker::Number.number(digits: 12)}6381",
      "barcode" => Faker::Number.number(digits: 8),
      "fulfillment_unit" => Faker::Lorem.word,
      "physical_location" => {
        "url" => Faker::Internet.url,
        "text" => "Hatcher Graduate",
        "floor" => "6 South",
        "code" => {
          "library" => "HATCH",
          "location" => "GRAD"
        },
        "temporary" => false
      },
      "call_number" => Faker::Lorem.word,
      "public_note" => Faker::Lorem.word,
      "process_type" => Faker::Lorem.word,
      "item_policy" => Faker::Lorem.word,
      "description" => Faker::Lorem.word,
      "inventory_number" => Faker::Lorem.word,
      "material_type" => Faker::Lorem.word,
      "url" => Faker::Internet.url
    }
  end
  subject do
    described_class.new(@data)
  end
  [:item_id, :barcode, :fulfillment_unit, :call_number, :public_note,
    :process_type, :description, :inventory_number, :material_type, :url].each do |method|
    context "##{method}" do
      it "returns a string" do
        expect(subject.public_send(method)).to eq(@data[method.to_s])
      end
    end
  end
  context "#physical_location" do
    context "#temporary?" do
      it "returns a boolean" do
        expect(subject.physical_location.temporary?).to eq(false)
      end
    end
  end
end
