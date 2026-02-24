class Search::Presenters::Page
  class List < DatastoreStatic
    CURRENT_PAGE = "My Temporary List"
    EXTRA_ICONS = ["mail", "chat", "format_quote", "draft", "add", "delete"]
    def self.for(uri:, patron:)
      datastore = Search::Datastores.find("everything")
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def styles
      super.push("datastores/list/styles.css")
    end

    def scripts
      super.push("datastores/list/scripts.js")
    end

    def breadcrumbs
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: @uri)
    end

    def ris_action_url
      "#{@uri}/ris"
    end

    private

    def extra_icons
      EXTRA_ICONS
    end
  end
end
