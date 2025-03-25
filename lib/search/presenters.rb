module Search
  module Presenters
  end
end
require "search/presenters/affiliations"
require "search/presenters/icons"
require "search/presenters/search_options"
require "search/presenters/record"

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
      title: datastore.title,
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new,
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"])
    )
  end

  def self.for_datastore_record(slug:, uri:, patron:, record_id:)
    datastore = Search::Datastores.find(slug)
    params = URI.decode_www_form(uri.query.to_s)&.to_h
    record = Record.for_datastore(datastore: slug, id: record_id)

    record_example = OpenStruct.new(
      title: [
        OpenStruct.new(text: "", css_class: "title"),
        OpenStruct.new(text: "", css_class: "vernacular")
      ],
      record_info: [
        OpenStruct.new(
          field: "Formats",
          data: [
            OpenStruct.new(
              icon: "collections_bookmark",
              text: "Journal"
            ),
            OpenStruct.new(
              icon: "devices",
              text: "Available Online"
            )
          ]
        ),
        OpenStruct.new(
          field: "Main Author",
          data: [
            OpenStruct.new(
              partial: "browse",
              locals: OpenStruct.new(
                text: "This is an author",
                url: 'http://search.lib.umich.edu/catalog/author:("This is a contributor")',
                browse_url: "http://search.lib.umich.edu/catalog/browse/author/This+is+a+contributor",
                kind: "author"
              )
            ),
            OpenStruct.new(
              partial: "browse",
              locals: OpenStruct.new(
                text: "This is a vernacular author",
                url: 'http://search.lib.umich.edu/catalog/author:("This is a contributor")',
                browse_url: "http://search.lib.umich.edu/catalog/browse/author/This+is+a+contributor",
                kind: "author"
              )
            )
          ]
        ),
        OpenStruct.new(
          field: "Other Titles",
          data: [
            OpenStruct.new(
              partial: "href",
              locals: OpenStruct.new(
                text: "This is a vernacular author",
                url: 'http://search.lib.umich.edu/catalog/title:("This is a contributor")'
              )
            )
          ]
        ),
        OpenStruct.new(
          field: "Contributors",
          data: [
            OpenStruct.new(
              partial: "browse",
              locals: OpenStruct.new(
                text: "This is a contributor",
                url: 'http://search.lib.umich.edu/catalog/author:("This is a contributor")',
                browse_url: "http://search.lib.umich.edu/catalog/browse/author/This+is+a+contributor",
                kind: "author"
              )
            )
          ]
        ),
        OpenStruct.new(
          field: "Published",
          data: [
            OpenStruct.new(
              partial: "plain_text",
              locals: OpenStruct.new(text: "")
            )
          ]
        ),
        OpenStruct.new(
          field: "Series",
          data: [
            OpenStruct.new(
              partial: "plain_text",
              locals: OpenStruct.new(text: "")
            )
          ]
        ),
        OpenStruct.new(
          field: "LCSH Subjects",
          data: [
            OpenStruct.new(
              partial: "browse",
              locals: OpenStruct.new(
                text: "This is a subject",
                url: 'http://search.lib.umich.edu/catalog/subject:("This is a contributor")',
                browse_url: "http://search.lib.umich.edu/catalog/browse/subject?query=This+is+a+subject",
                kind: "subject"
              )
            )
          ]
        ),
        OpenStruct.new(
          field: "Academic Discipline",
          data: [
            OpenStruct.new(
              partial: academic_discipline,
              locals: OpenStruct.new(
                disciplines: [OpenStruct(text: "Science", url:),
                  OpenStruct(text: "Engineering", url: "")]
              )
            ),
            OpenStruct.new(
              partial: academic_discipline,
              locals: OpenStruct.new(
                disciplines: [OpenStruct(text: "Science", url:),
                  OpenStruct(text: "Engineering", url: "")]
              )
            )

          ]
        )

      ],
      indexing_date: "20250217"
    )

    OpenStruct.new(
      title: datastore.title,
      current_datastore: slug,
      description: datastore.description,
      icons: Icons.new(record.icons),
      slug: datastore.slug,
      styles: ["styles.css", "datastores/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: slug, uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation),
      flint_message: datastore.flint_message(campus: patron.campus, page_param: params["page"]),
      record: record
    )
  end

  def self.for_static_page(slug:, uri:, patron:)
    page = static_pages.find { |x| x[:slug] == slug }

    OpenStruct.new(
      title: page[:title],
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
      title: "404 - Page not found",
      description: "Page not found (404) at University of Michigan Library. Return to the homepage, search by title/keyword, browse all Databases or Online Journals, or ask a librarian for assistance in locating resources.",
      icons: Icons.new,
      styles: ["styles.css", "pages/styles.css"],
      scripts: ["scripts.js", "partials/scripts.js"],
      search_options: SearchOptions.new(datastore_slug: "everything", uri: uri),
      affiliations: Affiliations.new(current_affiliation: patron.affiliation)
    )
  end
end
