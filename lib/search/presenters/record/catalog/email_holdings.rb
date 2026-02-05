class Search::Presenters::Record::Catalog::EmailHoldings
  #
  # <Description>
  #
  # @param [Search::Models::Record::Catalog] data is the catalog record model
  #
  def initialize(data)
    @data = data
    @holdings = Search::Presenters::Record::Catalog::Holdings.new(@data)
  end

  def too_many?
    non_ht_search_only_item_count > 3 || (non_ht_search_only_item_count == 0 && @holdings.hathi_trust.search_only_count > 3)
  end

  def any?
    list.any?
  end

  def list
    @list ||= [
      hathi_trust_list,
      @holdings.online,
      @holdings.finding_aids,
      * @holdings.physical
    ].reject { |x| x.empty? }
  end

  private

  def hathi_trust_list
    if non_ht_search_only_item_count == 0
      @holdings.hathi_trust
    else
      Search::Presenters::Record::Catalog::Holdings::HathiTrustFullText.new(@data.holdings.hathi_trust)
    end
  end

  def non_ht_search_only_item_count
    @non_ht_search_only_item_count ||=
      physical_item_count +
      @holdings.online.count +
      @holdings.finding_aids.count +
      @holdings.hathi_trust.full_text_count
  end

  def physical_item_count
    @holdings.physical.map { |x| x.count }.sum
  end
end
