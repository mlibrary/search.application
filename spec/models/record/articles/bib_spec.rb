RSpec.describe Search::Models::Record::Articles::Bib do
  before(:each) do
    @data = JSON.parse(fixture("record/articles/article.json"))
  end

  subject do
    described_class.new(@data)
  end

  context "#title" do
    it "only has one text" do
      expect(subject.title.text).to eq("Banding Together: How Communities Create Genres in Popular Music")
    end
  end

  context "#author" do
    it "has expected output" do
      my_subject = subject.author.first
      expect(my_subject.text).to eq("Lena, Jennifer C")
      expect(my_subject.url).to eq("#{S.base_url}/articles?" + {query: 'author:"Lena, Jennifer C"'}.to_query)
    end
  end
  [
    :abstract, :abstract, :journal_title, :issue, :volume, :pages,
    :publication_date, :publisher, :genre, :issn, :eissn, :isbn, :eisbn, :doi,
    :oclc, :pmid, :language, :subject, :edition
  ].each do |uid|
    context "##{uid}" do
      it "is an array of OpenStructs that respond to text" do
        expected = @data[uid.to_s].first["text"]
        expect(subject.public_send(uid)[0].text).to eq(expected)
      end
      it "does not include duplicates entries" do
        @data[uid.to_s].push({"text" => @data[uid.to_s].first["text"]})
        expect(subject.public_send(uid).count).to eq(1)
      end
      it "has false #paired? response" do
        expect(subject.public_send(uid)[0].paired?).to eq(false)
      end
    end
  end
end
