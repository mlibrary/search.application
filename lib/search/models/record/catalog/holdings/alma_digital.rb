class Search::Models::Record::Catalog::Holdings::AlmaDigital
  def initialize(data)
    @alma_digital_items = data.dig("holdings", "alma_digital_items")
  end

  def items
    @alma_digital_items.map do |item|
      params = [:url, :delivery_description, :label, :public_note].map do |field|
        [field, item[field.to_s]]
      end.to_h

      OpenStruct.new(**params)
    end
  end
end
