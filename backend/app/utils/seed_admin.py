from app.db.base import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def seed_admin():
    db = SessionLocal()
    name ="admin"
    admin_email = "admin@gmail.com"

    exists = db.query(User).filter(User.email == admin_email).first()
    if exists:
        db.close()
        return

    admin = User(
        email=admin_email,
        name=name,
        password=hash_password("123456"),
        role="admin"
    )

    db.add(admin)
    db.commit()
    db.close()
