
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.schemas.admin_order import OrderResponse
from app.db.base import get_db
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem

router = APIRouter(prefix="/orders", tags=["adminOrders"])

@router.get("/", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db)):
    orders = (db.query(Order).options(joinedload(Order.items)).all())
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = (db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first())

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

@router.put("/{order_id}/approve_order")
def approve_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Không thể duyệt đơn này")
    order.status = OrderStatus.SHIPPING
    db.commit()

    return {
        "message": "Duyệt đơn hàng thành công",
        "order_id" : order.id,
        "status": order.status

    }
@router.put("/{order_id}/cancel_order")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Không thể duyệt đơn này")
    order.status = OrderStatus.CANCEL
    db.commit()

    return {
        "message": "Hủy đơn hàng thành công",
        "order_id" : order.id,
        "status": order.status

    }