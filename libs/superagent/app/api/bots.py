import logging

from fastapi import APIRouter, Depends, HTTPException, status
from decouple import config

from app.utils.admin import check_access_token, get_admin
from prisma.models import ApiUser
from app.utils.prisma import prisma

admin_api_key = config("ADMIN_API_KEY",None)

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post(
    "/bots/{email_id}/api_key",
    name="invoke",
    description="Invoke a specific workflow",
)
async def get_user_api_key(
    email_id: str,
    api_user=Depends(get_admin),
):
    api_user = await prisma.apiuser.find_unique(
        where={"email": email_id}
    )
    if api_user:
        {"success": True, "data" : api_user}
    return True

@router.post(
    "/bots/{access_token}/verify",
    name="Verify user",
    description="Verify and get user's api key",
)
async def get_user_api_key(
    email_id: str,
    matrix_user=Depends(check_access_token),
):
    pid_data = matrix_user["threepids"]
    api_user = False
    if len(email_id) > 0:
        email_id = pid_data[0]["address"]
        api_user = await prisma.apiuser.find_unique(
            where={"email": email_id}
        )
    if api_user:
        {"success": True, "data" : api_user}
    raise HTTPException(status_code=401, detail="error")



