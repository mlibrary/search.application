module Factories::CatalogRecord
  class << self
    include RSpec::Mocks::ExampleMethods

    METADATA_FIELDS = {
      title: "paired_text_item",  # this is the only singular one

      access: "paired_text_items",
      arrangement: "paired_text_items",
      association: "paired_text_items",
      audience: "paired_text_items",
      awards: "paired_text_items",
      bibliography: "paired_text_items",
      biography_history: "paired_text_items",
      chronology: "paired_text_items",
      content_advice: "paired_text_items",
      copy_specific_note: "paired_text_items",
      copyright: "paired_text_items",
      copyright_status_information: "paired_text_items",
      created: "paired_text_items",
      current_publication_frequency: "paired_text_items",
      date_place_of_event: "paired_text_items",
      distributed: "paired_text_items",
      edition: "paired_text_items",
      extended_summary: "paired_text_items",
      finding_aids: "paired_text_items",
      former_publication_frequency: "paired_text_items",
      funding_information: "paired_text_items",
      in_collection: "paired_text_items",
      language_note: "paired_text_items",
      location_of_originals: "paired_text_items",
      manufactured: "paired_text_items",
      map_scale: "paired_text_items",
      media_format: "paired_text_items",
      note: "paired_text_items",
      numbering: "paired_text_items",
      numbering_notes: "paired_text_items",
      original_version_note: "paired_text_items",
      performers: "paired_text_items",
      physical_description: "paired_text_items",
      place: "paired_text_items",
      playing_time: "paired_text_items",
      preferred_citation: "paired_text_items",
      printer: "paired_text_items",
      production_credits: "paired_text_items",
      published: "paired_text_items",
      publisher_number: "paired_text_items",
      references: "paired_text_items",
      related_items: "paired_text_items",
      reproduction_note: "paired_text_items",
      series: "paired_text_items",
      series_statement: "paired_text_items",
      source_of_acquisition: "paired_text_items",
      source_of_description_note: "paired_text_items",
      summary: "paired_text_items",
      terms_of_use: "paired_text_items",

      contents: "plain_text_items",
      gov_doc_number: "plain_text_items",
      report_number: "plain_text_items",
      bookplate: "plain_text_items",
      isbn: "plain_text_items",
      issn: "plain_text_items",
      language: "plain_text_items",
      new_title_issn: "plain_text_items",
      previous_title_issn: "plain_text_items",
      oclc: "plain_text_items",
      other_subjects: "plain_text_items",

      new_title: "paired_linked_items",
      related_title: "paired_linked_items",
      preferred_title: "paired_linked_items",
      previous_title: "paired_linked_items",
      other_titles: "paired_linked_items",

      call_number: "browse_items",
      lc_subjects: "browse_items",
      remediated_lc_subjects: "browse_items",

      main_author: "author_browse_items",
      contributors: "author_browse_items",

      format: "format_items",

      academic_discipline: "academic_discipline_items"

    }

    HOLDINGS = {
      hathi_trust: "hathi_trust_holdings",
      alma_digital: "alma_digital_holdings",
      electronic: "electronic_holdings",
      finding_aids: "finding_aid_holding",
      physical: "physical_holdings"
    }

    def record(bib_fields: [], other_fields: [], holdings: [])
      result = instance_double(Search::Models::Record::Catalog, bib: bib(fields: bib_fields), holdings: holdings(kinds: holdings))
      other_fields.each do |f|
        allow(result).to receive(f).and_return(send(f))
      end
      result
    end

    def bib(fields: [])
      included_fields = fields.map { |f| [f, send(METADATA_FIELDS[f])] }.to_h
      instance_double(Search::Models::Record::Catalog::Bib, id: "99#{Faker::Number.number(digits: 12)}6381", **included_fields)
    end

    def paired_text_items
      [paired_text_item]
    end

    def paired_text_item
      Search::Models::Record::Catalog::Bib::PairedItem.for({
        "transliterated" => url_double,
        "original" => url_double
      })
    end

    def single_script_paired_text_item
      Search::Models::Record::Catalog::Bib::PairedItem.for({
        "original" => text_double
      })
    end

    def paired_linked_items
      [paired_linked_item]
    end

    def paired_linked_item
      Search::Models::Record::Catalog::Bib::PairedItem.for({
        "transliterated" => text_double,
        "original" => text_double
      })
    end

    def browse_items
      [browse_item]
    end

    def browse_item(kind = Faker::Internet.slug)
      browse_double(kind)
    end

    def author_browse_items
      [author_browse_item]
    end

    def author_browse_item
      Search::Models::Record::Catalog::Bib::PairedItem.for({
        "transliterated" => browse_double("author"),
        "original" => browse_double("author")
      })
    end

    # default is two items because that's the more interesting case
    def plain_text_items
      [text_double, text_double]
    end

    def format_items
      [format_item]
    end

    def format_item
      double("text", text: Faker::Lorem.sentence, icon: Faker::Internet.slug)
    end

    def academic_discipline_items
      [academic_discipline_item]
    end

    def academic_discipline_item
      double("academic_discipline", disciplines: [url_double])
    end

    def text_double
      double("text", text: Faker::Lorem.sentence)
    end

    def url_double
      double("url", text: Faker::Lorem.sentence, url: Faker::Internet.url)
    end

    def browse_double(kind)
      double("browse",
        text: Faker::Lorem.sentence,
        url: Faker::Internet.url,
        browse_url: Faker::Internet.url,
        kind: kind || Faker::Internet.slug)
    end

    #
    # other fields
    #
    def indexing_date
      Faker::Date.in_date_period
    end

    def marc
      {}
    end

    def citation
      instance_double(Search::Models::Record::Catalog::Citation)
    end

    def holdings(kinds: nil)
      kinds = [:alma_digital, :hathi_trust, :electronic, :finding_aids, :physical] if kinds.nil? || kinds == :all
      included_holdings = HOLDINGS.map do |h, method|
        holding = if kinds.include?(h)
          send(method)
        else
          empty_holding
        end
        [h, holding]
      end.to_h

      # included_holdings = kinds.map { |h| [h, send(HOLDINGS[h])] }.to_h
      instance_double(Search::Models::Record::Catalog::Holdings, **included_holdings)
    end

    def empty_holding
      instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust,
        items: [], count: 0,
        has_description?: false)
    end

    def hathi_trust_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust,
        items: [hathi_trust_item], count: 1,
        has_description?: true)
    end

    def hathi_trust_item
      instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust::Item,
        url: Faker::Internet.url,
        source: Faker::Educator.university,
        description: Faker::Lorem.sentence,
        status: "Full text")
    end

    def alma_digital_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::AlmaDigital,
        items: [alma_digital_item],
        count: 1, has_description?: true)
    end

    def alma_digital_item
      double("Search::Models::Record::Catalog::Holdings::AlmaDigital item",
        url: Faker::Internet.url,
        label: Faker::Lorem.sentence,
        delivery_description: Faker::Lorem.sentence,
        public_note: Faker::Lorem.sentence)
    end

    def electronic_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::Electronic, items: [electronic_item], count: 1, has_description?: true)
    end

    def electronic_item
      double("Search::Models::Record::Catalog::Holdings::Electronic item",
        url: Faker::Internet.url,
        note: Faker::Lorem.sentence,
        available?: true,
        description: Faker::Lorem.sentence)
    end

    def physical_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::Physical, list: [physical_holding])
    end

    def physical_holding
      instance_double(Search::Models::Record::Catalog::Holdings::Physical::Holding,
        holding_id: "22#{Faker::Number.number(digits: 8)}",
        call_number: Faker::Lorem.sentence,
        public_note: Faker::Lorem.sentence,
        summary: [Faker::Lorem.sentence],
        physical_location: physical_location,
        has_description?: true,
        count: 1,
        items: [physical_item])
    end

    def physical_item
      instance_double(Search::Models::Record::Catalog::Holdings::Physical::Item,
        item_id: "22#{Faker::Number.number(digits: 8)}",
        barcode: Faker::Barcode.ean,
        fulfillment_unit: Faker::Lorem.word,
        call_number: Faker::Lorem.sentence,
        public_note: Faker::Lorem.sentence,
        process_type: nil,
        item_policy: nil,
        description: Faker::Lorem.sentence,
        inventory_number: Faker::Lorem.sentence,
        material_type: Faker::Lorem.word,
        physical_location: physical_location,
        url: Faker::Internet.url)
    end

    def finding_aid_holding
      instance_double(Search::Models::Record::Catalog::Holdings::FindingAids,
        physical_location: physical_location,
        has_description?: true,
        count: 1,
        items: [finding_aid_item])
    end

    def finding_aid_item
      instance_double(Search::Models::Record::Catalog::Holdings::FindingAids::Item,
        url: Faker::Internet.url,
        call_number: Faker::Lorem.sentence,
        description: Faker::Lorem.sentence)
    end

    def physical_location
      instance_double(Search::Models::Record::Catalog::Holdings::Physical::PhysicalLocation,
        url: Faker::Internet.url,
        text: Faker::Lorem.sentence,
        floor: Faker::Lorem.sentence,
        temporary?: false,
        code: double("code", library: Faker::Lorem.word.upcase, location: Faker::Lorem.word.upcase))
    end
  end
end
