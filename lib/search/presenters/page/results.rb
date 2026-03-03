class Search::Presenters::Page
  class Results < DatastoreStatic
    EXTRA_ICONS =
      ["add", "delete", "mail", "close", "chat", "format_quote", "draft",
        "link", "collections_bookmark", "devices", "keyboard_arrow_right",
        "location_on", "check_circle", "warning", "error", "list",
        "arrow_back_ios", "arrow_forward_ios"]

    def self.for(slug:, uri:, patron:)
      datastore = Search::Datastores.find(slug)
      results = Search::Presenters::Results.for(datastore: slug, uri: uri)
      new(datastore: datastore, uri: uri, patron: patron, results: results)
    end

    def initialize(datastore:, uri:, patron:, results:)
      @description = datastore.description
      @slug = datastore.slug
      @datastore = datastore # datastore object
      @uri = uri
      @patron = patron
      @results = results
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
      @results.filters
    end

    def active_filters
      @results.active_filters
    end

    def boolean_filters
      @results.boolean_filters
    end

    def clear_filters_url
      @uri.to_s
    end

    def pagination
      @results.pagination
    end

    def entries
      @results.records
    end

    private

    def title_parts
      [@datastore.title]
    end

    def extra_icons
      EXTRA_ICONS
    end
  end
end
