# from sqlalchemy.orm import Session
# from app.db.base import SessionLocal
# from app.models.user import User
# from app.models.role import Role
# from app.core.security import hash_password


# def seed_admin():
#     db: Session = SessionLocal()

#     # 1️⃣ Tạo role admin nếu chưa có
#     admin_role = db.query(Role).filter(Role.name == "admin").first()
#     if not admin_role:
#         admin_role = Role(name="admin")
#         db.add(admin_role)
#         db.commit()
#         db.refresh(admin_role)

#     # 2️⃣ Tạo role user nếu chưa có (khuyến nghị)
#     user_role = db.query(Role).filter(Role.name == "user").first()
#     if not user_role:
#         user_role = Role(name="user")
#         db.add(user_role)
#         db.commit()

#     # 3️⃣ Tạo admin account nếu chưa có
#     admin_email = "admin@gmail.com"
#     exists = db.query(User).filter(User.email == admin_email).first()

#     if not exists:
#         admin = User(
#             email=admin_email,
#             password=hash_password("123456"),
#             name="Admin",
#             role_id=admin_role.id,   # ✅ ĐÚNG
#             status=1
#         )
#         db.add(admin)
#         db.commit()

#     db.close()
