module Search
  module Presenters
  end
end
require "search/presenters/affiliations"
require "search/presenters/breadcrumbs"
require "search/presenters/icons"
require "search/presenters/record"
require "search/presenters/search_options"
require "search/presenters/title"

module Search::Presenters
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

  def self.for_datastore(slug:, uri:, patron: nil)
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h

    OpenStruct.new(
      title: Title.new([datastore.title]),
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
      title: Title.new([record.title.first.text, current_page, datastore.title]),
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new(record.icons + ["mail", "chat", "format_quote", "draft", "link", "collections_bookmark", "devices", "keyboard_arrow_right", "location_on", "check_circle", "warning", "error", "list", "arrow_back_ios", "arrow_forward_ios"]),
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css", "datastores/record/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js", "datastores/record/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      breadcrumbs: Breadcrumbs.new(current_page: current_page, uri: uri),
      record: record
    )
  end

  def self.for_static_page(slug:, uri:, patron:)
    page = static_pages.find { |x| x[:slug] == slug }

    OpenStruct.new(
      title: Title.new([page[:title]]),
      current_datastore: "everything",
      description: page[:description],
      icons: Icons.new,
      slug: page[:slug],
      styles: ["styles.css", "pages/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: "everything", uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation)
    )
  end

  def self.for_404_page(uri:, patron:)
    OpenStruct.new(
      title: Title.new(["404", "Page not found"]),
      description: "Page not found (404) at University of Michigan Library. Return to the homepage, search by title/keyword, browse all Databases or Online Journals, or ask a librarian for assistance in locating resources.",
      icons: Icons.new,
      styles: ["styles.css", "pages/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: "everything", uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation)
    )
  end
end
