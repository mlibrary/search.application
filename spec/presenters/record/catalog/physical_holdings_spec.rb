RSpec.describe Search::Presenters::Record::Catalog::Holdings::Physical do
  let(:record) do
    create(:catalog_record)
  end
  let(:physical_holding) do
    record.holdings.physical.list.first
  end
  let(:physical_item) do
    physical_holding.items.first
  end
  subject do
    described_class.new(holding: physical_holding, bib: record.bib)
  end

  it "has a physical_holding partial" do
    expect(subject.partial).to eq("physical_holding")
  end

  context "#location_url" do
    it "has the url of the location" do
      expect(subject.location_url).to eq(physical_holding.physical_location.url)
    end
  end
  context "#heading" do
    it "has the text to display for the heading" do
      expect(subject.heading).to eq(physical_holding.physical_location.text)
    end
  end
  context "#table_headings" do
    it "has an array of table heading objects" do
      th = subject.table_headings
      expect(th[0].to_s).to eq("Action")
      expect(th[1].to_s).to eq("Description")
      expect(th[2].to_s).to eq("Status")
      expect(th[3].to_s).to eq("Call Number")
    end
    it "does not have description when description column would be empty" do
      allow(physical_item).to receive(:description).and_return(nil)

      th = subject.table_headings
      expect(th[0].to_s).to eq("Action")
      expect(th[1].to_s).to eq("Status")
      expect(th[2].to_s).to eq("Call Number")
    end
    it "has an appropriate css_class for the headings" do
      th = subject.table_headings
      expect(th[0].css_class).to eq("holding__table--heading-action")
      expect(th[3].css_class).to eq("holding__table--heading-call-number")
    end
  end
  context "#icon" do
    it "has the map location icon" do
      expect(subject.icon).to eq("location_on")
    end
  end

  context "#holding_info" do
    it "includes the public_note" do
      expect(subject.holding_info).to include(physical_holding.public_note)
    end
    it "includes the summary" do
      expect(subject.holding_info).to include(physical_holding.summary.first)
    end
    it "includes the floor location" do
      expect(subject.holding_info).to include(physical_holding.physical_location.floor)
    end

    it "only handles an array summary" do
      allow(physical_holding).to receive(:summary).and_return([Faker::Lorem.sentence, Faker::Lorem.sentence])
      expect(subject.holding_info.count).to eq(4)
    end

    it "only shows array elements that exist" do
      allow(physical_holding).to receive(:public_note).and_return(nil)
      expect(subject.holding_info.count).to eq(2)
    end

    it "only shows array elements that are not empty strings" do
      allow(physical_holding).to receive(:summary).and_return([""])
      expect(subject.holding_info.count).to eq(2)
    end
  end
  it "has items" do
    expect(subject.items.first.description.to_s).to eq(physical_item.description)
  end
  context "#rows" do
    it "has an array of displayable fields" do
      item_cells = subject.rows.first
      expect(item_cells[0].to_s).to eq("Get This")
      expect(item_cells[1].to_s).to eq(physical_item.description)
      expect(item_cells[2].to_s).to eq("Building use only")
      expect(item_cells[3].to_s).to eq(physical_item.call_number)
    end
    it "does not include description in array if there is no description in the column" do
      allow(physical_item).to receive(:description).and_return(nil)
      item_cells = subject.rows.first
      expect(item_cells[0].to_s).to eq("Get This")
      expect(item_cells[1].to_s).to eq("Building use only")
      expect(item_cells[2].to_s).to eq(physical_item.call_number)
    end
  end
end

# TODO: This needs to change. Should have an array of items. Need to pass
# whether or not the item column has any descriptions. This should live in the
# model.
RSpec.describe Search::Presenters::Record::Catalog::Holdings::Physical::Item do
  let(:record) do
    create(:catalog_record)
  end
  let(:item) { record.holdings.physical.list.first.items.first }
  subject do
    described_class.new(item: item, bib: record.bib)
  end

  context "#action" do
    it "has text Get This by default" do
      expect(subject.action.partial).to eq("link_to")
      expect(subject.action.text).to eq("Get This")
      expect(subject.action.url).to eq("#{S.base_url}/catalog/record/#{record.bib.id}/get-this/#{item.barcode}")
    end
    context "no action" do
      let(:expect_no_action) do
        expect(subject.action.partial).to eq("plain_text")
        expect(subject.action.text).to eq("N/A")
      end
      it "when barcode is nil" do
        allow(item).to receive(:barcode).and_return(nil)
        expect_no_action
      end
      it "when in SHAP GAME" do
        allow(item.physical_location.code).to receive(:library).and_return("SHAP")
        allow(item.physical_location.code).to receive(:location).and_return("GAME")
        allow(item).to receive(:process_type).and_return("WORK_ORDER_DEPARTMENT")
        expect_no_action
      end
      it "when 05 AAEL" do
        allow(item.physical_location.code).to receive(:library).and_return("AAEL")
        allow(item).to receive(:item_policy).and_return("05")
        expect_no_action
      end
      it "when 10 FLINT" do
        allow(item.physical_location.code).to receive(:library).and_return("FLINT")
        allow(item).to receive(:item_policy).and_return("10")
        expect_no_action
      end
    end
    context "finding aid"
    context "request_this"
  end

  it "has a description" do
    expect(subject.description.partial).to eq("plain_text")
    expect(subject.description.to_s).to eq(item.description)
  end

  it "has a status" do
    expect(subject.status.to_s).to eq("Building use only")
    expect(subject.status.partial).to eq("status")
    expect(subject.status.intent).to eq("success")
  end

  it "has a call number" do
    expect(subject.call_number.partial).to eq("plain_text")
    expect(subject.call_number.to_s).to eq(item.call_number)
  end
end
