from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from app.db.base import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.user import User

from app.schemas.dashboard import (
    DashboardStatsResponse,
    RevenueByMonthResponse,
    BestSellerResponse,
    RecentOrderResponse,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ======================================================
# 1. Stats
# ======================================================
@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.status == "completed")
        .scalar()
    )

    new_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status == "pending")
        .scalar()
    )

    total_products = db.query(func.count(Product.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()

    return {
        "total_revenue": total_revenue,
        "new_orders": new_orders,
        "total_products": total_products,
        "total_users": total_users,
        # tạm mock %
        "revenue_change": "+12.5%",
        "order_change": "+5.2%",
        "product_change": "0.0%",
        "user_change": "+8.1%",
    }


# ======================================================
# 2. Revenue by month
# ======================================================
@router.get(
    "/revenue-by-month",
    response_model=list[RevenueByMonthResponse]
)
def revenue_by_month(
    year: int = datetime.now().year,
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            extract("month", Order.created_at).label("month"),
            func.sum(Order.total).label("revenue"),
        )
        .filter(
            extract("year", Order.created_at) == year,
            Order.status == "completed",
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    return [
        {
            "month": int(r.month),
            "revenue": int(r.revenue or 0),
        }
        for r in result
    ]


# ======================================================
# 3. Best sellers
# ======================================================
@router.get(
    "/best-sellers",
    response_model=list[BestSellerResponse]
)
def best_sellers(limit: int = 5, db: Session = Depends(get_db)):
    result = (
        db.query(
            Product.id,
            Product.name,
            Product.price,
            Product.image,
            func.sum(OrderItem.quantity).label("sold"),
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "sold": int(p.sold),
            "image": p.image,
        }
        for p in result
    ]


# ======================================================
# 4. Recent orders
# ======================================================
@router.get(
    "/recent-orders",
    response_model=list[RecentOrderResponse]
)
def recent_orders(limit: int = 5, db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(limit)
        .all()
    )

    data = []

    for o in orders:
        items_count = (
            db.query(func.coalesce(func.sum(OrderItem.quantity), 0))
            .filter(OrderItem.order_id == o.id)
            .scalar()
        )

        data.append({
            "id": o.id,
            "customer": o.user.full_name if o.user else "Unknown",
            "date": o.created_at.strftime("%d/%m/%Y"),
            "items": items_count,
            "status": o.status,
            "total": o.total,
        })

    return data
