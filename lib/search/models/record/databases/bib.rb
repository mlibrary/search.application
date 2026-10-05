class Search::Models::Record::Databases::Bib
  # map_*_field methods come from this
  include Search::Models::Record::Metadata

  def initialize(data)
    @data = data
    @datastore = "databases"
  end

  def id
    @data["id"]
  end

  def title
    map_text_field("title").first
  end
end
