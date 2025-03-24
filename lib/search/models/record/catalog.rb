module Search::Models::Record::Catalog
end

require "search/models/record/catalog/bib"

module Search::Models::Record::Catalog
  def self.for(id)
    # get data from the api with the client
    # data = catalog_api_client.get(id)
    data = JSON.parse(File.read(File.join(S.project_root, "spec", "fixtures", "record", "catalog", "land_birds.json")))
    OpenStruct.new(
      bib: Bib.new(data)
    )
  end
end
