class Search::Models::Record::Databases < Search::Models::Record::Base
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

require "search/models/record/databases/bib"
