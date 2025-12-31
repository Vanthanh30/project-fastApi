import cloudinary.uploader

def upload_avatar(file):
    result = cloudinary.uploader.upload(
        file,
        folder="avatars",
        resource_type="image"
    )
    return result["secure_url"]
