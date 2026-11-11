module Search::Models::Record
  class Base
    attr_reader :position, :originating_uri
    def self.datastore
      name.split("::").last.downcase
    end

    def self.get_params(uri)
      {}
    end

    def self.for(id, uri: nil)
      params = get_params(uri)
      data = nil
      Yabeda.search_api_full_record_duration.measure do
        # get data from the api with the client
        data = Search::Clients::SearchAPI.new.get_record(datastore: datastore, id: id, params: params)
      end
      new(data, originating_uri: uri)
    end

    def datastore
      self.class.datastore
    end
  end
end

require "search/models/record/metadata"
require "search/models/record/catalog"
require "search/models/record/onlinejournals"
require "search/models/record/articles"
require "search/models/record/databases"
require "search/models/record/guidesandmore"
