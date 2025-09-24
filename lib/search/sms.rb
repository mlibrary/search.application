class Search::SMS
  def message
    raise NotImplementedError
  end

  def send(phone:, client: S.twilio_client)
    client.messages.create(
      to: phone,
      body: message,
      messaging_service_sid: S.twilio_messaging_service_sid
    )
  end

  class Catalog < self
    def self.for(id)
      record = Search::Models::Record::Catalog.for(id)
      new(record)
    end

    def initialize(record)
      @record = record
    end

    def message
      case @record.holdings.physical.list.count
      when 0
        <<~TXT.strip
          Title: #{title}
          Link: #{url} 
        TXT
      when 1
        <<~TXT.strip
          Title: #{title}
          Location: #{location}
          Call Number: #{call_number}
          Catalog Record: #{url} 
        TXT
      else
        <<~TXT.strip
          Title: #{title}
          There are multiple items available; see the catalog record for a list: #{url} 
        TXT
      end
    end

    private

    def title
      @record.bib.title.original.text
    end

    def location
      @record.holdings.physical.list.first.physical_location.text
    end

    def call_number
      @record.holdings.physical.list.first.call_number
    end

    def url
      "#{S.base_url}/catalog/record/#{@record.bib.id}"
    end
  end
end
