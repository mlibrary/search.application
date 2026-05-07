class Search::Presenters::Page
  class AdvancedSearch < self
    CURRENT_PAGE = "Advanced Search"
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

    def page_title
      CURRENT_PAGE
    end

    def scripts
      super.push("advanced/scripts.js")
    end

    def current_datastore
      @datastore.slug
    end

    private

    def title_parts
      [CURRENT_PAGE, @datastore.title]
    end

    def params
      Addressable::URI.parse(@uri).query_values || {}
    end
  end
end
