Bundler.require(:metrics)
require "prometheus/middleware/collector"
require "sinatra/base"

module Metrics
end

module Metrics::Yabeda
  def self.configure!
    Yabeda.configure do
      counter :datastore_request_count, comment: "Total number of requests to a datastore", tags: %i[datastore]
      counter :http_server_requests_total,
        comment: "The total number of http requests handled by the Search::Application",
        tags: [:method, :datastore, :route, :code]
      histogram :http_server_request_duration_seconds do
        comment "The HTTP response duration of requests to Search::Application"
        tags [:method, :datastore, :route]
        unit :seconds
        buckets [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
      end
      histogram :shelf_browse_api_duration_seconds do
        comment "The length of time to return data for shelf browse"
        tags []
        unit :seconds
        buckets [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
      end
      histogram :holdings_duration_seconds do
        comment "The length of time to process holdings"
        tags []
        unit :seconds
        buckets [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
      end
      histogram :catalog_api_full_record_duration_seconds do
        comment "The length of time to get a full record form the catalog api"
        tags []
        unit :seconds
        buckets [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
      end
    end

    Yabeda.configure!
  end
end

class Metrics::Middleware
  attr_reader :app

  def initialize(app, options = {})
    @app = app
  end

  def call(env)
    trace(env) { @app.call(env) }
  end

  def trace(env)
    response = nil
    duration = Benchmark.realtime { response = yield }
    record(env, response.first.to_s, duration, response[1])
    remove_metrics_headers(response[1])
    response
  end

  def remove_metrics_headers(response_headers)
    response_headers.keys.each { |key| response_headers.delete(key) if key.match?(/^metrics/) }
  end

  def record(env, code, duration, response_headers)
    method = env["REQUEST_METHOD"].downcase
    tags = {
      datastore: response_headers["metrics.datastore"],
      route: response_headers["metrics.route"],
      method: method
    }

    Yabeda.http_server_requests_total.increment(tags.merge({code: code}))
    Yabeda.http_server_request_duration_seconds.measure(tags, duration)
  end
end

module Metrics::PrometheusConfig
  class << self
    def exporter_url
      ENV.fetch("PROMETHEUS_EXPORTER_URL", "tcp://0.0.0.0:9100/metrics")
    end
  end
end

module Metrics::PumaConfig
  class << self
    # The actual puma default the control app is tcp://0.0.0.0:9293, but we
    # don't need this to be a tcp socket.
    #
    # @return [String]
    def control_app_url
      ENV.fetch("PUMA_CONTROL_APP", "unix:///tmp/search.sock")
    end

    # The control app doesn't require authentication so we don't provide a
    # token
    #
    # @return [Hash]
    def control_app_opts
      {no_token: true}
    end
  end
end
