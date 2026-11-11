class Search::Models::Record::Onlinejournals < Search::Models::Record::Catalog
  def self.for(id, uri = nil)
    # TBChanged
    data = nil
    Yabeda.search_api_full_record_duration.measure do
      data = Search::Clients::SearchAPI.new.get_record(datastore: "onlinejournals", id: id)
    end
    new(data, originating_uri: uri)
  end

  def recommended?
    !!@data["recommended_resource"]
  end
end
