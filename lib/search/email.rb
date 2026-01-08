class Search::Email
  include Sidekiq::Job

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
    ERB.new(File.read(File.join(S.project_root, "views", template))).result(binding)
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
      "email_test.erb"
    end
  end

  class Catalog < self
    def self.for(id)
      record = Search::Models::Record::Catalog.for(id)
      new(record)
    end

    def perform(to, id)
      record = Search::Models::Record::Catalog.for(id)
      new(record).send(to)
    end

    def initialize(record)
      @record = record
    end

    def template
      "email_test.erb"
    end

    def text
      "It's the body of an email"
    end
  end
end
