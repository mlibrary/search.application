require "search/presenters/record/catalog/physical_holdings"

class Search::Presenters::Record::Onlinejournals::Holdings::PhysicalBase < Search::Presenters::Record::Catalog::Holdings::PhysicalBase
  TableHeading = Search::Presenters::Record::Onlinejournals::Holdings::TableHeading
end

class Search::Presenters::Record::Onlinejournals::Holdings::ItemBase < Search::Presenters::Record::Catalog::Holdings::ItemBase
  ItemCell = Search::Presenters::Record::Onlinejournals::Holdings::ItemCell
end

class Search::Presenters::Record::Onlinejournals::Holdings::Physical <
  Search::Presenters::Record::Catalog::Holdings::Physical

  class Item < Search::Presenters::Record::Catalog::Holdings::Physical::Item
  end
end
