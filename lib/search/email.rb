class Search::Email
  include Sidekiq::Job
  include Sinatra::Templates
  include Search::ViewHelpers

  def template_cache
    @template_cache ||= Sinatra::TemplateCache.new
  end

  def text
    raise NotImplementedError
  end

  def template
    raise NotImplementedError
  end

  def perform
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
      m.subject "it's an email"
      m.text_part do |t|
        t.body = text
      end
      m.html_part do |h|
        h.content_type "text/html; charset=UTF-8"
        h.body = html
      end
    end

    mail.deliver!
  end

  class Whatever < self
    def text
      "heya"
    end

    def initialize
      @something = "Blah"
    end

    def template
      :email_test
    end

    def html_layout
      :email_layout
    end

    def text_layout
      :email_layout
    end
  end

  class Catalog < self
    def self.for(id)
      record = Search::Models::Record::Catalog.for(id)
      new(record)
    end

    def perform(to, id)
      new(id).send(to)
    end

    def initialize(id)
      @record = Search::Presenters::Record.for_datastore(datastore: "catalog", id: id, size: "brief")
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
end
