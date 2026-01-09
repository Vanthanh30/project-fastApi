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
# ===== THÊM FUNCTION MỚI BÊN DƯỚI =====

async def send_reset_password_email(
    to_email: str,
    user_name: str,
    reset_link: str
):
    """
    Gửi email đặt lại mật khẩu
    
    Args:
        to_email: Email người nhận
        user_name: Tên người dùng
        reset_link: Link đặt lại mật khẩu
    """
    subject = "Đặt Lại Mật Khẩu - LUMIÈRE"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                padding: 40px 30px;
                text-align: center;
            }}
            .logo {{
                font-size: 2rem;
                font-weight: 700;
                color: white;
                letter-spacing: 0.05em;
                margin-bottom: 10px;
            }}
            .star {{
                font-size: 2.5rem;
                display: inline-block;
                margin-right: 5px;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .greeting {{
                font-size: 1.2rem;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 20px;
            }}
            .message {{
                color: #666;
                margin-bottom: 30px;
                font-size: 15px;
            }}
            .button {{
                display: inline-block;
                padding: 16px 40px;
                background: #dc2626;
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
            }}
            .note {{
                margin-top: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 14px;
                color: #666;
            }}
            .footer {{
                padding: 30px;
                text-align: center;
                background: #f8f9fa;
                color: #999;
                font-size: 13px;
                border-top: 1px solid #e0e0e0;
            }}
            .divider {{
                height: 1px;
                background: #e0e0e0;
                margin: 30px 0;
            }}
            .link {{
                color: #dc2626;
                word-break: break-all;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <span class="star">★</span>
                    <span>LUMIÈRE</span>
                </div>
            </div>
            
            <div class="content">
                <div class="greeting">Xin chào {user_name},</div>
                
                <div class="message">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
                    Nhấn vào nút bên dưới để tạo mật khẩu mới:
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" class="button">Đặt Lại Mật Khẩu</a>
                </div>
                
                <div class="note">
                    <strong>⚠️ Lưu ý quan trọng:</strong><br>
                    • Link này chỉ có hiệu lực trong <strong>1 giờ</strong><br>
                    • Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này<br>
                    • Không chia sẻ link này với bất kỳ ai
                </div>
                
                <div class="divider"></div>
                
                <div style="color: #999; font-size: 13px;">
                    Nếu nút không hoạt động, copy và paste link sau vào trình duyệt:<br>
                    <a href="{reset_link}" class="link">{reset_link}</a>
                </div>
            </div>
            
            <div class="footer">
                <div style="margin-bottom: 10px;">© 2024 LUMIÈRE. All rights reserved.</div>
                <div>Email này được gửi tự động, vui lòng không trả lời.</div>
            </div>
        </div>
    </body>
    </html>
    """
    
    await send_email(to_email, subject, html_body)