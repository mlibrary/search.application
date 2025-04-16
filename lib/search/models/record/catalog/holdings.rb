class Search::Models::Record::Catalog::Holdings
end

require_relative "holdings/electronic"
require_relative "holdings/hathi_trust"
require_relative "holdings/alma_digital"

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

  def alma_digital
    AlmaDigital.new(@data)
  end
end
