from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.models import User
from . import service, repository, schemas, dependencies

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
users_router = APIRouter(prefix="/users", tags=["Users"])

# --- ADD THE NEW ENDPOINT TO THE `users_router` ---
@users_router.post(
    "/", 
    response_model=schemas.UserRead, 
    status_code=status.HTTP_201_CREATED
)
def create_new_user(
    user_create: schemas.UserCreate,
    session: Session = Depends(dependencies.get_session),
):
    """
    Creates a new user.
    """
    db_user = repository.get_user_by_email(session, email=user_create.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    return repository.create_user(session=session, user_create=user_create)
# -------------------------------------------------

@auth_router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(dependencies.get_session),
):
    """
    Authenticates a user and returns a JWT access token.
    """
    user = repository.get_user_by_email(session, email=form_data.username)
    if not user or not service.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = service.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@users_router.get("/me", response_model=schemas.UserRead)
def read_users_me(
    current_user: User = Depends(dependencies.get_current_active_user)
):
    """
    Fetches the data for the currently authenticated user.
    """
    return current_user