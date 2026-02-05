describe Search::Presenters::Record::Catalog::EmailHoldings do
  def create_record(*holdings)
    create(:catalog_record, holdings: holdings)
  end
  subject do
    described_class.new(@record)
  end
  context "#too_many?" do
    it "returns false when there is only one physical holding" do
      @record = create_record(:physical)
      expect(subject.too_many?).to eq(false)
    end
    it "is true when the item count for physical is greater than three" do
      @record = create_record(:physical)
      allow(@record.holdings.physical.list.first).to receive(:count).and_return(4)
      expect(subject.too_many?).to eq(true)
    end
    it "is true when there is an online holding with 4 items" do
      @record = create_record(:alma_digital, :electronic)
      allow(@record.holdings.alma_digital).to receive(:count).and_return(2)
      allow(@record.holdings.electronic).to receive(:count).and_return(2)
      expect(subject.too_many?).to eq(true)
    end
    it "is true when there is one finding aid and 2 electronic and one phyiscal" do
      @record = create_record(:alma_digital, :electronic, :finding_aids)
      allow(@record.holdings.alma_digital).to receive(:count).and_return(2)
      expect(subject.too_many?).to eq(true)
    end
    it "is true when there are 4 HT full text items" do
      @record = create_record(:hathi_trust)
      allow(@record.holdings.hathi_trust).to receive(:full_text_count).and_return(4)
      expect(subject.too_many?).to eq(true)
    end
    it "is false when there are less than 4 HT search only items and nothing else" do
      @record = create_record(:hathi_trust)
      allow(@record.holdings.hathi_trust).to receive(:full_text_count).and_return(0)
      allow(@record.holdings.hathi_trust).to receive(:search_only_count).and_return(3)
      expect(subject.too_many?).to eq(false)
    end
    it "is true when there are more than 4 HT search only items and nothing else" do
      @record = create_record(:hathi_trust)
      allow(@record.holdings.hathi_trust).to receive(:full_text_count).and_return(0)
      allow(@record.holdings.hathi_trust).to receive(:search_only_count).and_return(4)
      expect(subject.too_many?).to eq(true)
    end
    it "is false when there are more than 3 HT search only items and one of any other item" do
      @record = create_record(:hathi_trust, :physical)
      allow(@record.holdings.hathi_trust).to receive(:search_only_count).and_return(4)
      expect(subject.too_many?).to eq(false)
    end
  end
  context "#list" do
    it "sends only Full text items when there are any" do
      @record = create_record(:alma_digital, :electronic)
      full_text_ht = create(:hathi_trust_item)
      so_ht = create(:hathi_trust_item)
      allow(so_ht).to receive(:status).and_return("Search only (no full text)")
      allow(so_ht).to receive(:full_text?).and_return(false)
      allow(@record.holdings.hathi_trust).to receive(:search_only_count).and_return(1)
      allow(@record.holdings.hathi_trust).to receive(:full_text_count).and_return(1)
      allow(@record.holdings.hathi_trust).to receive(:items).and_return([so_ht, full_text_ht])

      items = subject.list.first.items
      expect(items.first.description.to_s).to eq(full_text_ht.description)
      expect(items.count).to eq(1)
    end
    it "sends Search only items when that's all there is" do
      @record = create_record(:hathi_trust)
      so_ht = @record.holdings.hathi_trust.items.first
      allow(so_ht).to receive(:status).and_return("Search only (no full text)")
      allow(so_ht).to receive(:full_text?).and_return(false)
      allow(@record.holdings.hathi_trust).to receive(:search_only_count).and_return(1)
      allow(@record.holdings.hathi_trust).to receive(:full_text_count).and_return(0)

      items = subject.list.first.items
      expect(items.first.description.to_s).to eq(so_ht.description)
      expect(items.count).to eq(1)
    end
  end
end
