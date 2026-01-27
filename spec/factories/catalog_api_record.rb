module Factories
  class CatalogAPIRecord
    def initialize(fields: [])
      @fields = fields
    end

    def to_h
      @fields.map do |f|
        [f.to_s, send(f)]
      end.to_h
    end

    def old_to_h
      ([
        ["id", "99#{Faker::Number.number(digits: 12)}6381"],
        ["format", ["Book"]],
        ["indexing_date", Faker::Date.between(from: "2020-01-01", to: "2025-12-31").strftime("%Y-%m-%d")],
        ["marc", {leader: "          22        4500", fields: []}],
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
          }]],
        ["holdings", {
          hathi_trust_items: [],
          alma_digital_items: [],
          electronic_items: [],
          finding_aids: {},
          physical: []
        }],
        ["citation", {tagged: [], citeproc: {}}]
      ] + paired_text_fields + title_link_fields + text_fields + author_browse_fields).to_h
    end

    def id
      "99#{Faker::Number.number(digits: 12)}6381"
    end

    def format
      [Faker::Lorem.word]
    end

    def indexing_date
      Faker::Date.between(from: "2020-01-01", to: "2025-12-31").strftime("%Y-%m-%d")
    end

    def marc
      {leader: "          22        4500", fields: []}
    end

    def academic_discipline
      [
        {"list" => ["Science", "Biology", "Zoology"]},
        {"list" => ["Science", "Biology", "Ecology and Evolutionary Biology"]}
      ]
    end

    def holdings
      {
        hathi_trust_items: [],
        alma_digital_items: [],
        electronic_items: [],
        finding_aids: {},
        physical: []
      }
    end

    def citation
      {tagged: [], citeproc: {}}
    end

    ["access", "arrangement", "association", "audience", "awards",
      "bibliography", "biography_history", "chronology", "contents",
      "content_advice", "copy_specific_note", "copyright",
      "copyright_status_information", "created",
      "current_publication_frequency", "date_place_of_event",
      "extended_summary", "finding_aids", "former_publication_frequency",
      "funding_information", "in_collection", "language_note",
      "location_of_originals", "map_scale", "media_format", "note",
      "numbering", "numbering_notes", "original_version_note", "performers",
      "physical_description", "place", "playing_time", "preferred_citation",
      "printer", "production_credits", "title", "published",
      "publisher_number", "manufactured", "edition", "series", "references",
      "related_items", "reproduction_note", "source_of_acquisition",
      "source_of_description_note", "summary", "terms_of_use",
      "series_statement", "distributed"].each do |method|
        define_method(method) { paired_text_field }
      end

    def paired_text_fields
      ["access", "arrangement", "association", "audience", "awards",
        "bibliography", "biography_history", "chronology", "contents",
        "content_advice", "copy_specific_note", "copyright",
        "copyright_status_information", "created",
        "current_publication_frequency", "date_place_of_event",
        "extended_summary", "finding_aids", "former_publication_frequency",
        "funding_information", "in_collection", "language_note",
        "location_of_originals", "map_scale", "media_format", "note",
        "numbering", "numbering_notes", "original_version_note", "performers",
        "physical_description", "place", "playing_time", "preferred_citation",
        "printer", "production_credits", "title", "published",
        "publisher_number", "manufactured", "edition", "series", "references",
        "related_items", "reproduction_note", "source_of_acquisition",
        "source_of_description_note", "summary", "terms_of_use",
        "series_statement", "distributed"].map do |f|
        [f, paired_text_field]
      end
    end

    ["new_title", "other_titles", "preferred_title", "previous_title", "related_title"].each do |method|
      define_method(method) do
        link_field("title")
      end
    end
    def title_link_fields
      ["new_title", "other_titles", "preferred_title", "previous_title", "related_title"].map do |f|
        [f, link_field("title")]
      end
    end

    ["bookplate", "call_number", "gov_doc_number", "isbn", "issn", "language",
      "lc_subjects", "oclc", "other_subjects", "new_title_issn",
      "previous_title_issn", "remediated_lc_subjects", "report_number"].each do |method|
      define_method(method) { text_field }
    end

    def text_fields
      ["bookplate", "call_number", "gov_doc_number", "isbn", "issn", "language",
        "lc_subjects", "oclc", "other_subjects", "new_title_issn",
        "previous_title_issn", "remediated_lc_subjects",
        "report_number"]
        .map do |f|
          [f, text_field]
      end
    end

    ["main_author", "contributors"].each do |method|
      define_method(method) { author_browse_field }
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
