source "https://rubygems.org"

gem "sinatra"
gem "sinatra-flash"
gem "sinatra-contrib"
gem "puma"
gem "rackup"
gem "canister"
gem "omniauth"
gem "omniauth_openid_connect"
gem "ostruct"
gem "sidekiq"
gem "benchmark"
gem "alma_rest_client",
  git: "https://github.com/mlibrary/alma_rest_client",
  tag: "alma_rest_client/v2.2.0"
gem "activesupport"
gem "semantic_logger"
gem "twilio-ruby"
gem "mail"
gem "addressable"
gem "debug"

group :metrics do
  gem "yabeda-puma-plugin"
  gem "yabeda-prometheus"
  gem "prometheus-client"
end

group :development, :test do
  gem "faker"
  gem "ruby-prof"
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
