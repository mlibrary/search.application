class Search::Models::Results::Catalog
  def initialize(data)
    @data = data
  end

  def records
    @data["records"].map { |x| Search::Models::Record::Catalog.new(x) }
  end
end
