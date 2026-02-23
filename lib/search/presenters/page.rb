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
require_relative "page/static"
require_relative "page/datastore_static"
require_relative "page/list"
require_relative "page/record"
require_relative "page/results"
