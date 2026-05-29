class Search::Presenters::Actions
  ACTIONS = [
    {uid: "email", text: "Email"},
    {uid: "text", text: "Text"},
    {uid: "citation", text: "Citation"},
    {uid: "ris", text: "Export&nbsp;Citation (EndNote,&nbsp;Zotero,&nbsp;etc.)"},
    {uid: "link", text: "Copy&nbsp;link"},
    {uid: "toggle-selected", text: "Toggle&nbsp;selected"}
  ]

  def initialize(exclude = [])
    exclude = Array(exclude)
    @actions = ACTIONS.filter_map do |a|
      Action.new(**a) unless exclude.include?(a[:uid])
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
  def initialize(results = [])
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
    result = if @uri.path.include?("/record")
      # Remove query parameters if the URI contains `/record`
      Addressable::URI.parse(@uri).tap { |u| u.query = nil }
    else
      @uri
    end
    result.to_s
  end
end
