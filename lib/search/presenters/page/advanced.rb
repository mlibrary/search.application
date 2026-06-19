class Search::Presenters::Page
  class AdvancedSearch < DatastoreStatic
    CURRENT_PAGE = "Advanced Search"
    EXTRA_ICONS = ["close"]
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
      super.push("advanced/styles.css")
    end

    def scripts
      super.push("advanced/scripts.js")
    end

    def page_title
      CURRENT_PAGE
    end

    def form_title
      @datastore.title + " Search"
    end

    def search_options
      super.tap do |options|
        options.define_singleton_method(:no_optgroups?) { true }
      end
    end

    def advanced_search
      Search::Presenters::Advanced.for(datastore: @datastore.slug, uri: @uri)
    end

    private

    def title_parts
      [CURRENT_PAGE, @datastore.title]
    end

    def extra_icons
      EXTRA_ICONS
    end
  end
end
