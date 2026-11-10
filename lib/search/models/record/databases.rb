class Search::Models::Record::Databases
end
require "search/models/record/databases/bib"
class Search::Models::Record::Databases
  def self.for(id, uri = nil)
    data = nil
    Yabeda.search_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::SearchAPI.new.get_databases_record(id)
    end
    new(data, originating_uri: uri)
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

  def recommended?
    !!@data["recommended_resource"]
  end

  def url
    @data["permalink"]
  end

  def holdings
  end

  def citation
    Search::Models::Record::Catalog::Citation.new(@data)
  end
end
