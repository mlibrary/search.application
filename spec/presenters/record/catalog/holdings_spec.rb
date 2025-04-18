RSpec.describe Search::Presenters::Record::Catalog::Holdings do
  let(:record) do
    holdings = instance_double(Search::Models::Record::Catalog::Holdings, hathi_trust: @ht_holdings)
    double("Search::Models::Record::Catalog#for", holdings: holdings)
  end
  before(:each) do
    @ht_item = instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust::Item)
    @ht_holdings = instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust,
      items: [@ht_item])
  end
  subject do
    described_class.new(record)
  end
  context "#list" do
    it "includes HathiTrust when it has items" do
      expect(subject.list.first.heading).to eq("HathiTrust Digital Library")
    end
    it "does not include HathiTrust when it does not have items" do
      allow(@ht_holdings).to receive(:items).and_return([])
      expect(subject.list.first&.heading).not_to eq("HathiTrust Digital Library")
    end
  end
end
RSpec.describe Search::Presenters::Record::Catalog::Holdings::HathiTrust do
  before(:each) do
    @ht_item = instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust::Item,
      url: Faker::Internet.url,
      source: Faker::Educator.university,
      description: Faker::Lorem.sentence,
      status: "Full text")
  end

  subject do
    described_class.new([@ht_item])
  end

  context "#heading" do
    it "is the correct string" do
      expect(subject.heading).to eq("HathiTrust Digital Library")
    end
  end
  context "#partial" do
    it "is an electronic_holding" do
      expect(subject.partial).to eq("electronic_holding")
    end
  end

  context "#empty?" do
    it "is true when there are no items" do
      s = described_class.new([])
      expect(s.empty?).to eq(true)
    end
    it "is false when there are items" do
      expect(subject.empty?).to eq(false)
    end
  end

  context "#items" do
    let(:item) { subject.items.first }
    it "has a link" do
      expect(item.link.partial).to eq("link")
      expect(item.link.text).to eq(@ht_item.status)
      expect(item.link.url).to eq(@ht_item.url)
    end

    it "has a description" do
      expect(item.description.partial).to eq("plain_text")
      expect(item.description.text).to eq(@ht_item.description)
    end
    it "has a source" do
      expect(item.source.partial).to eq("plain_text")
      expect(item.source.text).to eq(@ht_item.source)
    end
  end
end
