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

  def finding_aids
    FindingAids.new(@data)
  end

  def physical
    Physical.new(@data)
  end
end

require_relative "holdings/electronic"
require_relative "holdings/hathi_trust"
require_relative "holdings/alma_digital"
require_relative "holdings/physical"
require_relative "holdings/finding_aids"
