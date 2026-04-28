require "search/presenters/record/catalog/email_holdings"

class Search::Presenters::Record::Onlinejournals::EmailHoldings < Search::Presenters::Record::Catalog::EmailHoldings
  #
  # <Description>
  #
  # @param [Search::Models::Record::Catalog] data is the catalog record model
  #
  def initialize(data)
    @data = data
    @holdings = Search::Presenters::Record::Onlinejournals::Holdings.new(@data)
  end

  private

  def hathi_trust_list
    if non_ht_search_only_item_count == 0
      @holdings.hathi_trust
    else
      Search::Presenters::Record::Onlinejournals::Holdings::HathiTrustFullText.new(@data.holdings.hathi_trust)
    end
  end
end
