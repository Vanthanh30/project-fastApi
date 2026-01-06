from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product import Product
from app.schemas.cart import *
from app.middleware.authenticate import authenticate
from app.utils.cart import get_or_create_cart, calculate_cart_total

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), user=Depends(authenticate)):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        return CartResponse(total_cart=0.0, items=[])

    items = []
    for item in cart.items:
        items.append(
            CartItemResponse(
                id=item.id, 
                product_id=item.product.id,
                name=item.product.name,
                price=float(item.product.price),
                quantity=item.quantity,
                total=float(item.product.price) * item.quantity
            )
        )

    return CartResponse(
        total_cart=float(cart.total_cart),
        items=items
    )

@router.post("/add")
def add_to_cart(
    data: AddToCartRequest,
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    if data.quantity < 1:
        raise HTTPException(400, "Quantity must be >= 1")

    product = db.query(Product).get(data.product_id)
    if not product:
        raise HTTPException(404, "Product not found")

    cart = get_or_create_cart(db, user.id)

    item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product.id
    ).first()

    if item:
        item.quantity += data.quantity
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=data.quantity
        )
        db.add(item)

    db.commit()

    total = calculate_cart_total(cart.id, db)  

    return {
        "message": "Added to cart successfully",
        "total_cart": total
    }


@router.put("/item/{item_id}")
def update_cart_item(
    item_id: int,
    data: UpdateCartItemRequest,
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    if data.quantity < 1:
        raise HTTPException(400, "Quantity must be >= 1")

    item = db.query(CartItem).get(item_id)
    if not item:
        raise HTTPException(404, "Cart item not found")

    item.quantity = data.quantity
    db.commit()  

    total = calculate_cart_total(item.cart_id, db)

    return {
        "message": "Updated quantity successfully",
        "total_cart": total
    }


@router.delete("/item/{item_id}")
def delete_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    user=Depends(authenticate)
):
    item = db.query(CartItem).get(item_id)
    if not item:
        raise HTTPException(404, "Cart item not found")

    cart_id = item.cart_id
    db.delete(item)
    db.commit()  # commit item vừa xóa

    total = calculate_cart_total(cart_id, db)

    return {
        "message": "Deleted item from cart",
        "total_cart": total
    }