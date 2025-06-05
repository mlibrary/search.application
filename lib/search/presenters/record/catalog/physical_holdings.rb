class Search::Presenters::Record::Catalog::Holdings::Physical
  def initialize(holding:, bib: nil)
    @holding = holding
    @bib = bib
  end

  def partial
    "physical_holding"
  end

  def location_url
    @holding.physical_location.url
  end

  def icon
    "location_on"
  end

  def heading
    @holding.physical_location.text
  end

  def holding_info
    [
      @holding.public_note,
      @holding.summary,
      @holding.physical_location.floor
    ].flatten.reject(&:blank?)
  end

  def table_headings
    ["Action", "Description", "Status", "Call Number"]
  end

  def empty?
    false
  end

  def items
    @holding.items.map { |x| Item.new(item: x, bib: @bib) }
  end

  class Item
    ItemCell = Search::Presenters::Record::Catalog::Holdings::ItemCell

    def initialize(item:, bib:, record: nil)
      @item = item
      @bib = bib
    end

    def to_a
      [
        action, description, status, call_number
      ]
    end

    def description
      ItemCell::PlainText.new(@item.description)
    end

    def call_number
      ItemCell::PlainText.new(@item.call_number)
    end

    def action
      if no_action?
        ItemCell::PlainText.new("N/A")
      else # Get This
        # TODO: id not showing!
        ItemCell::LinkTo.new(text: "Get This",
          url: "#{S.base_url}/catalog/record/#{@bib.id}/get-this/#{@item.barcode}")
      end
    end

    def status
      Status.new(intent: "success", text: "Building use only", icon: "check_circle")
    end

    private

    def in_game?
      in_library?("SHAP") && in_location?("GAME")
    end

    def in_library?(code)
      @item.physical_location.code.library == code
    end

    def in_location?(code)
      @item.physical_location.code.location == code
    end

    def no_action?
      return true if @item.barcode.nil?
      return true if in_game? && @item.process_type == "WORK_ORDER_DEPARTMENT"
      return true if in_library?("AAEL") && @item.item_policy == "05"
      return true if in_library?("FLINT") && @item.item_policy == "10"
      false
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
    end
  end
end
