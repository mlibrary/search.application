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
      ] + paired_text_fields + title_link_fields + text_fields + author_browse_fields).to_h
    end

    def paired_text_fields
      ["access", "arrangement", "association", "audience", "awards",
        "bibliography",
        "biography_history",
        "chronology", "content_advice", "copy_specific_note", "copyright",
        "copyright_status_information", "created",
        "current_publication_frequency", "date_place_of_event",
        "extended_summary", "former_publication_frequency", "funding_information",
        "in_collection", "language_note", "location_of_originals", "map_scale",
        "note", "numbering", "numbering_notes", "original_version_note",
        "performers", "physical_description", "place", "playing_time", "preferred_citation", "printer", "production_credits",
        "title", "published", "manufactured", "edition", "series", "references", "related_items", "reproduction_note",
        "source_of_acquisition", "source_of_description_note", "summary", "terms_of_use",
        "series_statement", "distributed"].map do |f|
        [f, paired_text_field]
      end
    end

    def title_link_fields
      ["other_titles", "related_title"].map do |f|
        [f, link_field("title")]
      end
    end

    def text_fields
      ["bookplate", "call_number", "gov_doc_no", "isbn", "issn", "language",
        "lcsh_subjects",
        "oclc",

        "publisher_number",
        "report_number"]
        .map do |f|
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
        {"transliterated" => {
           "text" => Faker::Lorem.sentence
         },
         "original" => {
           "text" => Faker::Lorem.sentence
         }}
      ]
    end

    def author_browse_field
      [
        {
          "transliterated" => {
            "text" => "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
            "search" => search_field,
            "browse" => "#{Faker::Name.last_name}, #{Faker::Name.first_name}"
          },
          "original" => {
            "text" => "#{Faker::Name.last_name}, #{Faker::Name.first_name}",
            "search" => search_field,
            "browse" => "#{Faker::Name.last_name}, #{Faker::Name.first_name}"
          }
        }
      ]
    end

    def search_field(field = "author")
      [
        {"field" => field, "value" => "#{Faker::Name.last_name}, #{Faker::Name.first_name}"}
      ]
    end

    def link_field(field = author)
      [
        {
          "transliterated" => {
            "text" => Faker::Lorem.sentence,
            "search" => search_field(field)
          },
          "original" => {
            "text" => Faker::Lorem.sentence,
            "search" => search_field(field)
          }
        }
      ]
    end
  end
end
