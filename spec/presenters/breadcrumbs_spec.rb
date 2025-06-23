RSpec.describe Search::Presenters::Breadcrumbs do
  before(:each) do
    @current_page = "Lorem Ipsum"
    @query_string = "?query=birds&filter.format=Book"
    @url_part = {
      "start" => "http://localhost:4567/guidesandmore",
      "middle" => "/record/123456789",
      "end" => "/get-this/987654321"
    }
    @url = "#{@url_part["start"]}#{@url_part["middle"]}#{@url_part["end"]}#{@query_string}"
  end

  subject do
    described_class.new(current_page: @current_page, uri: URI.parse(@url))
  end

  context "#any?" do
    it "is true" do
      expect(subject.any?).to be true
    end
    it "is false" do
      @url = "#{@url_start}#{@query_string}"
      expect(subject.any?).to be false
    end
  end

  context "#current_page" do
    it "has current_page" do
      expect(subject.current_page).to eq(@current_page)
    end
  end

  context "#each" do
    it "iterates over the breadcrumbs with the body" do
      breadcrumbs = []
      subject.each do |breadcrumb|
        breadcrumbs << breadcrumb.body
      end

      expect(breadcrumbs).to eq(["Guides and More", "Record"])
    end
  end

  context "#query_string" do
    it "returns the query string from the url" do
      expect(subject.send(:query_string)).to eq(@query_string)
    end
  end

  context "#subdirectories" do
    it "splits the url subdirectories, and removes ones that are empty" do
      expect(subject.send(:subdirectories)).to eq(["guidesandmore", "record", "123456789", "get-this", "987654321"])
    end
  end

  context "#breadcrumb_title" do
    it "converts the slug into a title" do
      expect(subject.send(:breadcrumb_title, "lorem-ipsum")).to eq(@current_page)
    end
  end

  context "#breadcrumbs" do
    it "returns an array of objects, with the last removed" do
      @url = "#{@url_part["start"]}#{@url_part["middle"]}#{@query_string}"
      expect(subject.send(:breadcrumbs)).to eq([
        OpenStruct.new(
          body: "Guides and More",
          url: "/guidesandmore#{@query_string}"
        )
      ])
    end
  end
end
