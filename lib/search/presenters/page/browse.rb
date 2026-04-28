class Search::Presenters::Page
  class Browse < DatastoreStatic
    CURRENT_PAGE = "Browse"
    def self.for(slug:, uri:, patron:)
      datastore = Search::Datastores.find(slug)
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def styles
      super.push("datastores/browse/styles.css")
    end

    def page_title
      CURRENT_PAGE + " all " + @datastore.title
    end

    def breadcrumbs
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: @uri)
    end

    def browse
      Search::Presenters::Browse.new(datastore: @slug)
    end

    private

    def title_parts
      [CURRENT_PAGE, @datastore.title]
    end
  end
end
