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
      ["access", "arrangement", "association", "audience", "awards",
        "bibliography", "biography_history", "bookplate", "call_number",
        "chronology", "content_advice", "copy_specific_note", "copyright",
        "copyright_status_information", "created",
        "current_publication_frequency", "date_place_of_event",
        "extended_summary", "former_publication_frequency", "funding_information",
        "gov_doc_no", "in_collection", "isbn", "issn", "language",
        "language_note", "lcsh_subjects", "location_of_originals", "map_scale", "new_title_issn",
        "note", "numbering", "numbering_notes", "oclc", "other_subjects",
        "original_version_note", "performers", "physical_description", "place",
        "playing_time", "preferred_citation", "previous_title_issn", "printer", "production_credits",
        "publisher_number", "references", "related_items",
        "remediated_lcsh_subjects", "report_number", "reproduction_note",
        "source_of_acquisition", "source_of_description_note", "summary",
        "terms_of_use"].map do |f|
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
