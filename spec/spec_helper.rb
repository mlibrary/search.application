require "rack/test"
require "rspec"
require "debug"
require "webmock/rspec"
require "httpx/adapters/webmock"
require "simplecov"
require "faker"
require "sidekiq/testing"
Sidekiq::Testing.fake!
SimpleCov.start

ENV["APP_ENV"] = "test"
require_relative "factories"
require_relative "../app"
OmniAuth.config.test_mode = true

module RSpecMixin
  include Rack::Test::Methods
  include AlmaRestClient::Test::Helpers
  include Factories

  def app = Search::Application
end

RSpec.configure do |config|
  config.include RSpecMixin
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  # This option will default to `:apply_to_host_groups` in RSpec 4 (and will
  # have no way to turn it off -- the option exists only for backwards
  # compatibility in RSpec 3). It causes shared context metadata to be
  # inherited by the metadata hash of host groups and examples, rather than
  # triggering implicit auto-inclusion in groups with matching metadata.
  config.shared_context_metadata_behavior = :apply_to_host_groups

  if config.files_to_run.one?
    # use the documentation formatter for detailed output,
    # unless a formatter has already been configured
    # (e.g. via a command-line flag).
    config.default_formatter = "doc"
  end

  #   # Print the 10 slowest examples and example groups at the
  #   # end of the spec run, to help surface which specs are running
  #   # particularly slow.
  #   config.profile_examples = 10
  #
  #   # Run specs in random order to surface order dependencies. If you find an
  #   # order dependency and want to debug it, you can fix the order by providing
  #   # the seed, which is printed after each run.
  #   #     --seed 1234
  #   config.order = :random
  #
  #   # Seed global randomization in this process using the `--seed` CLI option.
  #   # Setting this allows you to use `--seed` to deterministically reproduce
  #   # test failures related to randomization by passing the same `--seed` value
  #   # as the one that triggered the failure.
  #   Kernel.srand config.seed
  config.before(:each) do
    Sidekiq::Worker.clear_all
  end
end

def fixture(path)
  File.read("./spec/fixtures/#{path}")
end

class FakeTwilioClient
  def messages
    Messages.new
  end

  class Messages
    def create(to:, body:, messaging_service_sid:)
      if to == "bad_number"
        raise Twilio::REST::RestError.new("Something", Twilio::Response.new(400, nil))
      else
        OpenStruct.new(to: to, body: body, messaging_service_sid: messaging_service_sid, status: "OK")
      end
    end
  end
end

S.register(:twilio_client) {
  FakeTwilioClient.new
}

Mail.defaults do
  delivery_method :test
end

Sidekiq.logger.level = Logger::WARN
