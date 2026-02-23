class Search::Presenters::Presenter
  attr_reader :slug, :description
  def initialize(slug:, datastore:, uri:, patron:, title: nil, description: nil)
    @title = title
    @description = description
    @slug = slug
    @datastore = datastore
    @uri = uri
    @patron = patron
  end

  def title
    [@title, "Library Search"].join(" - ")
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
    Search::Presenters::SearchOptions.new(datastore_slug: @datastore.to_s, uri: @uri)
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

  class StaticPage < self
    STATIC_PAGES = YAML.load_file(File.join(S.config_path, "static_pages.yaml"))
    def self.slugs
      STATIC_PAGES.pluck(:slug)
    end

    def self.for(slug:, uri:, patron:)
      STATIC_PAGES.find { |x| x[:slug] == slug }
      new(**page, datastore: :everything, uri: uri, patron: patron)
    end
  end

  class DatastoreStaticPage < self
    def initialize(slug:, datastore:, uri:, patron:, title: nil, description: nil)
      super
      @title = self.datastore.title
      @description = self.datastore.description
    end

    def styles
      ["styles.css", "datastores/styles.css"]
    end

    def datastore
      Search::Datastores.find(@datastore)
    end

    def flint_message
      datastore.flint_message(campus: @patron.campus, page_param: params["page"])
    end

    def page_title
    end

    private

    def params
      Addressable::URI.parse(@uri).query_values || {}
    end
  end
end
