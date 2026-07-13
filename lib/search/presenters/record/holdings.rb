module Search::Presenters::Record::Holdings
  def table_heading_for(text)
    TableHeading.new(text)
  end

  def plain_text_cell_for(text)
    ItemCell::PlainText.new(text)
  end

  def link_to_cell_for(text:, url:)
    ItemCell::LinkTo.new(text: text, url: url)
  end

  def success_cell_for(text)
    ItemCell::Status::Success.new(text)
  end

  def warning_cell_for(text)
    ItemCell::Status::Warning.new(text)
  end

  def error_cell_for(text)
    ItemCell::Status::Error.new(text)
  end

  class TableHeading
    attr_reader :text
    def initialize(text)
      @text = text
    end

    def css_class
      "holding__table--heading-" + text.downcase.tr(" ", "-")
    end

    def to_s
      text
    end
  end

  class ItemCell
    def text
      raise NotImplementedError
    end

    def partial
      raise NotImplementedError
    end

    def to_s
      text
    end

    class PlainText < ItemCell
      attr_reader :text
      def initialize(text)
        @text = text
      end

      def partial
        "plain_text"
      end
    end

    class LinkTo < ItemCell
      attr_reader :text, :url
      def initialize(text:, url:)
        @text = text
        @url = url
      end

      def partial
        "link_to"
      end
    end

    class Status < ItemCell
      attr_reader :text, :intent, :icon
      def initialize(intent:, text:, icon:)
        @intent = intent
        @text = text
        @icon = icon
      end

      def partial
        "status"
      end

      class Success < self
        def initialize(text)
          @text = text
        end

        def intent
          "success"
        end

        def icon
          "check_circle"
        end
      end

      class Warning < self
        def initialize(text)
          @text = text
        end

        def intent
          "warning"
        end

        def icon
          "warning"
        end
      end

      class Error < self
        def initialize(text)
          @text = text
        end

        def intent
          "error"
        end

        def icon
          "error"
        end
      end
    end
  end
end
