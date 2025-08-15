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

  def styles
    [
      OpenStruct.new(name: "mla", html: "<i>Birds</i>. v. 1-Jan./Feb. 1966-, 1966-2013."),
      OpenStruct.new(name: "apa", html: "<i>Birds</i> (No. v. 1-Jan./Feb. 1966-). (1966-2013)."),
      OpenStruct.new(name: "chicago", html: "\"Birds,\" 1966-2013."),
      OpenStruct.new(name: "ieee", html: "\"Birds,\" Art. no. v. 1-Jan./Feb. 1966-, 1966-2013."),
      OpenStruct.new(name: "nlm", html: "Birds. Sandy, Bedfordshire, Eng.: Royal Society for the Protection of Birds; 1966-2013;"),
      OpenStruct.new(name: "bibtex", html: "@article{Birds_1966-2013, address={Sandy, Bedfordshire, Eng.}, callNumber={QL671 .B678}, number={v. 1-Jan./Feb. 1966-}, publisher={Royal Society for the Protection of Birds}, year={1966-2013} }")
    ]
  end
end
