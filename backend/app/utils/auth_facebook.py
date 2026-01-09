from app.models.user import User
from sqlalchemy.orm import Session

def get_or_create_facebook_user(db: Session, profile: dict) -> User:
    facebook_id = profile.get("id")
    name = profile.get("name")
    email = profile.get("email")

    if not facebook_id:
        raise ValueError("Facebook ID is required")

    if not email:
        email = f"{facebook_id}@facebook.com"

    user = db.query(User).filter(User.email == email).first()

    if user:
        return user

    user = User(
        email=email,
        name=name,
        password=None,
        role_id=2,
        is_verified=1
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
