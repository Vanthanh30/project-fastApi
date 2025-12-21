from fastapi import FastAPI
from app.db.base import get_db
from app.models import Base
from app.db.base import engine


app = FastAPI()

Base.metadata.create_all(bind=engine)



@app.get("/")
async def root():
    return {"message": "Hello World"}
