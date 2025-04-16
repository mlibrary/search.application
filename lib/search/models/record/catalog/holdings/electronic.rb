class Search::Models::Record::Catalog::Holdings::Electronic
  def initialize(data)
    @electronic_items = data.dig("holdings", "electronic_items")
  end

  def items
    @electronic_items.map do |item|
      OpenStruct.new(url: item["url"], status: item["status"], note: item["note"])
    end
  end
end
