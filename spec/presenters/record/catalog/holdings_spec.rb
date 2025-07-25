RSpec.describe Search::Presenters::Record::Catalog::Holdings do
  let(:record) do
    create(:catalog_record)
  end
  let(:ht_holdings) do
    record.holdings.hathi_trust
  end
  let(:alma_digital_holdings) do
    record.holdings.alma_digital
  end
  let(:electronic_holdings) do
    record.holdings.electronic
  end
  let(:finding_aids_holding) do
    record.holdings.finding_aids
  end
  let(:physical) do
    record.holdings.physical
  end
  subject do
    described_class.new(record)
  end
  context "#list" do
    it "includes HathiTrust when it has items" do
      expect(subject.list.first.heading).to eq("HathiTrust Digital Library")
    end
    it "does not include HathiTrust when it does not have items" do
      allow(ht_holdings).to receive(:count).and_return(0)
      expect(subject.list.first&.heading).not_to eq("HathiTrust Digital Library")
    end
    it "includes Online when there are online items" do
      expect(subject.list[1]&.heading).to eq("Online Resources")
    end
    it "does not include Online when there are none" do
      allow(alma_digital_holdings).to receive(:count).and_return(0)
      allow(electronic_holdings).to receive(:count).and_return(0)
      expect(subject.list[1]&.heading).not_to eq("Online Resources")
    end
    it "includes physical items when there are no finding aids" do
      allow(finding_aids_holding).to receive(:count).and_return(0)
      expect(subject.list[2].kind).to eq("physical_holding")
    end
    it "does not include physical when there are finding aids" do
      expect(subject.list[2].kind).to eq("finding_aid")
      expect(subject.list.count).to eq(3)
    end
  end
end
RSpec.describe Search::Presenters::Record::Catalog::Holdings::HathiTrust do
  let(:hathi_trust_holdings) { create(:hathi_trust_holdings) }
  let(:ht_item) { hathi_trust_holdings.items.first }

  subject do
    described_class.new(hathi_trust_holdings)
  end

  context "#icon" do
    it "is the online icon" do
      expect(subject.icon).to eq("devices")
    end
  end

  context "#heading" do
    it "is the correct string" do
      expect(subject.heading).to eq("HathiTrust Digital Library")
    end
  end
  context "#kind" do
    it "is an electronic_holding" do
      expect(subject.kind).to eq("electronic_holding")
    end
  end

  context "#empty?" do
    it "is true when there are no items" do
      allow(hathi_trust_holdings).to receive(:count).and_return(0)
      expect(subject.empty?).to eq(true)
    end
    it "is false when there are items" do
      expect(subject.empty?).to eq(false)
    end
  end

  context "#table_headings" do
    it "has an array of table headings" do
      th = subject.table_headings
      expect(th[0].to_s).to eq("Link")
      expect(th[1].to_s).to eq("Description")
      expect(th[2].to_s).to eq("Source")
    end
    it "does not include description if there isn't one" do
      allow(hathi_trust_holdings).to receive(:has_description?).and_return(false)
      th = subject.table_headings
      expect(th[0].to_s).to eq("Link")
      expect(th[1].to_s).to eq("Source")
    end
  end

  context "#items" do
    let(:item) { subject.items.first }
    it "has a link" do
      expect(item.link.partial).to eq("link_to")
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
    it "has an array of cells in the correct order" do
      cells = item.to_a
      expect(cells[0].to_s).to eq(ht_item.status)
      expect(cells[1].to_s).to eq(ht_item.description)
      expect(cells[2].to_s).to eq(ht_item.source)
    end
  end

  context "#rows" do
    it "has an array of cells" do
      cells = subject.rows.first
      expect(cells[0].to_s).to eq(ht_item.status)
      expect(cells[1].to_s).to eq(ht_item.description)
      expect(cells[2].to_s).to eq(ht_item.source)
    end
    it "does not include the description if there isn't one" do
      allow(hathi_trust_holdings).to receive(:has_description?).and_return(false)
      cells = subject.rows.first
      expect(cells[0].to_s).to eq(ht_item.status)
      expect(cells[1].to_s).to eq(ht_item.source)
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

  context "#icon" do
    it "is the online icon" do
      expect(subject.icon).to eq("devices")
    end
  end

  context "#kind" do
    it "is online" do
      expect(subject.kind).to eq("online")
    end
  end

  context "#table_headings" do
    it "has an array of table headings" do
      th = subject.table_headings
      expect(th[0].to_s).to eq("Link")
      expect(th[1].to_s).to eq("Description")
      expect(th[2].to_s).to eq("Source")
    end
    it "does not include description if there isn't one" do
      allow(holdings.electronic).to receive(:has_description?).and_return(false)
      allow(holdings.alma_digital).to receive(:has_description?).and_return(false)
      th = subject.table_headings
      expect(th[0].to_s).to eq("Link")
      expect(th[1].to_s).to eq("Source")
    end
  end

  context "#empty?" do
    it "is true when there are no items" do
      allow(holdings.alma_digital).to receive(:count).and_return(0)
      allow(holdings.electronic).to receive(:count).and_return(0)
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
        expect(item.link.partial).to eq("link_to")
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
        expect(item.link.partial).to eq("link_to")
        expect(item.link.url).to eq(electronic_item.url)
      end

      context "link text" do
        it "is 'Available online' when the status is 'Availabe'" do
          expect(electronic_item.available?).to eq(true)
          expect(item.link.text).to eq("Available online")
        end
        it "is 'Coming Soon' when status is 'Not Available'" do
          allow(electronic_item).to receive(:available?).and_return(false)
          expect(item.link.text).to eq("Coming Soon")
        end
      end

      context "description" do
        it "has a description" do
          expect(item.description.partial).to eq("plain_text")
          expect(item.description.text).to eq(electronic_item.description)
        end
        it "has coming-soon releated text when unavailable" do
          allow(electronic_item).to receive(:available?).and_return(false)
          expect(item.description.text).to include("Link will update")
          expect(item.description.text).to include(electronic_item.description)
        end
      end
      it "gets its source from the note" do
        expect(item.source.partial).to eq("plain_text")
        expect(item.source.text).to eq(electronic_item.note)
      end
    end
  end
  context "#rows" do
    it "has an array of cells" do
      cells = subject.rows.first
      expect(cells[0].to_s).to eq("Available online")
      expect(cells[1].to_s).to eq(alma_digital_item.label)
      expect(cells[2].to_s).to eq(alma_digital_item.public_note)
    end
    it "does not include the description if there isn't one" do
      allow(holdings.electronic).to receive(:has_description?).and_return(false)
      allow(holdings.alma_digital).to receive(:has_description?).and_return(false)
      cells = subject.rows.first
      expect(cells[0].to_s).to eq("Available online")
      expect(cells[1].to_s).to eq(alma_digital_item.public_note)
    end
  end
end
