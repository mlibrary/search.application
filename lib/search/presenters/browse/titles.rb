module Search::Presenters
  class Browse
    class Title
      attr_reader :title

      def initialize(title:, slug:)
        @title = title
        @slug = slug
      end

      def url
        Addressable::URI.new(
          path: "/#{@slug}",
          query_values: {
            "browse_starts_with" => @title,
            "sort" => "title_asc"
          }
        ).to_s
      end
    end

    class Titles
      BROWSE_STARTS_WITH = ('a'..'z').to_a + ["0-9", "Other"]

      include Enumerable

      def initialize(datastore:)
        @titles = BROWSE_STARTS_WITH.map { |title| Title.new(title: title, slug: datastore) }
      end

      def all
        @titles
      end

      def each(&block)
        all.each do |title|
          block.call(title)
        end
      end
    end
  end
end
