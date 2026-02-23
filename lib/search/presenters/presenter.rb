class Search::Presenters::Presenter
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
    Search::Presenters::Icons.new
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
end

class Search::Presenters::Presenter
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

  class DatastoreRecordPage < DatastoreStaticPage
    CURRENT_PAGE = "Record"
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

    def icons
      Search::Presenters::Icons.new(record.icons + [
        "add", "delete", "mail", "chat", "format_quote", "draft", "link",
        "collections_bookmark", "devices", "keyboard_arrow_right",
        "location_on", "check_circle", "warning", "error", "list",
        "arrow_back_ios", "arrow_forward_ios"
      ])
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
  end
end
