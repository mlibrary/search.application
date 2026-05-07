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
  end
end
