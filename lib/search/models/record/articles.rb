class Search::Models::Record::Articles
end

require "search/models/record/articles/bib"

class Search::Models::Record::Articles
  def self.for(id)
    data = nil
    Yabeda.catalog_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::CatalogAPI.new.get_articles_record(id)
    end
    new(data)
  end

  attr_reader :position

  def initialize(data, position: nil)
    @data = data
    @position = position
  end

  def bib
    Bib.new(@data)
  end

  def holdings
    Holdings.new(@data)
  end

  def citation
    Search::Models::Record::Catalog::Citation.new(@data)
  end
end
