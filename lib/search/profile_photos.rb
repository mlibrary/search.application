module Search::ProfilePhotos
  class Person
    def initialize(
      data,
      local_images_directory = File.join(S.project_root, "public", "images", "specialists")
    )
      @data = data
      @local_images_directory = local_images_directory
    end

    def uniqname
      @data["name"].first["value"]
    end

    def webp_filename
      "#{uniqname}.webp"
    end

    def local_image_missing?
      !File.exist?(File.join(@local_images_directory, webp_filename))
    end

    def remote_image_address
      @data["field_user_photo_display"].first["url"]
    end

    def local_image_out_of_date?
      resp = Faraday.head(remote_image_address)
      if resp.status == 200
        DateTime.parse(resp.headers["last-modified"])
      end
    end
  end
end
