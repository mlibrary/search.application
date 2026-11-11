class Search::Models::Record::Articles < Search::Models::Record::Base
  def self.for(id, uri = nil)
    data = nil
    Yabeda.search_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::SearchAPI.new.get_record(datastore: "articles", id: id)
    end
    new(data, originating_uri: uri)
  end

  def initialize(data, position: nil, originating_uri: nil)
    @data = data
    @position = position
    @originating_uri = originating_uri
  end

  def bib
    Bib.new(@data)
  end

  def retracted?
    !!bib.retraction_notice_url
  end

  def holdings
    Holdings.new(@data)
  end

  def citation
    Search::Models::Record::Catalog::Citation.new(@data)
  end
end
require "search/models/record/articles/bib"
require "search/models/record/articles/holdings"
