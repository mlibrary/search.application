class Search::Models::Record::Catalog::Holdings::HathiTrust
  def initialize(data)
    @hathi_trust_items = data.dig("holdings", "hathi_trust_items") || []
  end

  def count
    @count ||= @hathi_trust_items.count
  end

  def has_description?
    @hathi_trust_items.any? { |x| x["description"].present? }
  end

  def items
    @hathi_trust_items.map { |item| Item.new(item) }
  end

  class Item
    def initialize(item)
      @item = item
    end

    [:id, :rights, :description, :collection_code, :access, :status, :source].each do |method|
      define_method(method) do
        @item.dig(method.to_s)
      end
    end

    def url
      "http://hdl.handle.net/2027/#{id}"
    end
  end
end
