class Search::Presenters::Action
  attr_reader :uid, :text
  def initialize(uid:, text:)
    @uid = uid
    @text = text
  end

  def to_s
    text
  end
end
