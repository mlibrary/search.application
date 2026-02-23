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
require "search/presenters/presenter"

module Search::Presenters
  def self.title(titles = [])
    @titles = titles
    @titles.push("Library Search")
    @titles.join(" - ")
  end

  def self.static_page_slugs
    Presenter::StaticPage.slugs
  end

  def self.for_datastore(slug:, uri:, patron: nil)
    Presenter::DatastoreStaticPage.for(slug: slug, uri: uri, patron: patron)
  end

  def self.for_datastore_record(slug:, uri:, patron:, record_id:)
    Presenter::DatastoreRecordPage.for(slug: slug, uri: uri, patron: patron, record_id: record_id)
  end

  def self.for_datastore_results(slug:, uri:, patron: nil)
    Presenter::DatastoreResultsPage.for(slug: slug, uri: uri, patron: patron)
  end

  def self.for_datastore_list(slug:, uri:, patron: nil)
    Presenter::List.for(uri: uri, patron: patron)
  end

  def self.for_static_page(slug:, uri:, patron:)
    Presenter::StaticPage.for(slug: slug, uri: uri, patron: patron)
  end

  def self.for_404_page(uri:, patron:)
    Presenter::StaticPage.for(slug: "404", uri: uri, patron: patron)
  end
end
