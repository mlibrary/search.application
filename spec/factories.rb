require "faker"
require "rspec/mocks"
module Factories
end
require_relative "factories/catalog_api_record"
require_relative "factories/catalog_record"
module Factories
  def create(factory)
    case factory
    when :catalog_api_record
      CatalogAPIRecord.new.to_h
    when :catalog_record
      CatalogRecord.record
    when :catalog_holdings
      CatalogRecord.holdings
    when :hathi_trust_holdings
      CatalogRecord.hathi_trust_holdings
    when :physical_item
      CatalogRecord.physical_item
    end
  end
end
