from pydantic import BaseModel
from typing import Optional


# =======================
# Stats cards
# =======================
class DashboardStatsResponse(BaseModel):
    total_revenue: int
    new_orders: int
    total_products: int
    total_users: int

    revenue_change: str
    order_change: str
    product_change: str
    user_change: str


# =======================
# Revenue chart
# =======================
class RevenueByMonthResponse(BaseModel):
    month: int
    revenue: int


# =======================
# Best seller
# =======================
class BestSellerResponse(BaseModel):
    id: int
    name: str
    price: int
    sold: int
    image: Optional[str] = None


# =======================
# Recent orders
# =======================
class RecentOrderResponse(BaseModel):
    id: int
    customer: str
    date: str
    items: int
    status: str
    total: int
