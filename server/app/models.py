import enum
from typing import Optional
from sqlmodel import Field, SQLModel

class UserRole(str, enum.Enum):
    """
    Defines the possible roles a user can have. Using an Enum ensures
    data integrity in the 'role' column of our database.
    """
    LOGISTICS = "logistics"
    SUPPORT = "support"

class User(SQLModel, table=True):
    """
    Represents the 'user' table in the database.
    SQLModel makes this class act as both a database model and a Pydantic model.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: UserRole