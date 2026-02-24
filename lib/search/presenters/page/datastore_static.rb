class Search::Presenters::Page
  class DatastoreStatic < self
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
end
