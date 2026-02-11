module Search
  module Actions
    class Email
      include Sinatra::Templates
      include Search::ViewHelpers

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

        resp = mail.deliver!
        if S.app_env == "production"
          if resp.success?
            S.logger.info "email_accepted", resp.as_json
          else
            S.logger.error "email_not_accepted", resp.as_json
          end
        end
      end

      module Worker
        def self.submit(email:, data:)
          records_data = Search::Actions::RecordsData.new(data)
          klass = if records_data.single?
            Record
          else
            List
          end
          klass.perform_async(email, data)
        end

        class BaseWorker
          include Sidekiq::Job

          def perform(to, data)
            klass = "Search::Actions::Email::#{self.class.name.demodulize}".constantize
            klass.new(data).send(to: to)
          end
        end

        class List < BaseWorker
        end

        class Record < BaseWorker
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
      end
    end
  end
end
