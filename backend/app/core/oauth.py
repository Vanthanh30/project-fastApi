from authlib.integrations.starlette_client import OAuth
from app.core.config import settings

oauth = OAuth()

oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,

    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",

    client_kwargs={
        "scope": "openid email profile"
    },

    authorize_params={
        "response_type": "code"
    }
)

oauth.register(
    name="facebook",
    client_id=settings.FACEBOOK_CLIENT_ID,
    client_secret=settings.FACEBOOK_CLIENT_SECRET,
    access_token_url="https://graph.facebook.com/v18.0/oauth/access_token",
    authorize_url="https://www.facebook.com/v18.0/dialog/oauth",
    api_base_url="https://graph.facebook.com/",
    client_kwargs={
        "scope": "public_profile"
    }
)
