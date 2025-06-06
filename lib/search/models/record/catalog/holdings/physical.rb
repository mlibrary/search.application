class Search::Models::Record::Catalog::Holdings::Physical
  def initialize(data)
    @physical_holdings = data.dig("holdings", "physical")
  end

  def list
    @physical_holdings.map { |holding| Holding.new(holding) }
  end

  class Holding
    include Search::Models::Record::Catalog::Holdings::HasDescription
    def initialize(holding)
      @holding = holding
    end

    [:holding_id, :call_number, :public_note, :summary].each do |method|
      define_method(method) do
        @holding.dig(method.to_s)
      end
    end

    def physical_location
      PhysicalLocation.new(@holding["physical_location"])
    end

    def items
      @holding.dig("items")&.map { |item| Item.new(item) }
    end
  end

  class Item
    def initialize(item)
      @item = item
    end

    [:item_id, :barcode, :fulfillment_unit, :call_number, :public_note,
      :process_type, :item_policy, :description, :inventory_number,
      :material_type].each do |method|
      define_method(method) do
        @item.dig(method.to_s)
      end
    end

    def physical_location
      PhysicalLocation.new(@item["physical_location"])
    end
  end

  class PhysicalLocation
    attr_reader :url, :text, :floor
    def initialize(location)
      @location = location
      @url = @location["url"]
      @text = @location["text"]
      @floor = @location["floor"]
    end

    def temporary?
      !!@location["temporary"]
    end

    def code
      OpenStruct.new(library: @location.dig("code", "library"),
        location: @location.dig("code", "location"))
    end
  end
end
