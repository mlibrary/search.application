require "faker"
module Factories
end
require_relative "factories/catalog_api_record"
module Factories
  def create(factory)
    case factory
    when :catalog_api_record
      CatalogAPIRecord.new.to_h
    end
  end
end
