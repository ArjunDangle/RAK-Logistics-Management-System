from pydantic import BaseModel, EmailStr
from app.models import UserRole

# --- ADD THIS NEW SCHEMA ---
class UserCreate(BaseModel):
    """Defines the data required to create a new user."""
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
# -------------------------

class LoginRequest(BaseModel):
    """Defines the expected JSON for a login request."""
    email: EmailStr
    password: str

class Token(BaseModel):
    """Defines the shape of the token response after a successful login."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Defines the data we store inside the JWT payload."""
    email: str | None = None

class UserRead(BaseModel):
    """A safe schema for returning user data to the client (excludes password)."""
    id: int
    full_name: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True