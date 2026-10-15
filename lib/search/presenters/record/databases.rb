module Search::Presenters::Record::Databases
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :description,
      :type,
      :access_type,
      :new,
      :permalink,
      :coverage,
      :alt_title,
      :more_information,
      :academic_discipline
    ]
    def self.datastore
      "databases"
    end

    def title
      [OpenStruct.new(text: @record.bib.title.text, css_class: "title-primary")]
    end
    # Plain content, multiple_field_display
    [
      {uid: :description, field: "Description"},
      {uid: :type, field: "Database type"},
      {uid: :access_type, field: "Access type"},
      {uid: :permalink, field: "Permalink"},
      {uid: :coverage, field: "Coverage"},
      {uid: :alt_title, field: "Alternative Title(s)"},
      {uid: :platform, field: "Interface Platform"},
      {uid: :new, field: "New"},
      {uid: :trial, field: "Trial"}
    ].each do |f|
      define_method(f[:uid]) do
        if @record.bib.public_send(f[:uid]).present?
          field_for(
            uid: f[:uid],
            field: f[:field],
            partial: "plain_text",
            values: @record.bib.public_send(f[:uid])
          )
        end
      end
    end
    def academic_discipline
      field_for(
        uid: "academic_discipline",
        field: "Academic Discipline",
        partial: "academic_discipline",
        values: @record.bib.academic_discipline
      )
    end

    def more_information
      field_for(
        uid: "more_information",
        field: "More Information",
        partial: "link_to",
        values: @record.bib.more_information
      )
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
