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

  # is this for langing pages?
  def self.for_datastore(slug:, uri:, patron: nil)
    Presenter::DatastoreStaticPage.for(slug: slug, uri: uri, patron: patron)
  end

  def self.for_datastore_record(slug:, uri:, patron:, record_id:)
    Presenter::DatastoreRecordPage.for(slug: slug, uri: uri, patron: patron, record_id: record_id)
  end

  def self.for_datastore_results(slug:, uri:, patron: nil)
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h
    all_filters = [
      {
        uid: "availability",
        name: "Availability",
        options: [
          {value: "Available Online", count: 15762},
          {value: "Physical", count: 8421},
          {value: "HathiTrust", count: 3245}
        ]
      },
      {
        uid: "format",
        name: "Format",
        options: [
          {value: "Book", count: 11826},
          {value: "Journal", count: 7398},
          {value: "Music", count: 1234},
          {value: "Video", count: 987},
          {value: "Map", count: 456},
          {value: "Manuscript", count: 321},
          {value: "Audio (music)", count: 321}
        ]
      },
      {
        uid: "subject",
        name: "Subject",
        options: [
          {value: "History", count: 6789},
          {value: "Science", count: 5678},
          {value: "Literature", count: 4567},
          {value: "Art", count: 3456},
          {value: "Technology", count: 2345}
        ]
      },
      {
        uid: "date_of_publication",
        name: "Date of Publication",
        options: [
          {value: "2020-2024", count: 3456},
          {value: "2010-2019", count: 5678},
          {value: "2000-2009", count: 4567},
          {value: "1990-1999", count: 2345},
          {value: "1980-1989", count: 1234},
          {value: "1970-1979", count: 1234},
          {value: "1960-1969", count: 1234},
          {value: "Before 1960", count: 6789}
        ]
      },
      {
        uid: "language",
        name: "Language",
        options: [
          {value: "English", count: 14567},
          {value: "Spanish", count: 2345},
          {value: "French", count: 1234},
          {value: "German", count: 987},
          {value: "Chinese", count: 876},
          {value: "Japanese", count: 765},
          {value: "Russian", count: 654}
        ]
      },
      {
        uid: "author",
        name: "Author",
        options: [
          {value: "Smith, John", count: 123},
          {value: "Doe, Jane", count: 98},
          {value: "Brown, Bob", count: 76},
          {value: "Johnson, Alice", count: 54},
          {value: "Davis, Charlie", count: 32}
        ]
      },
      {
        uid: "publisher",
        name: "Publisher",
        options: [
          {value: "Penguin Random House", count: 456},
          {value: "HarperCollins", count: 345},
          {value: "Simon & Schuster", count: 234},
          {value: "Macmillan Publishers", count: 123},
          {value: "Hachette Livre", count: 98}
        ]
      }
    ].map do |filter|
      filter[:options].map do |option|
        Search::Presenters::Results::Filter.for(
          uri: uri, uid: filter[:uid], value: option[:value], count: option[:count]
        )
      end
    end
    active_filters = all_filters.flatten.select { |x| x.active? }

    filters = all_filters.map do |group|
      first = group.first
      OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
    end

    boolean_filters = [
      OpenStruct.new(uid: "search_only", label: "View HathiTrust search-only materials", checked?: false)
    ]

    OpenStruct.new(
      title: title([datastore.title]),
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new(["add", "delete", "mail", "close", "chat", "format_quote", "draft", "link", "collections_bookmark", "devices", "keyboard_arrow_right", "location_on", "check_circle", "warning", "error", "list", "arrow_back_ios", "arrow_forward_ios"]),
      slug: datastore.slug,
      styles: ["styles.css", "datastores/results/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js", "datastores/results/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      page_title: datastore.title,
      active_filters: active_filters,
      boolean_filters: boolean_filters,
      filters: filters,
      clear_filters_url: uri # this is wrong
    )
  end

  def self.for_datastore_list(slug:, uri:, patron: nil)
    Presenter::List.get(uri: uri, patron: patron)
  end

  def self.for_static_page(slug:, uri:, patron:)
    Presenter::StaticPage.for(slug: slug, uri: uri, patron: patron)
  end

  def self.for_404_page(uri:, patron:)
    Presenter::StaticPage.for(slug: "404", uri: uri, patron: patron)
  end

  def self.add_param(uri:, uid:, value:, prefix: nil)
    result = Addressable::URI.parse(uri)
    query_values = result.query_values(Array) || []
    query_values.push([make_key(prefix, uid), value])
    result.query_values = query_values
    result.display_uri.to_s
  end

  def self.remove_param(uri:, uid:, value:, prefix: nil)
    result = Addressable::URI.parse(uri)
    query_values = result.query_values(Array) || []
    to_be_removed = [make_key(prefix, uid), value]
    query_values.reject! { |x| x == to_be_removed }
    result.query_values = query_values
    result.display_uri.to_s
  end

  def self.make_key(prefix, uid)
    if prefix
      "#{prefix}.#{uid}"
    else
      uid
    end
  end
end
