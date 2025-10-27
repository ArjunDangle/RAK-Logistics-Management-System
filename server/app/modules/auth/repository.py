from sqlmodel import Session, select
from app.models import User
from app.modules.auth.service import hash_password
from app.modules.auth.schemas import UserCreate # Import the new schema

def get_user_by_email(session: Session, email: str) -> User | None:
    """Fetches a single user from the database by their email."""
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

# --- REPLACE the old create_user function with this one ---
def create_user(session: Session, user_create: UserCreate) -> User:
    """Creates a new user in the database from a UserCreate schema."""
    hashed_pass = hash_password(user_create.password)
    
    db_user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=hashed_pass,
        role=user_create.role,
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user