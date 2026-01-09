from fastapi_mail import FastMail, MessageSchema
from app.core.email import conf

async def send_email(
    to: str,
    subject: str,
    body: str
):
    message = MessageSchema(
        subject=subject,
        recipients=[to],
        body=body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
