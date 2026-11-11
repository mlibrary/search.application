class Search::Models::Record::Catalog < Search::Models::Record::Base
  def self.get_params(uri)
    params = {}
    ht_search_only = uri&.query_values&.[]("filter.search_only") == "true"
    params[:ht_search_only] = ht_search_only if ht_search_only
    params
  end

  attr_reader :position, :originating_uri

  def initialize(data, position: nil, originating_uri: nil)
    @data = data
    @position = position
    @originating_uri = originating_uri
  end

  def bib
    Bib.new(@data)
  end

  def holdings
    Holdings.new(@data)
  end

  def indexing_date
    Date.parse(@data["indexing_date"])
  end

  def citation
    Citation.new(@data)
  end

  def marc
    @data["marc"]
  end
end

require "search/models/record/catalog/bib"
require "search/models/record/catalog/holdings"
require "search/models/record/catalog/citation"
