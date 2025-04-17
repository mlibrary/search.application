module Factories
  class CatalogAPIRecord
    def to_h
      ([
        ["id", "99#{Faker::Number.number(digits: 12)}6381"],
        ["format", ["Book"]],
        ["academic_discipline", [{
          "list" => [
            "Science",
            "Biology",
            "Zoology"
          ]
        },
          {
            "list" => [
              "Science",
              "Biology",
              "Ecology and Evolutionary Biology"
            ]
          }]]
      ] + paired_text_fields + link_fields + text_fields + author_browse_fields).to_h
    end

    def paired_text_fields
      ["title", "published", "manufactured", "edition", "series",
        "series_statement", "distributed"].map do |f|
        [f, paired_text_field]
      end
    end

    def link_fields
      ["other_titles"].map do |f|
        [f, link_field]
      end
    end

    def text_fields
      ["language", "note", "physical_description", "isbn", "call_number",
        "oclc", "lcsh_subjects", "created", "biography_history", "summary",
        "in_collection", "access", "terms_of_use", "date_place_of_event",
        "references", "copyright_status_information", "copyright", "playing_time",
        "audience", "production_credits", "bibliography", "gov_doc_no",
        "publisher_number", "report_number", "chronology", "place", "printer",
        "association", "language_note", "performers", "preferred_citation",
        "location_of_originals", "funding_information", "source_of_acquisition",
        "related_items", "numbering_notes", "source_of_description_note",
        "copy_specific_note", "arrangement", "reproduction_note",
        "original_version_note", "content_advice", "awards", "bookplate",
        "numbering", "current_publication_frequency",
        "former_publication_frequency", "map_scale", "extended_summary",
        "issn"].map do |f|
        [f, text_field]
      end
    end

    def author_browse_fields
      ["main_author", "contributors"].map do |f|
        [f, author_browse_field]
      end
    end

    def text_field
      [{"text" => Faker::Lorem.sentence}]
    end

    def paired_text_field
      [
        {
          text: Faker::Lorem.sentence,
          script: "default"
        },
        {
          text: Faker::Lorem.sentence,
          script: "vernacular"
        }
      ]
    end

    def author_browse_field
      [
        {
          text: "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
          script: "default",
          search: "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
          browse: "#{Faker::Name.last_name}, #{Faker::Name.first_name}"
        },
        {
          text: "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
          script: "vernacular",
          search: "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
          browse: "#{Faker::Name.last_name}, #{Faker::Name.first_name}"
        }
      ]
    end

    def link_field
      [{
        text: Faker::Lorem.sentence,
        search: Faker::Lorem.sentence
      }]
    end
  end
end
