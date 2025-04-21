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
      OpenStruct.new(partial: "link_to", text: "Get This",
        url: "#{S.base_url}/catalog/record/#{@bib.id}/get-this/#{@item.barcode}")
    end

    def status
    end
  end
end
