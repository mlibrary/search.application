class Search::Models::Record::Catalog
end

require "search/models/record/catalog/bib"
require "search/models/record/catalog/holdings"

class Search::Models::Record::Catalog
  def self.for(id)
    # get data from the api with the client
    data = Search::Clients::CatalogAPI.new.get_record(id)
    new(data)
  end

  def initialize(data)
    @data = data
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

  def marc
    @data["marc"]
  end
end
