RSpec.describe Search::Models::Record::Catalog::Citation do
  before(:each) do
    @data = {
      "citation" => {
        "tagged" => [
          {
            "content" => "MUSIC",
            "ris" => [
              "TY"
            ],
            "meta" => []
          },
          {
            "content" => "Some Author Name",
            "ris" => [
              "AU"
            ],
            "meta" => ["author"]
          },
          {
            "content" => "",
            "ris" => [
              "ER"
            ],
            "meta" => []
          }
        ]
      }
    }
  end
  subject do
    described_class.new(@data)
  end
  context "#meta_tags" do
    it "processes the meta tags appropriately" do
      expect(subject.meta_tags).to eq([
        {"name" => "author",
         "content" => "Some Author Name"}
      ])
    end
  end
end
