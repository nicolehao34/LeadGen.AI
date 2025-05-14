from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # to handle Cross-Origin Resource Sharing (CORS), allowing your API to be accessed from different domains.
import uvicorn # to run the FastAPI application
from .routers import leads

app = FastAPI(title="DuPont Tedlar Lead Generation System",
             description="AI-powered lead generation and management system for DuPont Tedlar Graphics & Signage team")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin. In production, replace with specific origins
    allow_credentials=True, # Allow cookies, Authorization headers
    allow_methods=["*"], # Allow all HTTP methods: GET, POST, etc.
    allow_headers=["*"], # Allow all headers (e.g., Content-Type, Auth)
)

# Include routers
app.include_router(leads.router) # imports and attaches a set of API routes from another module

@app.get("/") # defines an API endpoint at the root URL (http://localhost:8000/).
async def root():
    return {"message": "Welcome to DuPont Tedlar Lead Generation System"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 