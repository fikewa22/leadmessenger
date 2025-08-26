from fastapi import APIRouter

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/resend")
def resend_webhook():
    return {"message": "Resend webhook - coming soon"}

@router.post("/twilio")
def twilio_webhook():
    return {"message": "Twilio webhook - coming soon"}
