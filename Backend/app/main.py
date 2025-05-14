from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routers import leads

app = FastAPI(title="DuPont Tedlar Lead Generation System",
             description="AI-powered lead generation and management system for DuPont Tedlar Graphics & Signage team")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leads.router)

@app.get("/")
async def root():
    return {"message": "Welcome to DuPont Tedlar Lead Generation System"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 