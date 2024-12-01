import os
from dotenv import load_dotenv
from envelope import Envelope

load_dotenv()

def send_mail(recipient, subject, body):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587)) 
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    sender_email = os.getenv("SENDER_EMAIL")

    Envelope().subject(subject).body(body).from_(sender_email).to(recipient).smtp(smtp_server, smtp_port, smtp_user, smtp_password, "starttls").send()
    Envelope.smtp_quit()