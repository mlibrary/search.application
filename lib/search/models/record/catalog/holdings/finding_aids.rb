class Search::Models::Record::Catalog::Holdings::FindingAids
  def initialize(data)
    @finding_aids = data.dig("holdings", "finding_aids")
  end

  def count
    items.count
  end

  def has_description?
    items.any? { |x| x.description.present? }
  end

  def physical_location
    Search::Models::Record::Catalog::Holdings::Physical::PhysicalLocation.new(@finding_aids["physical_location"])
  end

  def items
    @items ||= @finding_aids["items"]&.map do |item|
      Item.new(item)
    end
  end

  class Item
    attr_reader :url, :call_number, :description
    def initialize(item)
      @url = item["url"]
      @call_number = item["call_number"]
      @description = item["description"]
    end
  end
end
