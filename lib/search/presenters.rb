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

  def self.static_pages
    [
      {
        description: "Experience the University of Michigan Library Search, a discovery interface offering seamless access to physical and electronic resources. Since 2018, it provides a unified user experience with comprehensive search capabilities across Catalogs, Articles, Databases, Online Journals, and Guides & More.",
        slug: "about-library-search",
        title: "About Library Search"
      },
      {
        description: "Committed to inclusivity, University of Michigan Library strives to make Library Search accessible and user-friendly for everyone, adhering to WCAG 2.1 AA standards to ensure optimal usability.",
        slug: "accessibility",
        title: "Accessibility"
      }
    ]
  end

  # is this for langing pages?
  def self.for_datastore(slug:, uri:, patron: nil)
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h

    OpenStruct.new(
      title: title([datastore.title]),
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new,
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      page_title: datastore.title
    )
  end

  def self.for_datastore_record(slug:, uri:, patron:, record_id:)
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h
    record = Record.for_datastore(datastore: slug, id: record_id)
    current_page = "Record"

    OpenStruct.new(
      title: title([record.title.first.text, current_page, datastore.title]),
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new(record.icons + ["add", "delete", "mail", "chat", "format_quote", "draft", "link", "collections_bookmark", "devices", "keyboard_arrow_right", "location_on", "check_circle", "warning", "error", "list", "arrow_back_ios", "arrow_forward_ios"]),
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css", "datastores/record/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js", "datastores/record/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      breadcrumbs: Breadcrumbs.new(current_page: current_page, uri: uri),
      record: record,
      meta_tags: record.meta_tags,
      ris_action_url: "#{uri}/ris"
    )
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
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h
    current_page = "My Temporary List"

    OpenStruct.new(
      title: title([datastore.title]),
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new(["mail", "chat", "format_quote", "draft", "add", "delete"]),
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css", "datastores/list/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js", "datastores/list/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      breadcrumbs: Breadcrumbs.new(current_page: current_page, uri: uri),
      page_title: current_page
    )
  end

  def self.for_static_page(slug:, uri:, patron:)
    page = static_pages.find { |x| x[:slug] == slug }
    Presenter.new(title: page[:title], description: page[:description], slug: page[:slug], datastore: :everything, uri: uri, patron: patron)
  end

  def self.for_404_page(uri:, patron:)
    OpenStruct.new(
      title: title(["404", "Page not found"]),
      description: "Page not found (404) at University of Michigan Library. Return to the homepage, search by title/keyword, browse all Databases or Online Journals, or ask a librarian for assistance in locating resources.",
      icons: Icons.new,
      styles: ["styles.css", "pages/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: "everything", uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation)
    )
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
