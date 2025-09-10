module Search
  module Patron
    def self.for(uniqname:, session_affiliation:)
      alma_response = AlmaRestClient.client.get("users/#{uniqname}")
      if alma_response.status == 200
        Alma.new(alma_response.body, session_affiliation)
      else
        S.logger.error(alma_response.body)
        not_logged_in
      end
    rescue Faraday::Error => e
      S.logger.error(e.detailed_message)
      not_logged_in
    end

    def self.from_session(session)
      FromSession.new(session)
    end

    def self.not_logged_in
      NotLoggedIn.new
    end
  end
end

module Search
  module Patron
    module SessionHelper
      def to_h
        {
          email: email,
          campus: campus,
          affiliation: affiliation,
          logged_in: logged_in?
        }
      end
    end
  end
end

module Search
  module Patron
    class Base
      def email
        raise NotImplementedError
      end

      def campus
        raise NotImplementedError
      end

      def logged_in?
        raise NotImplementedError
      end

      def affiliation
        raise NotImplementedError
      end
    end
  end
end

module Search
  module Patron
    class Alma < Base
      include SessionHelper

      def initialize(data, session_affiliation = nil)
        @data = data
        @session_affiliation = session_affiliation
      end

      def email
        @data.dig("contact_info", "email")&.find do |email_entry|
          email_entry["preferred"]
        end&.dig("email_address")
      end

      def campus
        campus_code = @data.dig("campus_code", "value")
        "flint" if campus_code == "UMFL"
      end

      def affiliation
        @session_affiliation || campus
      end

      def logged_in?
        true
      end
    end
  end
end

module Search
  module Patron
    class NotLoggedIn < Base
      include SessionHelper

      def email
        ""
      end

      def campus
        ""
      end

      # Ultimately needs to return based on IP address if in Flint Range
      def affiliation
        nil
      end

      def logged_in?
        false
      end
    end
  end
end

module Search
  module Patron
    class FromSession < Base
      def initialize(session_data)
        @session = session_data
      end

      def email
        @session[:email]
      end

      def campus
        @session[:campus]
      end

      def logged_in?
        @session[:logged_in]
      end

      #
      # What the current status of the user's affiliation is.  flint means the
      # affiliation had been set in the ui or the user logged in, had not set a
      # session in the ui and their campus is flint
      #
      # @return [String || Nil] could be "flint" or Nil
      #
      def affiliation
        @session[:affiliation]
      end
    end
  end
end
