module Search::Presenters
  class Browse
    class Title
      attr_reader :title, :slug

      def initialize(title:, slug:)
        @title = title
        @slug = slug
      end

      def url
        "/##{@slug}?query=browse_starts_with%3A#{@title}&sort=title_asc"
      end
    end

    class Titles
      BROWSE_STARTS_WITH = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "0-9", "Other"
      ]
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
