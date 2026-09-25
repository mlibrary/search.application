module Search
  class Library
    attr_reader :name, :id
    def initialize(id:, name:)
      @library = name
      @name = name
      @id = id
    end

    def active_class(param:, campus: nil)
      if match?(param) ||
          (
            param.nil? &&
            match?(campus)
          )
        "button__ghost--active"
      end
    end

    def slug
      @id
    end

    def to_s
      name
    end

    def match?(string)
      [name, id].include?(string)
    end
  end

  module Libraries
    LIBRARIES = YAML.load_file(File.join(S.config_path, "libraries.yaml")).map do |data|
      Library.new(id: data["id"], name: data["name"])
    end

    DEFAULT = LIBRARIES.find { |x| x.id == "aa" }

    class << self
      include Enumerable

      def all
        LIBRARIES
      end

      def each(&block)
        all.each do |library|
          block.call(library)
        end
      end

      def default
        DEFAULT
      end
    end
  end
end
