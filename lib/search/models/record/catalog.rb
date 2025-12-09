class Search::Models::Record::Catalog
end

require "search/models/record/catalog/bib"
require "search/models/record/catalog/holdings"
require "search/models/record/catalog/citation"

class Search::Models::Record::Catalog
  def self.for(id)
    data = nil
    Yabeda.catalog_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::CatalogAPI.new.get_record(id)
    end
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

  def citation
    Citation.new(@data)
  end

  def marc
    @data["marc"]
  end
end
