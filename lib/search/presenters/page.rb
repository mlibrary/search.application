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

  def filter_params
    result = Addressable::URI.new
    result.query_values = @uri&.query_values(Array)&.select do |kv|
      kv[0] == "library" || kv[0].start_with?("filter")
    end
    result.query
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

  def meta_tags
  end

  def flint_message
  end

  def breadcrumbs
  end

  def actions
    ACTIONS
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
require_relative "page/advanced"
require_relative "page/list"
require_relative "page/record"
require_relative "page/results"
require_relative "page/browse"
