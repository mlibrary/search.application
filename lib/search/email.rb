class Search::Email
  include Sidekiq::Job

  def body
    raise NotImplementedError
  end

  def perform
    puts "hey there"
  end

  def send(to:)
    mail = Mail.new do
      from to
      to to
      subject "it's an email"
    end
    mail.body = body
    mail.deliver!
  end

  class Catalog < self
    def self.for(id)
      record = Search::Models::Record::Catalog.for(id)
      new(record)
    end

    def initialize(record)
      @record = record
    end

    def body
      "It's the body of an email"
    end
  end
end
