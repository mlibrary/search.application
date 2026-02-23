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
end
