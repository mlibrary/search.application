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

require "search/presenters/actions/action"
