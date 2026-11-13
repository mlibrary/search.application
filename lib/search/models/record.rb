module Search::Models::Record
  class Base
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

    attr_reader :position, :originating_uri
    def initialize(data, position: nil, originating_uri: nil)
      @data = data
      @position = position
      @originating_uri = originating_uri
    end

    def bib
      "#{self.class}::Bib".constantize.new(@data)
    end

    def holdings
      holdings_class_name = "#{self.class}::Holdings"
      if Object.const_defined?(holdings_class_name)
        holdings_class_name.constantize.new(@data)
      end
    end

    def citation
      Search::Models::Record::Citation.new(@data)
    end

    def datastore
      self.class.datastore
    end
  end
end

require "search/models/record/metadata"
require "search/models/record/citation"
Search::Datastores.main.each do |datastore|
  require "search/models/record/#{datastore}"
end
