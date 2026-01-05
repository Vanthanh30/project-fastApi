from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart_item import CartItem
from app.models.cart import Cart
from app.models.product import Product
from datetime import datetime


def create_order_from_cart(db: Session, cart: Cart, user_id: int, data):
    if not cart.items or len(cart.items) == 0:
        raise HTTPException(400, "Cart is empty")

    # 1️⃣ Tạo order
    order = Order(
        user_id=user_id,
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        address=data.address,
        payment_method=data.payment_method,
        status="Chờ xác nhận",
        total=cart.total_cart,
        created_at=datetime.now()
    )
    db.add(order)
    db.flush()  # lấy order.id

    # 2️⃣ Tạo order_item + trừ kho
    for item in cart.items:
        product: Product = item.product

        if product.quantity < item.quantity:
            raise HTTPException(
                400,
                f"Sản phẩm {product.name} không đủ số lượng"
            )

        # trừ kho
        product.quantity -= item.quantity

        # cập nhật status product
        if product.quantity == 0:
            product.status = 3  # Hết hàng
        elif product.quantity < 5:
            product.status = 2  # Sắp hết
        else:
            product.status = 1  # Đang bán

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )
        db.add(order_item)

    # 3️⃣ XÓA CART ITEMS (KHÔNG XOÁ CART)
    db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).delete()

    # 4️⃣ Reset cart
    cart.total_cart = 0

    db.commit()
    db.refresh(order)
    return order
