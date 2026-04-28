require "search/presenters/record/catalog/finding_aids_holding"
class Search::Presenters::Record::Onlinejournals::Holdings::FindingAids <
  Search::Presenters::Record::Catalog::Holdings::FindingAids

  class Item < Search::Presenters::Record::Catalog::Holdings::FindingAids::Item
    def action
      ItemCell::LinkTo.new(text: "Request from finding aid", url: @item.url)
    end
  end
end
