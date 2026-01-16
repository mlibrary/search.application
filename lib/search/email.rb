class Search::Email
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
      @record = Search::Presenters::Record.for_datastore(datastore: "catalog", id: id, size: "brief")
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

    class Worker < Search::Email::Worker
      def perform(to, id)
        Search::Email::Catalog.new(id).send(to: to)
      end
    end
  end
end
