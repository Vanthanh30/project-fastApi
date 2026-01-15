from sqlalchemy.orm import Session
from decimal import Decimal
from app.models.product import Product
from app.models.category import Category

def query_products(analysis: dict, db: Session):
    intent = analysis.get("intent")

    if intent == "budget" and analysis.get("budget"):
        budget = Decimal(analysis["budget"])
        return (
            db.query(Product)
            .filter(
                Product.status == 1,
                Product.price <= budget
            )
            .order_by(Product.price.desc())
            .limit(5)
            .all()
        )

    if intent == "category" and analysis.get("category"):
        keyword = analysis["category"]

        return (
            db.query(Product)
            .join(Category)
            .filter(
                Product.status == 1,
                Category.status == 1,
                (
                    Category.name.ilike(f"%{keyword}%") |
                    Category.description.ilike(f"%{keyword}%")
                )
            )
            .limit(10)
            .all()
        )

    keywords = analysis.get("keywords", [])
    if keywords:
        from sqlalchemy import or_
        conditions = []
        for kw in keywords:
            like = f"%{kw}%"
            conditions.extend([
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.description.ilike(like),
            ])

        return (
            db.query(Product)
            .filter(Product.status == 1, or_(*conditions))
            .limit(10)
            .all()
        )

    return []
