module Search
  module Presenters
    class Icons
      TEMPLATE_ICONS = YAML.load_file(File.join(S.config_path, "template_icons.yaml"))

      def initialize(icons = [])
        @icons = icons || []
      end

      def template_icons
        TEMPLATE_ICONS
      end

      def all
        (template_icons + @icons).uniq.sort
      end

      def to_s
        all.join(",")
      end
    end
  end
end
