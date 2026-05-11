require "mini_magick"
module Search::ProfilePhotos
  def self.configure_metrics!
    Yabeda.configure do
      group :search_update_profile_photos do
        gauge :updated_count, comment: "Number of specialist images updated for this run"
        gauge :skipped_count, comment: "Number of specialist images skipped during this run"
        gauge :last_success, comment: "Time of last successful run of profile photo update job"
        gauge :job_duration_seconds, comment: "Time spent running profile photo update job"
      end
    end
    Yabeda.configure!
  end

  def self.metrics
    Yabeda.search_update_profile_photos
  end

  def self.push_metrics
    # The env var needs to be set to the push gateway url
    if ENV["PROMETHEUS_PUSH_GATEWAY"]&.match?(URI::DEFAULT_PARSER.make_regexp)
      Yabeda::Prometheus.push_gateway.add(Yabeda::Prometheus.registry)
      S.logger.info("Metrics sent to the push gateway")
    else
      S.logger.warn("PROMETHEUS_PUSH_GATEWAY env var not set. Metrics not sent to the push gateway")
    end
  end

  def self.print_metrics
    Prometheus::Client::Formats::Text.marshal(Yabeda::Prometheus.registry)
  end

  def self.update
    start = Time.now
    S.logger.info("start")
    configure_metrics!
    S.logger.info("Fetching profiles data from library website cms")
    response = Faraday.get(S.profile_photo_data_url)
    profiles = JSON.parse(response.body)
    profiles.each do |profile|
      Person.new(profile).update
    end
    metrics.job_duration_seconds.set({}, Time.now - start)
    metrics.last_success.set({}, Time.now.to_i)
    push_metrics
    puts print_metrics
    S.logger.info("end")
  rescue Faraday::Error, JSON::ParserError => e
    puts "Failed to fetch profile photos: #{e.message}"
    abort("Unable to fetch profile photos")
  end

  class Person
    def initialize(
      data,
      local_images_directory = File.join(S.project_root, "public", "images", "specialists")
    )
      @data = data
      @local_images_directory = local_images_directory
    end

    def update
      if local_image_out_of_date?
        S.logger.info("update_image", uniqname: uniqname)
        convert
        Search::ProfilePhotos.metrics.updated_count.increment
      else
        S.logger.debug("skipping_image_update", uniqname: uniqname)
        Search::ProfilePhotos.metrics.skipped_count.increment
      end
    end

    def uniqname
      @data["name"].first["value"]
    end

    def local_image_missing?
      !File.exist?(local_webp_path)
    end

    def local_image_out_of_date?
      return true if local_image_missing?
      resp = Faraday.head(remote_image_address)
      remote_file_modified_time = DateTime.parse(resp.headers["last-modified"])
      local_file_modified_time = File.ctime(local_webp_path)
      remote_file_modified_time > local_file_modified_time
    end

    def convert
      image = MiniMagick::Image.open(remote_image_address)

      image.combine_options do |b|
        b.resize "128x150^"
        b.gravity "NorthEast"
        b.crop "128x150+0+0"
      end

      image.format "jpeg"
      image.write(File.join(@local_images_directory, jpg_filename))

      image.format "webp"
      image.write(File.join(@local_images_directory, webp_filename))
    end

    private

    def webp_filename
      "#{uniqname}.webp"
    end

    def jpg_filename
      "#{uniqname}.jpg"
    end

    def local_webp_path
      File.join(@local_images_directory, webp_filename)
    end

    def remote_image_address
      @data["field_user_photo_display"].first["url"]
    end
  end
end
