module Search
  module Presenters
    class Title
      def initialize(titles = [])
        @titles = titles || []
        @titles.push("Library Search")
      end

      def to_s
        @titles.join(" - ")
      end
    end
  end
end
