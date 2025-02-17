source "https://rubygems.org"

gem "sinatra"
gem "puma"
gem "rackup"
gem "canister"
gem "omniauth"
gem "omniauth_openid_connect"
gem "alma_rest_client",
  git: "https://github.com/mlibrary/alma_rest_client",
  tag: "v2.0.0"
gem "semantic_logger"

group :development, :test do
  gem "debug"
end

group :test do
  gem "rspec"
  gem "rack-test"
  gem "simplecov"
  gem "simplecov-lcov"
  gem "webmock"
end

group :development do
  gem "standard"
  gem "ruby-lsp"
end
