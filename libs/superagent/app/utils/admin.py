import logging
import uuid

import jwt
from decouple import config
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.utils.prisma import prisma

logger = logging.getLogger(__name__)
security = HTTPBearer()


def handle_exception(e):
    logger.exception(e)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
    )


def generate_jwt(data: dict):
    # for randomness
    data.update({"jti": str(uuid.uuid4())})

    token = jwt.encode({**data}, config("JWT_SECRET"), algorithm="HS256")
    return token


def decode_jwt(token: str):
    return jwt.decode(token, config("JWT_SECRET"), algorithms=["HS256"])


async def get_admin(
    authorization: HTTPAuthorizationCredentials = Security(security),
):
    token = authorization.credentials
    ADMIN_API_KEY = config("ADMIN_API_KEY",None)

    api_user = True if token == ADMIN_API_KEY else False
    if not api_user:
        raise HTTPException(status_code=401, detail="Invalid token or expired token")
    return api_user
