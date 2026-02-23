class Search::Presenters::Presenter
  attr_reader :slug, :description
  def initialize(title:, description:, slug:, datastore:, uri:, patron:)
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
end
