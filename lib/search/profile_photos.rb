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
        Dir.mktmpdir do |dir|
          source_file = pull(dir)
          convert(dir, source_file)
          move_converted_images(dir)
        end
      end
    end

    def uniqname
      @data["name"].first["value"]
    end

    def webp_filename
      "#{uniqname}.webp"
    end

    def jpg_filename
      "#{uniqname}.jpg"
    end

    def local_webp_path
      File.join(@local_images_directory, webp_filename)
    end

    def local_image_missing?
      !File.exist?(local_webp_path)
    end

    def remote_image_address
      @data["field_user_photo_display"].first["url"]
    end

    def local_image_out_of_date?
      return true if local_image_missing?
      resp = Faraday.head(remote_image_address)
      remote_file_modified_time = DateTime.parse(resp.headers["last-modified"])
      local_file_modified_time = File.ctime(local_webp_path)
      remote_file_modified_time > local_file_modified_time
    end

    def pull(dir)
      resp = Faraday.get(remote_image_address)
      file_extension = case resp.headers["content-type"]
      when "image/jpeg"
        "jpg"
      when "image/png"
        "png"
      else
        raise "Unknown File Type"
      end
      file_name = "source.#{file_extension}"
      File.binwrite(File.join(dir, file_name), resp.body)
      file_name
    end

    def convert(dir:, source_file_name:)
    end

    def move(dir)
      [jpg_filename, webp_filename].each do |filename|
        FileUtils.mv(File.join(dir, filename), File.join(@local_images_directory, filename))
      end
    end
  end
end
