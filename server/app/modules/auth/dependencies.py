from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session

from app.core.config import settings
from app.core.database import engine # Use engine to create a session
from app.models import User
from app.modules.auth import service, repository, schemas

# This tells FastAPI where the client should go to get a token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_session():
    """Dependency to get a database session."""
    with Session(engine) as session:
        yield session

def get_current_active_user(
    token: str = Depends(oauth2_scheme), 
    session: Session = Depends(get_session)
) -> User:
    """
    A dependency that validates the JWT in the Authorization header
    and returns the corresponding user from the database.
    If the token is invalid or the user doesn't exist, it raises a 401 error.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[service.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = repository.get_user_by_email(session, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user