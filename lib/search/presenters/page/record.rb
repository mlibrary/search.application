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

    extend Forwardable

    def_delegators :@pagination, :next_url, :previous_url, :position

    def self.for(slug:, uri:, patron:, record_id:)
      datastore = Search::Datastores.find(slug)
      future = Concurrent::Promises.future { Pagination.for(datastore: slug, uri: uri) }
      record = Search::Presenters::Record.for_datastore(datastore: slug, id: record_id)
      new(datastore: datastore, uri: uri, patron: patron, record: record, pagination: future.value)
    end

    def initialize(datastore:, uri:, patron:, record:, pagination:)
      @description = description
      @slug = datastore.slug
      @datastore = datastore # datastore object
      @patron = patron
      @pagination = pagination
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
      Search::Presenters::Breadcrumbs.new(current_page: CURRENT_PAGE, uri: breadcrumb_uri)
    end

    def citation
      Search::Presenters::Actions::Action::Citation.new([@record])
    end

    def ris_action_url
      "#{@uri}/ris"
    end

    def meta_tags
      record.meta_tags
    end

    private

    def title_parts
      [record.title.first.text, CURRENT_PAGE, @datastore.title]
    end

    def extra_icons
      record.icons + EXTRA_ICONS
    end

    def breadcrumb_uri
      result = @uri.dup
      qv = result.query_values(Array) || []
      qv.reject! { |x| x[0] == "position" }
      result.query_values = qv
      result
    end

    class Pagination
      def self.for(uri:, datastore: "catalog")
        results_model_klass = "Search::Models::Results::#{datastore.capitalize}".constantize
        query_values = uri.query_values || {} # flatten duplicate values
        position = query_values["position"].to_i

        return Empty.new unless position >= 1

        record_id = uri.path.split("/").last
        records = []

        # index in the list of solr records. It starts at 0.
        index = position - 1
        if index == 0
          records = results_model_klass.for(uri, limit: 2, offset: 0).records
          return Empty.new if records.count == 1 || records[0]&.bib&.id != record_id
          if records.count == 1
            records.append(nil)
          end
          records.prepend(nil)
        else
          records = results_model_klass.for(uri, limit: 3, offset: index - 1).records
          return Empty.new if records[1]&.bib&.id != record_id
        end
        new(records: records, uri: uri)
      end

      attr_reader :position

      def initialize(records:, uri:)
        @records = records
        @uri = uri
        @query_values = uri.query_values
        @position = @query_values["position"].to_i
      end

      def previous_url
        if not_first_record?
          result = @uri.dup
          qv = result.query_values
          qv["position"] = @position - 1
          result.query_values = qv
          path = result.path.split("/")
          path[-1] = @records[0].bib.id
          result.path = path.join("/")
          result.display_uri.to_s
        end
      end

      def next_url
        unless @records[2].nil?
          result = @uri.dup
          qv = result.query_values
          qv["position"] = @position + 1
          result.query_values = qv
          path = result.path.split("/")
          path[-1] = @records.last.bib.id
          result.path = path.join("/")
          result.display_uri.to_s
        end
      end

      private

      def first_record?
        @position == 1
      end

      def not_first_record?
        !first_record?
      end

      class Empty < self
        def initialize
        end

        def previous_url
        end

        def next_url
        end
      end
    end
  end
end
