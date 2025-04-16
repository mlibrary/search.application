class Search::Models::Record::Catalog::Holdings
end

require_relative "holdings/electronic"
require_relative "holdings/hathi_trust"

class Search::Models::Record::Catalog::Holdings
  def initialize(data)
    @data = data
  end

  def electronic
    Electronic.new(@data)
  end

  def hathi_trust
    HathiTrust.new(@data)
  end
end
