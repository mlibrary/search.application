require "yaml"
module Search
  module ViewHelpers
    def link_to(body:, url:, classes: [], open_in_new: false, utm_source: "library-search", rest: nil)
      uri = URI.parse(url)

      if ["http", "https"].include?(uri.scheme) && !uri.host.nil? && uri.host != URI.parse(S.base_url).host
        params = URI.decode_www_form(uri.query || "") + {utm_source: utm_source}.to_a
        uri.query = URI.encode_www_form(params)
      end

      attributes = [
        "href=\"#{uri}\"",
        rest
      ].compact

      if open_in_new
        attributes << "target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"#{body} - opens in new window\""
        classes << "open-in-new"
      end
      if !classes.empty?
        attributes << "class=\"#{classes.compact.join(" ")}\""
      end

      "<a #{attributes.join(" ")}>#{body}</a>"
    end

    def h1(body:, classes: [], rest: nil)
      attributes = [
        "id=\"maincontent\"",
        "tabindex=\"-1\"",
        rest
      ].compact

      if !classes.empty?
        attributes << "class=\"#{classes.compact.join(" ")}\""
      end

      "<h1 #{attributes.join(" ")}>#{body}</h1>"
    end

    def search_styled_flash(key = :flash)
      return "" if flash(key).empty?

      flash(key).collect do |kind, message|
        "<h2>#{kind}: #{message}</h2>"
        # erb :"components/message", locals: {message: message, kind: kind}
      end.join
    end
  end

  class YamlErb
    include Search::ViewHelpers

    def self.load_file(file_path)
      new(file_path).to_yaml
    end

    def initialize(file_path)
      @raw = File.read(file_path)
    end

    def text
      ERB.new(@raw).result(binding)
    end

    def to_s
      text
    end

    def to_yaml
      YAML.load(text)
    end
  end
end
