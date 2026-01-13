import cloudinary.uploader
from fastapi import UploadFile, HTTPException

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def upload_avatar(file: UploadFile) -> dict:
    # 1️⃣ Validate type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image type"
        )

    # 2️⃣ Read file
    contents = await file.read()

    # 3️⃣ Validate size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image must be <= 5MB"
        )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="avatars",
            resource_type="image",
            transformation=[
                {"width": 500, "height": 500, "crop": "fill"},
                {"quality": "auto"},
                {"fetch_format": "auto"}
            ]
        )

        return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to upload avatar"
        )
    finally:
        await file.seek(0)


def delete_avatar(public_id: str) -> bool:
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False
