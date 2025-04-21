module Factories::CatalogRecord
  class << self
    include RSpec::Mocks::ExampleMethods
    def record
      double("Search::Models::Record::Catalog#for", holdings: holdings)
    end

    def holdings
      instance_double(Search::Models::Record::Catalog::Holdings, hathi_trust: hathi_trust_holdings,
        alma_digital: alma_digital_holdings, electronic: electronic_holdings)
    end

    def hathi_trust_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust, items: [hathi_trust_item])
    end

    def hathi_trust_item
      instance_double(Search::Models::Record::Catalog::Holdings::HathiTrust::Item,
        url: Faker::Internet.url,
        source: Faker::Educator.university,
        description: Faker::Lorem.sentence,
        status: "Full text")
    end

    def alma_digital_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::AlmaDigital, items: [alma_digital_item])
    end

    def alma_digital_item
      double("Search::Models::Record::Catalog::Holdings::AlmaDigital item",
        url: Faker::Internet.url,
        label: Faker::Lorem.sentence,
        delivery_description: Faker::Lorem.sentence,
        public_note: Faker::Lorem.sentence)
    end

    def electronic_holdings
      instance_double(Search::Models::Record::Catalog::Holdings::Electronic, items: [electronic_item])
    end

    def electronic_item
      double("Search::Models::Record::Catalog::Holdings::Electronic item",
        url: Faker::Internet.url,
        note: Faker::Lorem.sentence,
        status: "Available",
        description: Faker::Lorem.sentence)
    end
  end
end
