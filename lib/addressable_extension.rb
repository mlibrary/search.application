module Addressable
  class URI
    def query_hash
      query_values(Array).sort_by { |entry| entry.first }.group_by { |entry| entry.first }.map do |key, value|
        values = value.map { |v| v[1] }
        result = [key]
        if values.count > 1
          result.push(values)
        else
          result.push(values.first)
        end
      end.to_h
    end
  end
end
