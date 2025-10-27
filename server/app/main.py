from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the routers from our auth module
from app.modules.auth.router import auth_router, users_router

app = FastAPI(
    title="Logistics Management System API",
    prefix="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "ok"}

# Include the new routers in the application
app.include_router(auth_router)
app.include_router(users_router)