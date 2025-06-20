class Search::Models::Record::Catalog::Holdings::Electronic
  def initialize(data)
    @electronic_items = data.dig("holdings", "electronic_items")
  end

  def count
    @electronic_items.count
  end

  def has_description?
    @electronic_items.any? { |x| x["description"].present? }
  end

  def items
    @electronic_items.map do |item|
      Item.new(url: item["url"], is_available: item["is_available"], note: item["note"],
        description: item["description"])
    end
  end

  class Item
    attr_reader :url, :note, :description
    def initialize(url:, is_available:, note:, description:)
      @url = url
      @note = note
      @is_available = is_available
      @description = description
    end

    def available?
      @is_available
    end
  end
end
