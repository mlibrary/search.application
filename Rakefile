require "bundler"
Bundler.require(:default)
Bundler.require(:metrics)
require_relative "lib/search"
desc "Download and update profile photos"
task :get_profile_photos do
  Search::ProfilePhotos.update
end
