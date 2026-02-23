class Search::Presenters::Page
  class Record < DatastoreStatic
    CURRENT_PAGE = "Record"
    EXTRA_ICONS = [
      "add", "delete", "mail", "chat", "format_quote", "draft", "link",
      "collections_bookmark", "devices", "keyboard_arrow_right",
      "location_on", "check_circle", "warning", "error", "list",
      "arrow_back_ios", "arrow_forward_ios"
    ]
    attr_reader :record
    def self.for(slug:, uri:, patron:, record_id:)
      datastore = Search::Datastores.find(slug)
      record = Search::Presenters::Record.for_datastore(datastore: slug, id: record_id)
      new(datastore: datastore, uri: uri, patron: patron, record: record)
    end

    def initialize(datastore:, uri:, patron:, record:)
      @description = description
      @slug = datastore.slug
      @datastore = datastore # datastore object
      @patron = patron
      @uri = uri
      @record = record
    end

    def styles
      super.push("datastores/record/styles.css")
    end

    def scripts
      super.push("datastores/record/scripts.js")
    end

    def breadcrumbs
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: @uri)
    end

    def meta_tags
      record.meta_tags
    end

    def ris_action_url
      "#{@uri}/ris"
    end

    private

    def title_parts
      [record.title.first.text, CURRENT_PAGE, @datastore.title]
    end

    def extra_icons
      record.icons + EXTRA_ICONS
    end
  end
end
