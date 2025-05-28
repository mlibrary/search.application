class Search::Models::Record::Catalog::Bib
  FORMAT_ICONS = YAML.load_file(File.join(S.config_path, "format_icons.yaml"))
  def initialize(data)
    @data = data
  end

  def title
    _map_paired_field("title") { |item| Item.new(item) }.first
  end

  [:access, :arrangement, :association, :audience, :awards, :bibliography,
    :biography_history, :chronology, :content_advice, :copy_specific_note,
    :copyright, :copyright_status_information, :created,
    :current_publication_frequency, :date_place_of_event, :distributed, :edition,
    :extended_summary, :former_publication_frequency, :funding_information,
    :in_collection, :language_note, :location_of_originals, :manufactured,
    :map_scale, :note, :numbering, :numbering_notes, :original_version_note,
    :performers, :physical_description, :place, :playing_time,
    :preferred_citation, :printer, :production_credits, :published, :references,
    :related_items, :reproduction_note, :series, :series_statement,
    :source_of_acquisition, :source_of_description_note, :summary,
    :terms_of_use].each do |uid|
    define_method(uid) do
      _map_paired_field(uid.to_s) do |item|
        Item.new(item)
      end
    end
  end

  def format
    _map_field("format") do |f|
      OpenStruct.new(text: f, icon: FORMAT_ICONS[f])
    end
  end

  def main_author
    _map_paired_field("main_author") do |ma|
      AuthorBrowseItem.new(ma)
    end
  end

  def other_titles
    _map_paired_field("other_titles") do |item|
      LinkToItem.new(item)
    end
  end

  def related_title
    _map_paired_field("related_title") do |item|
      LinkToItem.new(item)
    end
  end

  def contributors
    _map_paired_field("contributors") do |item|
      AuthorBrowseItem.new(item)
    end
  end

  def call_number
    _map_field("call_number") do |item|
      CallNumberBrowseItem.new(item)
    end
  end

  def lcsh_subjects
    _map_field("lcsh_subjects") do |item|
      SubjectBrowseItem.new(item)
    end
  end

  def academic_discipline
    _map_field("academic_discipline") do |ad|
      AcademicDisciplineItem.new(ad)
    end
  end

  [:bookplate, :language, :oclc, :isbn, :gov_doc_no, :publisher_number,
    :report_number, :issn].each do |uid|
    define_method(uid) { _map_text_field(uid.to_s) }
  end

  private

  def _map_text_field(uid)
    _map_field(uid) do |item|
      Item.new(item)
    end.uniq(&:text)
  end

  def _map_paired_field(uid)
    _map_field(uid) do |item|
      temp = {}
      item.to_a.each do |key, value|
        if value
          temp[key] = yield value
        end
      end
      if temp["original"] == temp["transliterated"]
        temp.delete("transliterated")
      end
      OpenStruct.new(**temp)
    end
  end

  def _map_field(uid)
    list = @data.dig(uid.to_s) || []
    list.map do |item|
      yield(item)
    end
  end

  # to include this, the class needs to have @data with a "search" key
  module SearchUrl
    def url
      query_string = @data["search"].map do |x|
        "#{x["field"]}:\"#{x["value"]}\""
      end.join(" AND ")
      "#{S.base_url}/catalog?" + {query: query_string}.to_query
    end
  end

  # to include this, the class needs to have the methods browse_category and browse_query_string
  module BrowseUrl
    def browse_url
      "#{S.base_url}/catalog/browse/#{browse_category}?" + {query: browse_query_string}.to_query
    end
  end

  class Item
    def initialize(data)
      @data = data
    end

    def text
      @data["text"].strip
    end

    def to_s
      text
    end

    def ==(other)
      self.class == other.class && text == other.text
    end
  end

  class LinkToItem < Item
    include SearchUrl
  end

  class AuthorBrowseItem < Item
    include SearchUrl
    include BrowseUrl

    def kind
      "author"
    end

    private

    def browse_category
      "author"
    end

    def browse_query_string
      @data["browse"]
    end
  end

  class SubjectBrowseItem < Item
    include BrowseUrl

    def kind
      "subject"
    end

    def url
      "#{S.base_url}/catalog?" + {query: "subject:\"#{browse_query_string}\""}.to_query
    end

    private

    def browse_category
      "subject"
    end

    def browse_query_string
      text.split(" -- ").join(" ")
    end
  end

  class CallNumberBrowseItem < Item
    include BrowseUrl

    def kind
      "call_number"
    end

    def url
    end

    private

    def browse_category
      "callnumber"
    end

    def browse_query_string
      text
    end
  end

  class AcademicDisciplineItem
    def initialize(data)
      @data = data
    end

    # This is here _map_field can work
    def text
      @data["list"].join(" > ")
    end

    def disciplines
      @data["list"].map do |text|
        AcademicDisciplineElement.new(text)
      end
    end
  end

  class AcademicDisciplineElement < Item
    attr_reader :text
    def initialize(text)
      @text = text
    end

    def url
      "#{S.base_url}/catalog?" + {query: "academic_discipline:#{text}"}.to_query
    end
  end
end
