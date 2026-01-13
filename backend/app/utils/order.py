from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart_item import CartItem
from app.models.cart import Cart
from app.models.product import Product
from datetime import datetime
from typing import List


def create_order_from_cart(
    db: Session,
    cart: Cart,
    user_id: int,
    data,
    selected_item_ids: List[int],
):
    selected_items = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.id.in_(selected_item_ids)
        )
        .all()
    )

    if not selected_items:
        raise HTTPException(400, "No items selected")

    order_total = 0
    for item in selected_items:
        product: Product = item.product

        if product.quantity < item.quantity:
            raise HTTPException(
                400,
                f"Sản phẩm {product.name} không đủ số lượng"
            )

        order_total += product.price * item.quantity

    order = Order(
        user_id=user_id,
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        address=data.address,
        payment_method=data.payment_method,
        status="Chờ xác nhận",
        total=order_total,
        created_at=datetime.now()
    )

    db.add(order)
    db.flush()  

    for item in selected_items:
        product: Product = item.product

        product.quantity -= item.quantity

        if product.quantity == 0:
            product.status = 3
        elif product.quantity < 5:
            product.status = 2
        else:
            product.status = 1

        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )
        )

        db.delete(item)

    cart.total_cart = sum(
        i.quantity * i.product.price for i in cart.items
    )

    db.commit()
    db.refresh(order)
    return order
