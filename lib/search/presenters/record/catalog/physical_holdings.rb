class Search::Presenters::Record::Catalog::Holdings::PhysicalBase
  TableHeading = Search::Presenters::Record::Catalog::Holdings::TableHeading
  def initialize(holding)
    @holding = holding
  end

  [:kind, :items, :empty?].each do |m|
    define_method m do
      raise NotImplementedError
    end
  end
  def icon
    "location_on"
  end

  def location_url
    @holding.physical_location.url
  end

  def heading
    @holding.physical_location.text
  end

  def count
    @holding.count
  end

  def has_description?
    @holding.has_description?
  end

  def table_headings
    result = ["Action"]
    result.push("Description") if has_description?
    result.push("Status")
    result.push("Call Number")
    result.map { |x| TableHeading.new(x) }
  end

  def rows
    items.map do |item|
      result = [item.action]
      result.push(item.description) if has_description?
      result.push(item.status)
      result.push(item.call_number)
      result
    end
  end
end

class Search::Presenters::Record::Catalog::Holdings::ItemBase
  ItemCell = Search::Presenters::Record::Catalog::Holdings::ItemCell
  def initialize(item:)
    @item = item
  end

  def description
    ItemCell::PlainText.new(@item.description)
  end

  def call_number
    ItemCell::PlainText.new(@item.call_number)
  end
  [:action, :status].each do |m|
    define_method m do
      raise NotImplementedError
    end
  end
  class Status < ItemCell
    attr_reader :text, :intent, :icon
    def initialize(intent:, text:, icon:)
      @intent = intent
      @text = text
      @icon = icon
    end

    def partial
      "status"
    end

    class Success < self
      def initialize(text)
        @text = text
      end

      def intent
        "success"
      end

      def icon
        "check_circle"
      end
    end

    class Warning < self
      def initialize(text)
        @text = text
      end

      def intent
        "warning"
      end

      def icon
        "warning"
      end
    end

    class Error < self
      def initialize(text)
        @text = text
      end

      def intent
        "error"
      end

      def icon
        "error"
      end
    end
  end
end

class Search::Presenters::Record::Catalog::Holdings::Physical <
  Search::Presenters::Record::Catalog::Holdings::PhysicalBase
  def initialize(holding:, bib: nil)
    @holding = holding
    @bib = bib
  end

  def empty?
    false
  end

  def kind
    "physical_holding"
  end

  def holding_info
    [
      @holding.public_note,
      @holding.summary,
      @holding.physical_location.floor
    ].flatten.reject(&:blank?)
  end

  def items
    @holding.items.map { |x| Item.new(item: x) }
  end

  class Item < Search::Presenters::Record::Catalog::Holdings::ItemBase
    def action
      if no_action?
        ItemCell::PlainText.new("N/A")
      elsif in_reading_room_library?
        ItemCell::LinkTo.new(text: "Request This", url: @item.url)
      else # Get This
        ItemCell::LinkTo.new(text: "Get This",
          url: @item.url)
      end
    end

    def status
      if in_reading_room_library?
        Status::Success.new("Reading Room use only")
      elsif checked_out?
        if in_reserves?
          Status::Warning.new("Checked out: On reserve at #{@item.physical_location.text}")
        elsif hour_loan?
          Status::Warning.new("Checked out: (#{hour_loan_policy_text})")
        else
          Status::Warning.new("Checked out")
        end
      elsif @item.process_type.present?
        if game_work_order?
          Status::Error.new("Unavailable")
        elsif error_process?
          Status::Error.new(process_type_text)
        else
          Status::Warning.new(process_type_text)
        end
      elsif building_use_only?
        if @item.physical_location.temporary?
          Status::Success.new("Temporary location: #{@item.physical_location.text}; Building use only")
        else
          Status::Success.new("Building use only")
        end
      elsif in_reserves?
        Status::Success.new("On reserve at #{@item.physical_location.text}")
      elsif @item.physical_location.temporary?
        if in_language_research_center?
          Status::Error.new("Unavailable")
        else
          Status::Success.new("Temporary location: #{@item.physical_location.text}")
        end
      elsif in_game?
        Status::Success.new("CVGA room use only; check out required")
      elsif hour_loan?
        Status::Success.new("On shelf (#{hour_loan_policy_text})")
      else
        Status::Success.new("On shelf")
      end
    end

    private

    def in_game?
      in_library?("SHAP") && in_location?("GAME")
    end

    def in_language_research_center?
      in_library?("FVL") && in_location?("LRC")
    end

    def in_reading_room_library?
      ["CLEM", "BENT", "SPEC"].any? { |code| in_library?(code) }
    end

    def in_reserves?
      ["CAR", "RESI", "RESP", "RESC"].any? { |code| in_location?(code) }
    end

    def building_use_only?
      @item.fulfillment_unit == "Limited" || @item.item_policy == "08"
    end

    def in_library?(code)
      @item.physical_location.code.library == code
    end

    def in_location?(code)
      @item.physical_location.code.location == code
    end

    def checked_out?
      @item.process_type == "LOAN"
    end

    def hour_loan?
      ["06", "07", "1 Day Loan"].include?(@item.item_policy)
    end

    def hour_loan_policy_text
      case @item.item_policy
      when "06"
        "4-hour loan"
      when "07"
        "2-hour loan"
      when "1 Day Loan"
        "1-day loan"
      else
        ""
      end
    end

    def game_work_order?
      in_game? && @item.process_type == "WORK_ORDER_DEPARTMENT"
    end

    def error_process?
      ["MISSING", "ILL"].include?(@item.process_type)
    end

    def process_type_text
      case @item.process_type
      when "ACQ"
        "On order: Use Get This to place a request"
      when "CLAIM_RETURNED_LOAN"
        "Item unavailable: Last user claims it was returned"
      when "HOLDSHELF"
        "On hold shelf"
      when "ILL"
        "Checked out: Use Get This to request I.L.L."
      when "LOST_ILL"
        "Item unavailable: Lost"
      when "LOST_LOAN"
        "Item unavailable: Lost"
      when "LOST_LOAN_AND_PAID"
        "Item unavailable: Lost"
      when "MISSING"
        "Item unavailable: Missing"
      when "TECHNICAL"
        "Item unavailable: In process"
      when "TRANSIT"
        "Item in transit between U-M libraries"
      when "TRANSIT_TO_REMOTE_STORAGE"
        "Item in transit between U-M libraries"
      when "WORK_ORDER_DEPARTMENT"
        "In Process: Use Get This to request a copy"
      else
        ""
      end
    end

    def no_action?
      return true if @item.barcode.nil? || @item.url.nil?
      return true if in_game? && @item.process_type == "WORK_ORDER_DEPARTMENT"
      return true if in_library?("AAEL") && @item.item_policy == "05"
      return true if in_library?("FLINT") && @item.item_policy == "10"
      false
    end
  end
end
