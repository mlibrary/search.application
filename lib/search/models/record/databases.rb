class Search::Models::Record::Databases < Search::Models::Record::Base
  def recommended?
    !!@data["recommended_resource"]
  end

  def url
    @data["permalink"]
  end

  def holdings
  end
end

require "search/models/record/databases/bib"
