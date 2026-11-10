module Search
  class Datastore
    def initialize(datastore)
      @datastore = datastore
    end

    ["slug", "title", "description"].each do |method|
      define_method(method) do
        fetch_string(method)
      end
    end

    def search_options
      @datastore["search_options"]
    end

    def flint_message(campus:, page_param:)
      fetch_string("flint_message") if campus == "flint" && (page_param.to_i <= 1)
    end

    def aria_current_attribute(presenter_slug)
      (slug == presenter_slug) ? "page" : "false"
    end

    private

    def fetch_string(key)
      @datastore[key].tr("\n", " ").strip
    end
  end

  module Datastores
    DATASTORES = Search::YamlErb.load_file(File.join(S.config_path, "datastores.yaml.erb")).map do |data|
      Datastore.new(data)
    end

    class << self
      include Enumerable

      def all
        DATASTORES
      end

      def each(&block)
        all.each do |datastore|
          block.call(datastore)
        end
      end

      def find(slug)
        all.find { |x| x.slug == slug }
      end

      def default
        find("everything")
      end
    end
  end
end
