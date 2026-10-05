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

  def url
    @data["url"]
  end

  def holdings
  end

  def citation
    Search::Models::Record::Catalog::Citation.new(@data)
  end
end
