class Search::Models::Record::Catalog::Bib
  FORMAT_ICONS = YAML.load_file(File.join(S.config_path, "format_icons.yaml"))
  # map_*_field methods come from this
  include Search::Models::Record::Metadata

  def initialize(data)
    @data = data
    @datastore = self.class.name.split("::")[-2].downcase
  end

  def id
    @data["id"]
  end

  def title
    map_paired_field("title") { |item| Item.new(item) }.first
  end

  [:access, :arrangement, :association, :audience, :awards, :bibliography,
    :biography_history, :chronology, :contents, :content_advice,
    :copy_specific_note, :copyright, :copyright_status_information, :created,
    :current_publication_frequency, :date_place_of_event, :distributed,
    :edition, :extended_summary, :finding_aids, :former_publication_frequency,
    :funding_information, :in_collection, :language_note,
    :location_of_originals, :manufactured, :map_scale, :media_format, :note,
    :numbering, :numbering_notes, :original_version_note, :performers,
    :physical_description, :place, :playing_time, :preferred_citation, :printer,
    :production_credits, :published, :publisher_number, :references,
    :related_items, :reproduction_note, :series, :series_statement,
    :source_of_acquisition, :source_of_description_note, :summary,
    :terms_of_use].each do |uid|
    define_method(uid) do
      map_paired_field(uid.to_s) do |item|
        Item.new(item)
      end
    end
  end

  def format
    map_field("format") do |f|
      OpenStruct.new(text: f, icon: FORMAT_ICONS[f], paired?: false)
    end
  end

  def main_author
    map_paired_field("main_author") do |ma|
      AuthorBrowseItem.new(data: ma, datastore: @datastore)
    end
  end

  [:new_title, :other_titles, :previous_title, :preferred_title, :releated_title].each do |uid|
    define_method(uid) do
      map_paired_field(uid.to_s) do |item|
        LinkToItem.new(data: item, datastore: @datastore)
      end
    end
  end

  def related_title
    map_paired_field("related_title") do |item|
      LinkToItem.new(data: item, datastore: @datastore)
    end
  end

  def contributors
    map_paired_field("contributors") do |item|
      AuthorBrowseItem.new(data: item, datastore: @datastore)
    end
  end

  def call_number
    map_field("call_number") do |item|
      CallNumberBrowseItem.new(item)
    end
  end

  [:lc_subjects, :remediated_lc_subjects].each do |uid|
    define_method(uid) do
      map_field(uid.to_s) do |item|
        SubjectBrowseItem.new(item)
      end
    end
  end

  def academic_discipline
    map_field("academic_discipline") do |ad|
      AcademicDisciplineItem.new(ad)
    end
  end

  [:bookplate, :language, :oclc, :isbn, :gov_doc_number, :new_title_issn,
    :previous_title_issn, :other_subjects, :report_number,
    :issn].each do |uid|
    define_method(uid) { map_text_field(uid.to_s) }
  end
end
