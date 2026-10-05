module Search::Presenters::Record::Databases
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :descriptions
    ]
    def self.datastore
      "databases"
    end

    def title
      [OpenStruct.new(text: @record.bib.title.text, css_class: "title-primary")]
    end

    def holdings
      OpenStruct.new(list: [Holding.new(@record.url)])
    end
  end

  class Holding
    include Search::Presenters::Record::Holdings

    def initialize(url)
      @url = url
    end

    def kind
      "database"
    end

    def heading
      "Availability"
    end

    def icon
      "devices"
    end

    def empty?
      count == 0
    end

    def count
      1
    end

    def table_headings
      [table_heading_for("Action")]
    end

    def rows
      [[link_to_cell_for(text: "Go to database", url: @url)]]
    end
  end
end
