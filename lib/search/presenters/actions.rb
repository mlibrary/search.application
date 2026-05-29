class Search::Presenters::Actions
  ACTIONS = [
    ["email", "Email"],
    ["text", "Text"],
    ["citation", "Citation"],
    ["ris", "Export&nbsp;Citation (EndNote,&nbsp;Zotero,&nbsp;etc.)"],
    ["link", "Copy&nbsp;link"],
    ["toggle-selected", "Toggle&nbsp;selected"]
  ]

  def initialize(exclude = [])
    exclude = Array(exclude)
    @actions = ACTIONS.filter_map do |uid, text|
      Action.new(uid: uid, text: text) unless exclude.include?(uid)
    end
  end

  include Enumerable

  def each(&block)
    @actions.each(&block)
  end
end

class Search::Presenters::Actions::Action
  attr_reader :uid, :text
  def initialize(uid:, text:)
    @uid = uid
    @text = text
  end

  def to_s
    text
  end
end

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
