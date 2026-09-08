class Search::Models::Results::Pagination
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
