RSpec.describe Search::Models::Results::Pagination do
  let(:params) { {total: 50, limit: 10, offset: 0} }
  def generate_uri(page: nil, limit: nil)
    uri_str = "/catalog?query=whatever"
    uri_str += "&page=#{page}" if page
    uri_str += "&limit=#{limit}" if limit
    Addressable::URI.parse(uri_str)
  end
  context ".offset_for" do
    it "handles page 1, limit 1" do
      subj = described_class.offset_for(generate_uri(page: 1, limit: 1))
      expect(subj).to eq(0)
    end
    it "handles page 2, limit 1" do
      subj = described_class.offset_for(generate_uri(page: 2, limit: 1))
      expect(subj).to eq(1)
    end
    it "handles page 2, limit 10" do
      subj = described_class.offset_for(generate_uri(page: 2, limit: 10))
      expect(subj).to eq(10)
    end
    it "handles no page no limit" do
      subj = described_class.offset_for(generate_uri)
      expect(subj).to eq(0)
    end
    it "handles page without limit" do
      subj = described_class.offset_for(generate_uri(page: 3))
      expect(subj).to eq(20)
    end
    it "handles limit without page" do
      subj = described_class.offset_for(generate_uri(limit: 1))
      expect(subj).to eq(0)
    end
  end
  subject do
    described_class.new(**params)
  end

  context "#total" do
    it "returns the total" do
      expect(subject.total).to eq(50)
    end

    it "returns the limit" do
      expect(subject.limit).to eq(10)
    end

    context "#first_index" do
      it "handles a page 1" do
        expect(subject.first_index).to eq(1)
      end
      it "handles page 2" do
        params[:offset] = 10
        expect(subject.first_index).to eq(11)
      end
      it "handles page 3 with different limit" do
        params[:limit] = 5
        params[:offset] = 10
        expect(subject.first_index).to eq(11)
      end
    end
    context "#last_index" do
      it "handles a page 1" do
        expect(subject.last_index).to eq(10)
      end
      it "handles page 2" do
        params[:offset] = 10
        expect(subject.last_index).to eq(20)
      end
      it "handles page 3 with different limit" do
        params[:limit] = 5
        params[:offset] = 10
        expect(subject.last_index).to eq(15)
      end

      it "handles a last page" do
        params[:total] = 13
        params[:offset] = 10
        expect(subject.last_index).to eq(13)
      end
    end
    context "#current_page" do
      it "handles a page 1" do
        expect(subject.current_page).to eq(1)
      end
      it "handles a page 2" do
        params[:offset] = 10
        expect(subject.current_page).to eq(2)
      end
      it "handles a page 3" do
        params[:offset] = 20
        expect(subject.current_page).to eq(3)
      end
      it "handles a page 2 with different limit" do
        params[:offset] = 5
        params[:limit] = 5
        expect(subject.current_page).to eq(2)
      end
    end
  end
end
