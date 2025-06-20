require "./app"
require "./lib/structured_access_logging_middleware"

use Metrics::Middleware
use StructuredAccessLoggingMiddleware
use Rack::RubyProf, path: "/app/tmp/profile" if S.profile?
run Search::Application
