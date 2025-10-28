# server/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.auth.router import auth_router, users_router

app = FastAPI(title="Logistics Management System API")

# --- Double-check this list ---
origins = [
    "http://localhost:8080", # Your Vite dev server
    "http://127.0.0.1:8080",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Make sure this uses the list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "ok"}

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")