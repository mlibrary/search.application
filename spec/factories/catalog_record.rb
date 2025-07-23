module Factories::CatalogRecord
  class << self
    include RSpec::Mocks::ExampleMethods
    def record
      instance_double(Search::Models::Record::Catalog, bib: bib, holdings: holdings)
    end

    def bib
      instance_double(Search::Models::Record::Catalog::Bib, id: "99#{Faker::Number.number(digits: 12)}6381")
    end

    def holdings
      instance_double(Search::Models::Record::Catalog::Holdings, hathi_trust: hathi_trust_holdings,
        alma_digital: alma_digital_holdings, electronic: electronic_holdings,
        physical: physical_holdings)
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
