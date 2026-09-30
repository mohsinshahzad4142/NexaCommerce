import re
import os
import secrets
import pyotp
from typing import List, Tuple
from fastapi import UploadFile, HTTPException, status
from passlib.context import CryptContext

# 1. BCRYPT PASSWORD HASHING
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PasswordHasher:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

# 2. XSS & INPUT SANITIZATION SHIELD
class XSSProtection:
    @staticmethod
    def sanitize_input(text: str) -> str:
        if not text:
            return ""
        # Remove malicious script tags and dangerous HTML attributes
        clean_text = re.sub(r'<script[^>]*?>.*?</script>', '', text, flags=re.IGNORECASE)
        clean_text = re.sub(r'on\w+="[^"]*"', '', clean_text, flags=re.IGNORECASE)
        clean_text = clean_text.replace('<', '&lt;').replace('>', '&gt;')
        return clean_text.strip()

# 3. SECURE FILE UPLOADER & MIME VALIDATOR
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
MAX_FILE_SIZE_MB = 10

class SecureFileUpload:
    @staticmethod
    def validate_and_save(file: UploadFile, upload_dir: str = "uploads") -> str:
        # Check Extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file extension '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Sanitize Filename (Prevent Path Traversal Attack)
        random_hex = secrets.token_hex(8)
        safe_filename = f"{random_hex}{ext}"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, safe_filename)

        # Check Size & Write File
        content = file.file.read()
        if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB."
            )

        with open(file_path, "wb") as f:
            f.write(content)

        return f"/static/uploads/{safe_filename}"

# 4. TWO-FACTOR AUTHENTICATION ENGINE (TOTP)
class TwoFactorAuth:
    @staticmethod
    def generate_secret() -> str:
        return pyotp.random_base32()

    @staticmethod
    def get_provisioning_url(email: str, secret: str, store_name: str = "NexaCommerce") -> str:
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=email, issuer_name=store_name)

    @staticmethod
    def verify_totp(secret: str, code: str) -> bool:
        totp = pyotp.TOTP(secret)
        return totp.verify(code)

    @staticmethod
    def generate_backup_codes(count: int = 8) -> List[str]:
        return [secrets.token_hex(4).upper() for _ in range(count)]