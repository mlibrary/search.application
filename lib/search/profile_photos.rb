require "mini_magick"
module Search::ProfilePhotos
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
      else
        S.logger.debug("skipping_image_update", uniqname: uniqname)
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
