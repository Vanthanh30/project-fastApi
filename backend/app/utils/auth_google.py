from app.models.user import User
from sqlalchemy.orm import Session

def get_or_create_google_user(db: Session, user_info: dict) -> User:
    email = user_info.get("email")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email,
            name=user_info.get("name"),
            password=None,
            role_id=2,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
