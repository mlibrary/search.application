class Search::Presenters::Page
  class Results < DatastoreStatic
    EXTRA_ICONS =
      ["add", "delete", "mail", "close", "chat", "format_quote", "draft",
        "link", "collections_bookmark", "devices", "keyboard_arrow_right",
        "location_on", "check_circle", "warning", "error", "list",
        "arrow_back_ios", "arrow_forward_ios"]

    def self.for(slug:, uri:, patron:)
      datastore = Search::Datastores.find(slug)
      new(datastore: datastore, uri: uri, patron: patron)
    end

    def styles
      super.push("datastores/results/styles.css")
    end

    def page_title
      @datastore.title
    end

    def scripts
      super.push("datastores/results/scripts.js")
    end

    def ris_action_url
    end

    def filters
      all_filters.map do |group|
        first = group.first
        OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
      end
    end

    def active_filters
      all_filters.flatten.select { |x| x.active? }
    end

    def boolean_filters
      [
        OpenStruct.new(uid: "search_only", label: "View HathiTrust search-only materials", checked?: false)
      ]
    end

    def clear_filters_url
      @uri.to_s
    end

    private

    def title_parts
      [@datastore.title]
    end

    def extra_icons
      EXTRA_ICONS
    end

    # For stubbing out results
    def all_filters
      [
        {
          uid: "availability",
          name: "Availability",
          options: [
            {value: "Available Online", count: 15762},
            {value: "Physical", count: 8421},
            {value: "HathiTrust", count: 3245}
          ]
        },
        {
          uid: "format",
          name: "Format",
          options: [
            {value: "Book", count: 11826},
            {value: "Journal", count: 7398},
            {value: "Music", count: 1234},
            {value: "Video", count: 987},
            {value: "Map", count: 456},
            {value: "Manuscript", count: 321},
            {value: "Audio (music)", count: 321}
          ]
        },
        {
          uid: "subject",
          name: "Subject",
          options: [
            {value: "History", count: 6789},
            {value: "Science", count: 5678},
            {value: "Literature", count: 4567},
            {value: "Art", count: 3456},
            {value: "Technology", count: 2345}
          ]
        },
        {
          uid: "date_of_publication",
          name: "Date of Publication",
          options: [
            {value: "2020-2024", count: 3456},
            {value: "2010-2019", count: 5678},
            {value: "2000-2009", count: 4567},
            {value: "1990-1999", count: 2345},
            {value: "1980-1989", count: 1234},
            {value: "1970-1979", count: 1234},
            {value: "1960-1969", count: 1234},
            {value: "Before 1960", count: 6789}
          ]
        },
        {
          uid: "language",
          name: "Language",
          options: [
            {value: "English", count: 14567},
            {value: "Spanish", count: 2345},
            {value: "French", count: 1234},
            {value: "German", count: 987},
            {value: "Chinese", count: 876},
            {value: "Japanese", count: 765},
            {value: "Russian", count: 654}
          ]
        },
        {
          uid: "author",
          name: "Author",
          options: [
            {value: "Smith, John", count: 123},
            {value: "Doe, Jane", count: 98},
            {value: "Brown, Bob", count: 76},
            {value: "Johnson, Alice", count: 54},
            {value: "Davis, Charlie", count: 32}
          ]
        },
        {
          uid: "publisher",
          name: "Publisher",
          options: [
            {value: "Penguin Random House", count: 456},
            {value: "HarperCollins", count: 345},
            {value: "Simon & Schuster", count: 234},
            {value: "Macmillan Publishers", count: 123},
            {value: "Hachette Livre", count: 98}
          ]
        }
      ].map do |filter|
        filter[:options].map do |option|
          Search::Presenters::Results::Filter.for(
            uri: @uri, uid: filter[:uid], value: option[:value], count: option[:count]
          )
        end
      end
    end
  end
end
