module Search
  module Actions
    class SMS
      def initialize(index:, total:, url:)
        @index = index
        @total = total
        @url = url
      end

      def message
        <<~TXT.strip
          #{@index}/#{@total}
          #{@url}
        TXT
      end

      def self.send_message(phone:, message:, client: S.twilio_client)
        client.messages.create(
          to: phone,
          body: message,
          messaging_service_sid: S.twilio_messaging_service_sid
        )
      end

      def send(phone:, client: S.twilio_client)
        response = client.messages.create(
          to: phone,
          body: message,
          messaging_service_sid: S.twilio_messaging_service_sid
        )
        if response.status == "accepted"
          S.logger.info("sms_accepted", sid: response.sid)
        else
          S.logger.warn("sms_not_accepted", sid: response.sid, status: response.status)
        end
        response
      rescue Twilio::REST::RestError => e
        S.logger.error("twilio_error", e.response.body)
      end

      class Worker
        include Sidekiq::Job

        def perform(phone, urls)
          total = urls.count
          urls.map.with_index do |url, index|
            Search::SMS.new(index: index + 1, total: total, url: url).send(phone: phone)
          end
        end
      end
    end
  end
end
