module Factories
  class CatalogAPIResults
    def one_record
      {
        "records" => [
          Factories::CatalogAPIRecord.new(fields: [:id, :title, :citation, :holdings]).to_h
        ],
        "filters" => [
          {
            "field" => "subject",
            "values" => [
              {"text" => "History", "count" => 200}
            ]
          }
        ],
        "total" => 1,
        "limit" => 10,
        "offset" => 0
      }
    end
  end
end
