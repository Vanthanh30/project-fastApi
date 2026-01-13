from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.cart import Cart


def get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        cart = Cart(user_id=user_id, total_cart=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart


def calculate_cart_total(cart_id: int, db: Session) -> float:
    total = db.query(
        func.sum(CartItem.quantity * Product.price)
    ).join(Product, CartItem.product_id == Product.id
    ).filter(CartItem.cart_id == cart_id
    ).scalar()

    total = float(total) if total else 0.0

    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if cart:
        cart.total_cart = total
        db.commit()

    return total
