class Search::Presenters::Record::Catalog::Holdings::FindingAids <
  Search::Presenters::Record::Catalog::Holdings::PhysicalBase
  def kind
    "finding_aid"
  end

  def items
    @holding.items.map { |x| Item.new(item: x) }
  end

  def empty?
    @holding.count == 0
  end

  class Item < Search::Presenters::Record::Catalog::Holdings::ItemBase
    def action
      ItemCell::LinkTo.new(text: "Request from finding aid", url: @item.url)
    end

    def status
      Status::Success.new("Building use only")
    end
  end
end
