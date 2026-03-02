RSpec.describe Search::Models::Results::Catalog do
  let(:data) { create(:catalog_api_one_result) }

  subject { described_class.new(data) }

  it "has catalog records" do
    expect(subject.records.first.class.name).to eq("Search::Models::Record::Catalog")
  end

  it "has pagination" do
    data["limit"] = 5
    data["total"] = 10
    data["offset"] = 0

    expect(subject.pagination.limit).to eq(5)
    expect(subject.pagination.total).to eq(10)
    expect(subject.pagination.current_page).to eq(1)
    expect(subject.pagination.first_index).to eq(1)
    expect(subject.pagination.last_index).to eq(5)
  end

  it "has a limit" do
    expect(subject.limit).to eq(10)
  end
  it "has a total" do
    expect(subject.total).to eq(1)
  end
  it "has an offset" do
    expect(subject.offset).to eq(0)
  end
  context "#filters" do
    it "has filters" do
      filter = subject.filters.first
      expect(filter.field).to eq(data["filters"].first["field"])
      expect(filter.values.first.value).to eq(data["filters"].first["values"].first["text"])
      expect(filter.values.first.count).to eq(data["filters"].first["values"].first["count"])
    end
  end
end

RSpec.describe Search::Models::Results::Catalog::Pagination do
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
