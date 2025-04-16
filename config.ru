require "./app"
require "./lib/structured_access_logging_middleware"

use Metrics::Middleware
use StructuredAccessLoggingMiddleware
run Search::Application
