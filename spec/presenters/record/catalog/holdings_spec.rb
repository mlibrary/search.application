RSpec.describe Search::Presenters::Record::Catalog::Holdings do
  let(:record) do
    create(:catalog_record)
  end
  let(:ht_holdings) do
    record.holdings.hathi_trust
  end
  subject do
    described_class.new(record)
  end
  context "#list" do
    it "includes HathiTrust when it has items" do
      expect(subject.list.first.heading).to eq("HathiTrust Digital Library")
    end
    it "does not include HathiTrust when it does not have items" do
      allow(ht_holdings).to receive(:items).and_return([])
      expect(subject.list.first&.heading).not_to eq("HathiTrust Digital Library")
    end
  end
end
RSpec.describe Search::Presenters::Record::Catalog::Holdings::HathiTrust do
  let(:hathi_trust_holdings) { create(:hathi_trust_holdings) }
  let(:ht_item) { hathi_trust_holdings.items.first }

  subject do
    described_class.new(hathi_trust_holdings.items)
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
      expect(item.link.text).to eq(ht_item.status)
      expect(item.link.url).to eq(ht_item.url)
    end

    it "has a description" do
      expect(item.description.partial).to eq("plain_text")
      expect(item.description.text).to eq(ht_item.description)
    end

    it "has a source" do
      expect(item.source.partial).to eq("plain_text")
      expect(item.source.text).to eq(ht_item.source)
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::Holdings::Online do
  let(:holdings) { create(:catalog_holdings) }
  let(:alma_digital_item) { holdings.alma_digital.items.first }
  let(:electronic_item) { holdings.electronic.items.first }
  subject do
    described_class.new(holdings)
  end

  context "#heading" do
    it "is the correct string" do
      expect(subject.heading).to eq("Online Resources")
    end
  end
  context "#partial" do
    it "is an electronic_holding" do
      expect(subject.partial).to eq("electronic_holding")
    end
  end

  context "#empty?" do
    it "is true when there are no items" do
      allow(holdings.alma_digital).to receive(:items).and_return([])
      allow(holdings.electronic).to receive(:items).and_return([])
      expect(subject.empty?).to eq(true)
    end
    it "is false when there are items" do
      expect(subject.empty?).to eq(false)
    end
  end

  context "#items" do
    context "alma digital" do
      # Digital items come first
      let(:item) { subject.items.first }
      it "has a link" do
        expect(item.link.partial).to eq("link")
        expect(item.link.text).to eq("Available online")
        expect(item.link.url).to eq(alma_digital_item.url)
      end

      it "has a description" do
        expect(item.description.partial).to eq("plain_text")
        expect(item.description.text).to eq(alma_digital_item.label)
      end
      it "has a source" do
        expect(item.source.partial).to eq("plain_text")
        expect(item.source.text).to eq(alma_digital_item.public_note)
      end
    end
    context "electronic" do
      # Electronic items come last
      let(:item) { subject.items.last }
      it "has a link" do
        expect(item.link.partial).to eq("link")
        expect(item.link.url).to eq(electronic_item.url)
      end

      context "link text" do
        it "is 'Available online' when the status is 'Availabe'" do
          expect(electronic_item.status).to eq("Available")
          expect(item.link.text).to eq("Available online")
        end
        it "is 'Coming Soon' when status is 'Not Available'"
      end

      it "has a description" do
        expect(item.description.partial).to eq("plain_text")
        expect(item.description.text).to eq(electronic_item.description)
      end
      it "has a source" do
        expect(item.source.partial).to eq("plain_text")
        expect(item.source.text).to eq(electronic_item.note)
      end
    end
  end
end
