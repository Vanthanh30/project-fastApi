from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import Optional

from app.db.base import get_db
from app.middleware.authenticate import authenticate
from app.models.cart import Cart
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order import CreateOrderRequest
from app.utils.order import create_order_from_cart

router = APIRouter(prefix="/orders", tags=["Order"])

@router.post("/")
def create_order(
    data: CreateOrderRequest,
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    cart = db.query(Cart).filter(
        Cart.user_id == user.id
    ).first()

    if not cart:
        raise HTTPException(404, "Cart not found")

    if not cart.items:
        raise HTTPException(400, "Cart is empty")

    try:
        order = create_order_from_cart(
            db=db,
            cart=cart,
            user_id=user.id,
            data=data
        )
        return {
            "message": "Order created successfully",
            "order_id": order.id
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.put("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id
    ).first()

    if not order:
        raise HTTPException(404, "Order not found")

    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Không thể huỷ đơn khi đơn hàng đang giao hoặc đã hoàn thành"
        )

    try:
        order.status = OrderStatus.CANCEL

        for item in order.items:
            product = item.product
            product.quantity += item.quantity
            product.status = 1

        db.commit()
        db.refresh(order)
        return {"message": "Huỷ đơn hàng thành công"}

    except Exception as e:
        db.rollback()
        raise HTTPException(500, str(e))


@router.get("/history")
def my_orders(
    status: Optional[OrderStatus] = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    query = (
        db.query(Order)
        .options(
            selectinload(Order.items)
            .selectinload(OrderItem.product)
        )
        .filter(Order.user_id == user.id)
    )

    if status:
        query = query.filter(Order.status == status)

    return query.order_by(Order.created_at.desc()).all()
