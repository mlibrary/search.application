module Search
  module Presenters
    class Breadcrumbs
      def self.for(current_page:, uri:)
        new(current_page: current_page, uri: uri) if current_page.present? && uri.present?
      end

      def initialize(current_page:, uri:)
        @uri = uri
        @current_page = current_page
        @breadcrumbs = breadcrumbs
      end

      def has_breadcrumbs?
        @breadcrumbs.any?
      end

      def current_page
        @current_page
      end

      include Enumerable

      def each(&block)
        @breadcrumbs.each(&block)
      end

      private

      def query_string
        @uri.query ? "?#{@uri.query}" : ""
      end

      def subdirectories
        # Split the uri path and remove empty strings
        @uri.path.split('/').reject { |subdirectory| subdirectory.empty? }
      end

      def breadcrumb_title(breadcrumb)
        breadcrumb.split('-').map(&:capitalize).join(' ')
      end

      def breadcrumbs
        crumbs = []
        latest_index = 0
        path = ""
        subdirectories.each do |subdirectory|
          # Add each subdirectory to the path
          path += "/#{subdirectory}"
          url = path + query_string
          if subdirectory.match(/^\d+$/) && latest_index > 0
            crumbs[latest_index - 1].url = url
          else
            # Check if subdirectory is a datastore
            datastore = Search::Datastores.find(subdirectory)
            crumb = OpenStruct.new(
              body: datastore ? datastore.title : breadcrumb_title(subdirectory),
              url: url
            )
            crumbs << crumb
            # Update latest index
            latest_index += 1
          end
        end
        # Remove the last crumb to make room for @current_page
        crumbs.pop
        crumbs
      end
    end
  end
end
