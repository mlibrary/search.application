module Search::Models::Record::Catalog
end

require "search/models/record/catalog/bib"
require "search/models/record/catalog/holdings"

module Search::Models::Record::Catalog
  def self.for(id)
    # get data from the api with the client
    data = Search::Clients::CatalogAPI.new.get_record(id)
    # data = JSON.parse(File.read(File.join(S.project_root, "spec", "fixtures", "record", "catalog", "land_birds.json")))
    OpenStruct.new(
      bib: Bib.new(data),
      holdings: Holdings.new(data)
    )
  end
end
