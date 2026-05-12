class Search::Presenters::Actions::Action::Citation
  def initialize(results)
    @results = results || []
  end

  def csl
    @results.map { |record| record.csl }
  end

  def ris
    @results.map { |record| record.ris }
  end
end
