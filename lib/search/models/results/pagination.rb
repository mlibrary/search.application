class Search::Models::Results::Pagination
  def self.offset_for(uri)
    page = (uri.query_values["page"] || 1).to_i
    (page - 1) * limit_for(uri)
  end

  def self.limit_for(uri)
    (uri.query_values["limit"] || 10).to_i
  end

  attr_reader :total, :limit, :offset
  def initialize(total:, limit:, offset:)
    @total = total
    @limit = limit
    @offset = offset
  end

  def first_index
    offset + 1
  end

  def last_index
    [(offset + limit), total].min
  end

  def current_page
    (offset / limit) + 1
  end
end
