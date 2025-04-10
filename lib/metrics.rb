Bundler.require(:metrics)
require "prometheus/middleware/collector"
module Metrics
end

module Metrics::Yabeda
  def self.configure!
    Yabeda.configure do
      counter :datastore_request_count, comment: "Total number of requests to a datastore", tags: %i[datastore]
    end

    Yabeda.configure!
  end
end

class Metrics::Middleware < Prometheus::Middleware::Collector
  KNOWN_PATHS = ["/everything", "/catalog", "/articles", "/onlinejournals", "/guidesandmore", "/index.html"]
  APP_PATHS = ["/auth", "/login", "/logout"]

  protected

  def init_request_metrics
    @requests = @registry.counter(
      :"#{@metrics_prefix}_requests_total",
      docstring:
        "The total number of HTTP requests handled by the Rack application.",
      labels: %i[code method path]
    )
    @durations = @registry.histogram(
      :"#{@metrics_prefix}_request_duration_seconds",
      docstring: "The HTTP response duration of the Rack application.",
      labels: %i[method path],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
    )
  end

  def init_exception_metrics
    @exceptions = @registry.counter(
      :"#{@metrics_prefix}_exceptions_total",
      docstring: "The total number of exceptions raised by the Rack application.",
      labels: [:exception]
    )
  end

  def strip_ids_from_path(path)
    p = super
    p.gsub!(%r{/record/[^/]+}, "/record/:record_id")
    return "/not-a-path" unless (KNOWN_PATHS + APP_PATHS).any? { |app_path| p.start_with?(app_path) }
    p
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
