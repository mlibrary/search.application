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

  def location_text
    @holding.physical_location.text
  end

  def holding_info
    [
      @holding.public_note,
      @holding.summary,
      @holding.physical_location.floor
    ].flatten.reject(&:blank?)
  end

  def empty?
    false
  end

  def items
    @holding.items.map { |x| Item.new(item: x, bib: @bib) }
  end

  class Item
    def initialize(item:, bib:, record: nil)
      @item = item
      @bib = bib
    end

    def description
      OpenStruct.new(partial: "plain_text", text: @item.description)
    end

    def call_number
      OpenStruct.new(partial: "plain_text", text: @item.call_number)
    end

    def action
      if no_action?
        OpenStruct.new(partial: "plain_text", text: "N/A")
      else # Get This
        OpenStruct.new(partial: "link_to", text: "Get This",
          url: "#{S.base_url}/catalog/record/#{@bib.id}/get-this/#{@item.barcode}")
      end
    end

    def status
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
  end
end
