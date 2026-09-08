RSpec.describe Search::Models::Results::Pagination do
  let(:params) { {total: 50, limit: 10, offset: 0} }
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
