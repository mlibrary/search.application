class Search::Models::Record::Catalog::Citation
  def initialize(data)
    @data = data["citation"]
  end

  def meta_tags
    @data["tagged"].map do |entity|
      entity["meta"].map do |tag|
        {"name" => tag,
         "content" => entity["content"]}
      end
    end.flatten.compact
  end

  def ris
  end

  def citeproc
  end
end
