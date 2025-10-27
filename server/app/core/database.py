from sqlmodel import create_engine
from app.core.config import settings

# The engine is the core of SQLAlchemy's connectivity. It uses the DATABASE_URL
# from our settings to establish a pool of connections to the database.
# echo=True will log all SQL statements, which is very useful for debugging.
engine = create_engine(str(settings.DATABASE_URL), echo=True)