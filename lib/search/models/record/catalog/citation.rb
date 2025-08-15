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
    @data["tagged"].map do |entity|
      entity["ris"].map do |tag|
        "#{tag}  - #{entity["content"]}"
      end
    end.flatten.compact.join("\n").strip
  end

  def citeproc
  end
end
