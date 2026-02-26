module Search
  module Presenters
  end
end
require "search/presenters/affiliations"
require "search/presenters/breadcrumbs"
require "search/presenters/icons"
require "search/presenters/record"
require "search/presenters/results"
require "search/presenters/search_options"
require "search/presenters/page"

module Search::Presenters
  class << self
    def static_page_slugs
      Page::Static.slugs
    end

    def for_static_page(slug:, uri:, patron:)
      Page::Static.for(slug: slug, uri: uri, patron: patron)
    end

    def for_404_page(uri:, patron:)
      Page::Static.for(slug: "404", uri: uri, patron: patron)
    end

    def for_datastore(slug:, uri:, patron: nil)
      Page::DatastoreStatic.for(slug: slug, uri: uri, patron: patron)
    end

    def for_list(slug:, uri:, patron: nil)
      Page::List.for(uri: uri, patron: patron)
    end

    def for_datastore_record(slug:, uri:, patron:, record_id:)
      Page::Record.for(slug: slug, uri: uri, patron: patron, record_id: record_id)
    end

    def for_datastore_results(slug:, uri:, patron: nil, page: 0)
      Page::Results.for(slug: slug, uri: uri, patron: patron, page: page)
    end
  end
end
