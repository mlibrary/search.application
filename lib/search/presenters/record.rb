module Search
  module Presenters
    module Record
      def self.for_datastore(datastore:, id:, size: "full")
        "Search::Presenters::Record::#{datastore.capitalize}::#{size.capitalize}".constantize.for(id)
      end

      class Base
        METADATA_METHODS = []
        def self.datastore
          raise NotImplementedError
        end

        def self.for(id)
          record = "Search::Models::Record::#{datastore.capitalize}".constantize.for(id)
          new(record)
        end

        def initialize(record)
          @record = record
        end

        [:title, :metadata].each do |m|
          define_method m do
            raise NotImplementedError
          end
        end

        def respond_to_missing?(method, *args, **kwargs, &block)
          self.class::METADATA_METHODS.any?(method)
        end

        def method_missing(method, *args, **kwargs, &block)
          super unless respond_to_missing?(method)
          S.logger.debug("#{method} not defined in Presenters::Record::#{datastore.capitalize}::Full")
          nil
        end

        def metadata
          self.class::METADATA_METHODS.map { |field| public_send(field) }.compact
        end

        def id
          @record.bib.id
        end

        def position
          @record.position
        end

        def url
          "#{S.base_url}/#{datastore}/record/#{id}"
        end

        def datastore
          self.class.datastore
        end

        def ris
          @record.citation.ris
        end

        def csl
          @record.citation.csl
        end

        def meta_tags
          @record.citation.meta_tags
        end

        def shelf_browse
        end

        def indexing_date
        end

        def marc_record
        end

        def icons
          []
        end

        private

        def field_for(field:, partial:, values:, uid: nil)
          Field.new(uid: uid, field: field, partial: partial, values: values) if values.present?
        end
      end

      class Field
        attr_reader :uid, :field, :partial, :values
        def initialize(field:, partial:, values:, uid: nil)
          @field = field
          @partial = partial
          @values = values
          @uid = uid
        end

        include Enumerable

        def each(&block)
          @values.each(&block)
        end
      end
    end
  end
end

require "search/presenters/record/holdings"
require "search/presenters/record/catalog"
require "search/presenters/record/onlinejournals"
require "search/presenters/record/articles"
