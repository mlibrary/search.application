class Search::Models::Record::Databases::Bib
  # map_*_field methods come from this
  include Search::Models::Record::Metadata

  def initialize(data)
    @data = data
    @datastore = "databases"
  end

  def id
    @data["id"]
  end

  def title
    map_text_field("title").first
  end

  [:description, :coverage, :access_type, :alt_title, :platform].each do |uid|
    define_method(uid) do
      map_text_field(uid)
    end
  end

  def type
    map_field("type") do |text|
      PlainItem.new(text)
    end
  end

  def permalink
    [PlainItem.new(@data["permalink"])]
  end

  [:new, :trial].each do |uid|
    define_method(uid) do
      if @data[uid.to_s]
        [PlainItem.new("Yes")]
      else
        []
      end
    end
  end

  def more_information
    map_field("more_information") do |item|
      PlainLinkToItem.new(text: item["text"], url: item["url"])
    end
  end

  def academic_discipline
    map_field("academic_discipline") do |ad|
      AcademicDisciplineItem.new(data: ad, datastore: @datastore)
    end
  end
end
