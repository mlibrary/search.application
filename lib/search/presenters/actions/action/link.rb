class Search::Presenters::Actions::Action::Link
  def initialize(uri)
    @uri = uri
  end

  def uri
    if @uri.path.include?("/record")
      # Remove query parameters if the URI contains `/record`
      Addressable::URI.parse(@uri).tap { |u| u.query = nil }.to_s
    else
      @uri.to_s
    end
  end
end
