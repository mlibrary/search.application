module Factories
  class ShelfBrowse
    def self.item
      {
        title: Faker::Book.title,
        author: Faker::Book.author,
        date: Faker::Number.number(digits: 4),
        call_number: Faker::Lorem.sentence,
        url: Faker::Internet.url,
        book_cover_url: Faker::Internet.url
      }
    end
  end
end
