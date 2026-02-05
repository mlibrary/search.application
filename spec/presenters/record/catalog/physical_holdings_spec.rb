RSpec.describe Search::Presenters::Record::Catalog::Holdings::Physical do
  let(:record) do
    create(:catalog_record, holdings: [:physical])
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

  it "is kind physical_holding" do
    expect(subject.kind).to eq("physical_holding")
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
      allow(physical_holding).to receive(:has_description?).and_return(false)

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
      expect(item_cells[2].to_s).to eq("On shelf")
      expect(item_cells[3].to_s).to eq(physical_item.call_number)
    end
    it "does not include description in array if there is no description in the column" do
      allow(physical_holding).to receive(:has_description?).and_return(false)
      item_cells = subject.rows.first
      expect(item_cells[0].to_s).to eq("Get This")
      expect(item_cells[1].to_s).to eq("On shelf")
      expect(item_cells[2].to_s).to eq(physical_item.call_number)
    end
  end
end

RSpec.describe Search::Presenters::Record::Catalog::Holdings::Physical::Item do
  let(:item) { create(:physical_item) }

  hour_loans = [
    {value: "06", desc: "4-hour loan"},
    {value: "07", desc: "2-hour loan"},
    {value: "1 Day Loan", desc: "1-day loan"}
  ]
  hour_loans.freeze

  subject do
    described_class.new(item: item)
  end

  context "#action" do
    it "has text Get This by default" do
      expect(subject.action.partial).to eq("link_to")
      expect(subject.action.text).to eq("Get This")
      expect(subject.action.url).to eq(item.url)
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
      it "when url is nil" do
        allow(item).to receive(:url).and_return(nil)
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

    context "request_this" do
      ["SPEC", "BENT", "CLEM"].each do |library|
        context library do
          it "has a Request this url" do
            allow(item.physical_location.code).to receive(:library).and_return(library)
            expect(subject.action.partial).to eq("link_to")
            expect(subject.action.text).to eq("Request This")
            expect(subject.action.url).to eq(item.url)
          end
        end
      end
    end
  end

  it "has a description" do
    expect(subject.description.partial).to eq("plain_text")
    expect(subject.description.to_s).to eq(item.description)
  end

  it "has a call number" do
    expect(subject.call_number.partial).to eq("plain_text")
    expect(subject.call_number.to_s).to eq(item.call_number)
  end

  context "#status" do
    context "No Policy; No Process type" do
      before(:each) do
        allow(item).to receive(:item_policy).and_return(nil)
        allow(item).to receive(:process_type).and_return(nil)
      end
      it "returns 'On shelf' success status" do
        expect(subject.status.to_s).to eq("On shelf")
        expect(subject.status.partial).to eq("status")
        expect(subject.status.intent).to eq("success")
        expect(subject.status.icon).to eq("check_circle")
      end
      context "reserves item" do
        # SEARCH-1444 SEARCH-1461
        ["CAR", "RESI", "RESP", "RESC"].each do |location|
          it "returns reserves success status for #{location}" do
            allow(item.physical_location.code).to receive(:location).and_return(location)
            expect(subject.status.to_s).to include("On reserve at #{item.physical_location.text}")
            expect(subject.status.intent).to eq("success")
          end
        end
      end
      context "temporarily located item" do
        # SEARCH-1501
        it "returns temporary location success status" do
          allow(item.physical_location).to receive(:temporary?).and_return(true)
          expect(subject.status.to_s).to include("Temporary location: #{item.physical_location.text}")
          expect(subject.status.intent).to eq("success")
        end
        it "returns temporary location error status for FVL LRC physical_location" do
          allow(item.physical_location).to receive(:temporary?).and_return(true)
          allow(item.physical_location.code).to receive(:library).and_return("FVL")
          allow(item.physical_location.code).to receive(:location).and_return("LRC")
          expect(subject.status.to_s).to include("Unavailable")
          expect(subject.status.intent).to eq("error")
          expect(subject.status.icon).to eq("error")
        end
      end
      context "games" do
        it "returns games success status" do
          allow(item.physical_location.code).to receive(:library).and_return("SHAP")
          allow(item.physical_location.code).to receive(:location).and_return("GAME")
          expect(subject.status.to_s).to eq("CVGA room use only; check out required")
          expect(subject.status.intent).to eq("success")
        end
      end
    end
    context "Fulfillment unit Limited" do
      before(:each) do
        allow(item).to receive(:item_policy).and_return(nil)
        allow(item).to receive(:process_type).and_return(nil)
        allow(item).to receive(:fulfillment_unit).and_return("Limited")
      end
      context "Building use only" do
        it "returns success status" do
          expect(subject.status.to_s).to eq("Building use only")
          expect(subject.status.intent).to eq("success")
        end
      end
      context "Temporary location building use only" do
        it "returns success status" do
          allow(item.physical_location).to receive(:temporary?).and_return(true)
          expect(subject.status.to_s).to include("Temporary location: #{item.physical_location.text}; Building use only")
          expect(subject.status.intent).to eq("success")
        end
      end
    end
    context "Item Policy 08 (aka No Loan)" do
      before(:each) do
        allow(item).to receive(:item_policy).and_return("08")
        allow(item).to receive(:process_type).and_return(nil)
      end
      context "Building use only" do
        it "returns success status" do
          expect(subject.status.to_s).to eq("Building use only")
          expect(subject.status.intent).to eq("success")
        end
      end
      context "Temporary location building use only" do
        it "returns success status" do
          allow(item.physical_location).to receive(:temporary?).and_return(true)
          expect(subject.status.to_s).to include("Temporary location: #{item.physical_location.text}; Building use only")
          expect(subject.status.intent).to eq("success")
        end
      end
    end
    context "Reading room library" do
      before(:each) do
        allow(item).to receive(:item_policy).and_return(nil)
        allow(item).to receive(:process_type).and_return(nil)
      end
      ["CLEM", "BENT", "SPEC"].each do |library|
        context library do
          it "returns success status" do
            allow(item.physical_location.code).to receive(:library).and_return(library)
            expect(subject.status.to_s).to eq("Reading Room use only")
            expect(subject.status.intent).to eq("success")
          end
        end
      end
    end
    context "On shelf Hour loans" do
      before(:each) do
        allow(item).to receive(:process_type).and_return(nil)
      end
      hour_loans.each do |policy|
        context "Policy: #{policy[:desc]}" do
          it "returns On shelf and length of time" do
            allow(item).to receive(:item_policy).and_return(policy[:value])
            expect(subject.status.to_s).to eq("On shelf (#{policy[:desc]})")
            expect(subject.status.intent).to eq("success")
          end
        end
      end
    end
    context "process_type: LOAN" do
      before(:each) do
        allow(item).to receive(:process_type).and_return("LOAN")
      end
      context "Basic loan" do
        it "returns Checkout out warning" do
          expect(subject.status.to_s).to eq("Checked out")
          expect(subject.status.intent).to eq("warning")
          expect(subject.status.icon).to eq("warning")
        end
      end
      context "reserves item" do
        # SEARCH-1444
        ["CAR", "RESI", "RESP", "RESC"].each do |location|
          it "returns reserves success status for #{location}" do
            allow(item.physical_location.code).to receive(:location).and_return(location)
            expect(subject.status.to_s).to include("Checked out: On reserve at #{item.physical_location.text}")
            expect(subject.status.intent).to eq("warning")
          end
        end
      end
      hour_loans.each do |policy|
        context "Policy: #{policy[:desc]}" do
          it "returns On shelf and length of time" do
            allow(item).to receive(:item_policy).and_return(policy[:value])
            expect(subject.status.to_s).to eq("Checked out: (#{policy[:desc]})")
            expect(subject.status.intent).to eq("warning")
          end
        end
      end
    end
    [
      {code: "ACQ", text: "On order: Use Get This to place a request"},
      {code: "CLAIM_RETURNED_LOAN", text: "Item unavailable: Last user claims it was returned"},
      {code: "HOLDSHELF", text: "On hold shelf"},
      {code: "LOST_ILL", text: "Item unavailable: Lost"},
      {code: "LOST_LOAN", text: "Item unavailable: Lost"},
      {code: "LOST_LOAN_AND_PAID", text: "Item unavailable: Lost"},
      {code: "TECHNICAL", text: "Item unavailable: In process"},
      {code: "TRANSIT", text: "Item in transit between U-M libraries"},
      {code: "TRANSIT_TO_REMOTE_STORAGE", text: "Item in transit between U-M libraries"},
      {code: "WORK_ORDER_DEPARTMENT", text: "In Process: Use Get This to request a copy"}
    ].each do |process_type|
      context "Process type: #{process_type[:code]}" do
        it "returns expected text with warning" do
          allow(item).to receive(:process_type).and_return(process_type[:code])
          expect(subject.status.to_s).to eq(process_type[:text])
          expect(subject.status.intent).to eq("warning")
        end
      end
    end
    [
      {code: "ILL", text: "Checked out: Use Get This to request I.L.L."},
      {code: "MISSING", text: "Item unavailable: Missing"}
    ].each do |process_type|
      context "Process type: #{process_type[:code]}" do
        it "returns expected text with error" do
          allow(item).to receive(:process_type).and_return(process_type[:code])
          expect(subject.status.to_s).to eq(process_type[:text])
          expect(subject.status.intent).to eq("error")
        end
      end
    end
    context "CVGA in a WORK_ORDER_DEPARTMENT" do
      # From LIBSEARCH-883
      it "returns error Unavailable status" do
        allow(item).to receive(:process_type).and_return("WORK_ORDER_DEPARTMENT")
        allow(item.physical_location.code).to receive(:library).and_return("SHAP")
        allow(item.physical_location.code).to receive(:location).and_return("GAME")
        expect(subject.status.to_s).to eq("Unavailable")
        expect(subject.status.intent).to eq("error")
      end
    end
  end
end
