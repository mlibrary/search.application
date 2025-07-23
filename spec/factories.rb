require "faker"
require "rspec/mocks"
module Factories
end
require_relative "factories/catalog_api_record"
require_relative "factories/catalog_record"
require_relative "factories/shelf_browse"
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
    when :shelf_browse_item
      ShelfBrowse.item
    when :finding_aid_holding
      CatalogRecord.finding_aid_holding
    end
  end
end
