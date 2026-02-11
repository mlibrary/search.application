module Search
  module Actions
    class Email
      include Sinatra::Templates
      include Search::ViewHelpers

      def self.worker_klass(data)
        records_data = Search::Actions::RecordsData.new(data)
        if records_data.single?
          Record::Worker
        else
          List::Worker
        end
      end

      def template_cache
        @template_cache ||= Sinatra::TemplateCache.new
      end

      def template
        raise NotImplementedError
      end

      def html
        # ERB.new(File.read(File.join(S.project_root, "views", template))).result(binding)
        erb(template, layout: html_layout)
      end

      def text
        erb(template, layout: text_layout)
      end

      def settings
        @settings ||= OpenStruct.new(views: File.join(S.project_root, "views"), templates: {})
      end

      def send(to:)
        mail = Mail.new do |m|
          m.from to
          m.to to
          m.subject subject
          m.text_part do |t|
            t.charset = "UTF-8"
            t.body text
          end
          m.html_part do |h|
            h.content_type "text/html; charset=UTF-8"
            h.body html
          end
        end

        mail.deliver!
      end

      class Worker
        include Sidekiq::Job

        def perform
          raise NotImplementedError
        end
      end

      class Catalog < self
        def self.for(id)
          record = Search::Models::Record::Catalog.for(id)
          new(record)
        end

        def initialize(id)
          @record = Search::Presenters::Record.for_datastore(datastore: "catalog", id: id, size: "email")
        end

        def subject
          "Library Search: #{@record.title.first.text}"
        end

        def template
          :"email/record"
        end

        def html_layout
          :"email/layout"
        end

        def text_layout
          :"email/record/txt"
        end

        class Worker < Search::Actions::Email::Worker
          def perform(to, id)
            Search::Actions::Email::Catalog.new(id).send(to: to)
          end
        end
      end

      class Record < self
        def initialize(data)
          datum = Search::Actions::RecordsData.new(data).first
          @record = Search::Presenters::Record.for_datastore(datastore: datum.datastore, id: datum.id, size: "email")
        end

        def subject
          "Library Search: #{@record.title.first.text}"
        end

        def template
          :"email/record"
        end

        def html_layout
          :"email/layout"
        end

        def text_layout
          :"email/record/txt"
        end

        class Worker < Search::Actions::Email::Worker
          def perform(to, data)
            Search::Actions::Email::Record.new(data).send(to: to)
          end
        end
      end

      class List < self
        def initialize(data)
          @records = data.keys.map do |datastore|
            [
              datastore,
              data[datastore].map do |id|
                Search::Presenters::Record.for_datastore(datastore: datastore, id: id, size: "email")
              end
            ]
          end.to_h
        end

        def subject
          "Library Search Records"
        end

        def template
          :"email/list"
        end

        def html_layout
          :"email/layout"
        end

        def text_layout
          :"email/list/txt"
        end

        class Worker < Search::Actions::Email::Worker
          def perform(to, data)
            Search::Actions::Email::List.new(data).send(to: to)
          end
        end
      end
    end
  end
end
