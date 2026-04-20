module Search::Presenters
  class Browse
    def self.for(datastore:, uri:)
      "Search::Presenters::Browse::#{datastore.capitalize}".constantize.for(uri)
    end
  end
end
