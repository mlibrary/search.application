class Search::Models::Record::Catalog::Holdings::HathiTrust
  def initialize(data)
    @hathi_trust_items = data.dig("holdings", "hathi_trust_items")
  end

  def items
    @hathi_trust_items.map { |item| Item.new(item) }
  end

  class Item
    def initialize(item)
      @item = item
    end

    [:id, :rights, :description, :collection_code, :access, :source, :status].each do |method|
      define_method(method) do
        @item.dig(method.to_s)
      end
    end

    def url
      "http://hdl.handle.net/2027/#{id}"
    end
  end
end
