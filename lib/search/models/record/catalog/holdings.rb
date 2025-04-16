class Search::Models::Record::Catalog::Holdings
end

require_relative "holdings/electronic"

class Search::Models::Record::Catalog::Holdings
  def initialize(data)
    @data = data
  end

  def electronic
    Electronic.new(@data)
  end
end
