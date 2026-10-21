class Search::Models::Record::Articles::Holdings
  def initialize(data)
    @holdings = data["holdings"]
  end

  def count
    @holdings.count
  end

  def items
    @holdings.map do |item|
      Item.new(item)
    end
  end

  class Item
    def initialize(item)
      @item = item
    end
    [:source, :availability, :url].each do |method|
      define_method(method) do
        @item.dig(method.to_s)
      end
    end
  end
end
