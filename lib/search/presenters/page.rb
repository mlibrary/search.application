class Search::Presenters::Page
  attr_reader :slug, :description
  def initialize(slug:, datastore:, uri:, patron:, title: nil, description: nil)
    @title = title
    @description = description
    @slug = slug
    @datastore = datastore # symbol. Should it be? Maybe not.
    @uri = uri
    @patron = patron
  end

  def title
    title_parts.push("Library Search").join(" - ")
  end

  def current_datastore
    @datastore
  end

  def icons
    Search::Presenters::Icons.new(extra_icons)
  end

  def styles
    ["styles.css", "pages/styles.css"]
  end

  def scripts
    ["scripts.js", "partials/scripts.js"]
  end

  def search_options
    Search::Presenters::SearchOptions.new(datastore_slug: current_datastore.to_s, uri: @uri)
  end

  def affiliations
    Search::Presenters::Affiliations.new(current_affiliation: @patron.affiliation)
  end

  def meta_tags
  end

  def flint_message
  end

  def breadcrumbs
  end

  private

  def title_parts
    [@title]
  end

  def extra_icons
    []
  end
end

class Search::Presenters::Page
  class StaticPage < self
    STATIC_PAGES = YAML.load_file(File.join(S.config_path, "static_pages.yaml"))
    ERROR_PAGES = YAML.load_file(File.join(S.config_path, "error_pages.yaml"))

    def self.slugs
      STATIC_PAGES.pluck("slug")
    end

    def self.for(slug:, uri:, patron:)
      page = (STATIC_PAGES + ERROR_PAGES).find { |x| x["slug"] == slug }
      new(slug: page["slug"], title: page["slug"], description: page["description"], datastore: :everything, uri: uri, patron: patron)
    end
  end

  class DatastoreStaticPage < self
    def self.for(slug:, uri:, patron:)
      datastore = Search::Datastores.find(slug)
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def initialize(datastore:, uri:, patron:)
      @description = description
      @slug = datastore.slug
      @datastore = datastore # datastore object
      @uri = uri
      @patron = patron
    end

    def styles
      ["styles.css", "datastores/styles.css"]
    end

    def current_datastore
      @datastore.slug
    end

    def flint_message
      @datastore.flint_message(campus: @patron.campus, page_param: params["page"])
    end

    def page_title
    end

    private

    def title_parts
      [@datastore.title]
    end

    def params
      Addressable::URI.parse(@uri).query_values || {}
    end
  end

  class List < DatastoreStaticPage
    CURRENT_PAGE = "My Temporary List"
    EXTRA_ICONS = ["mail", "chat", "format_quote", "draft", "add", "delete"]
    def self.for(uri:, patron:)
      datastore = Search::Datastores.find("everything")
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def styles
      super.push("datastores/list/styles.css")
    end

    def scripts
      super.push("datastores/list/scripts.js")
    end

    def breadcrumbs
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: @uri)
    end

    def ris_action_url
      "#{@uri}/ris"
    end

    private

    def extra_icons
      EXTRA_ICONS
    end
  end

  class DatastoreRecordPage < DatastoreStaticPage
    CURRENT_PAGE = "Record"
    EXTRA_ICONS = [
      "add", "delete", "mail", "chat", "format_quote", "draft", "link",
      "collections_bookmark", "devices", "keyboard_arrow_right",
      "location_on", "check_circle", "warning", "error", "list",
      "arrow_back_ios", "arrow_forward_ios"
    ]
    attr_reader :record
    def self.for(slug:, uri:, patron:, record_id:)
      datastore = Search::Datastores.find(slug)
      record = Search::Presenters::Record.for_datastore(datastore: slug, id: record_id)
      new(datastore: datastore, uri: uri, patron: patron, record: record)
    end

    def initialize(datastore:, uri:, patron:, record:)
      @description = description
      @slug = datastore.slug
      @datastore = datastore # datastore object
      @patron = patron
      @uri = uri
      @record = record
    end

    def styles
      super.push("datastores/record/styles.css")
    end

    def scripts
      super.push("datastores/record/scripts.js")
    end

    def breadcrumbs
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: @uri)
    end

    def meta_tags
      record.meta_tags
    end

    def ris_action_url
      "#{@uri}/ris"
    end

    private

    def title_parts
      [record.title.first.text, CURRENT_PAGE, @datastore.title]
    end

    def extra_icons
      record.icons + EXTRA_ICONS
    end
  end

  class DatastoreResultsPage < DatastoreStaticPage
    EXTRA_ICONS =
      ["add", "delete", "mail", "close", "chat", "format_quote", "draft",
        "link", "collections_bookmark", "devices", "keyboard_arrow_right",
        "location_on", "check_circle", "warning", "error", "list",
        "arrow_back_ios", "arrow_forward_ios"]

    def self.for(slug:, uri:, patron:)
      datastore = Search::Datastores.find(slug)
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def styles
      super.push("datastores/results/styles.css")
    end

    def page_title
      @datastore.title
    end

    def scripts
      super.push("datastores/results/scripts.js")
    end

    def ris_action_url
    end

    def filters
      all_filters.map do |group|
        first = group.first
        OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
      end
    end

    def active_filters
      all_filters.flatten.select { |x| x.active? }
    end

    def boolean_filters
      [
        OpenStruct.new(uid: "search_only", label: "View HathiTrust search-only materials", checked?: false)
      ]
    end

    def clear_filters_url
      @uri.to_s
    end

    private

    def title_parts
      [@datastore.title]
    end

    def extra_icons
      EXTRA_ICONS
    end

    # For stubbing out results
    def all_filters
      [
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
            uri: @uri, uid: filter[:uid], value: option[:value], count: option[:count]
          )
        end
      end
    end
  end
end
