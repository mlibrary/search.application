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

  def physical
    Physical.new(@data)
  end

  # TODO: Need to move this out!
  module HasDescription
    def has_description?
      items.any? { |item| item.description }
    end
  end
end

require_relative "holdings/electronic"
require_relative "holdings/hathi_trust"
require_relative "holdings/alma_digital"
require_relative "holdings/physical"
