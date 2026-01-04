from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product import Product
from app.models.category import Category


def search_products(
    db: Session,
    keyword: str | None = None,
    category: str | None = None,
    price_type: str = "none",
    max_price: float | None = None,
    limit: int = 5,
):
    query = (
        db.query(Product)
        .join(Category, Product.category_id == Category.id)
        .filter(
            Product.status == 1,
            Product.deleted_at.is_(None)
        )
    )

    # 📂 Category
    if category:
        query = query.filter(Category.name.ilike(f"%{category}%"))

    # 🔑 Keyword: search name OR brand
    if keyword:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{keyword}%"),
                Product.brand.ilike(f"%{keyword}%")
            )
        )

    # 💰 Price
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # ↕️ Sort
    if price_type == "cheap":
        query = query.order_by(Product.price.asc())
    elif price_type == "expensive":
        query = query.order_by(Product.price.desc())

    return query.limit(limit).all()
