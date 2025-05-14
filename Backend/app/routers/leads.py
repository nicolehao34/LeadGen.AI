from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from ..services.lead_generator import LeadGenerator
from ..models.lead import Lead, Company, Event, DecisionMaker

router = APIRouter(prefix="/leads", tags=["leads"])
lead_generator = LeadGenerator()

class IndustryKeywordsRequest(BaseModel):
    industry_keywords: List[str]

@router.post("/generate", response_model=List[Lead])
async def generate_leads(request: IndustryKeywordsRequest):
    """
    Generate leads based on industry keywords
    """
    try:
        leads = await lead_generator.generate_leads(request.industry_keywords)
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/events", response_model=List[Event])
async def get_events(industry_keywords: List[str]):
    """
    Get relevant events based on industry keywords
    """
    try:
        events = await lead_generator.research_events(industry_keywords)
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/companies/{event_id}", response_model=List[Company])
async def get_companies(event_id: str):
    """
    Get companies attending a specific event
    """
    try:
        # In production, this would fetch from a database
        event = {"id": event_id}
        companies = await lead_generator.identify_companies(event)
        return companies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/decision-makers/{company_id}", response_model=List[DecisionMaker])
async def get_decision_makers(company_id: str):
    """
    Get decision makers for a specific company
    """
    try:
        # In production, this would fetch from a database
        company = {"id": company_id}
        decision_makers = await lead_generator.find_decision_makers(company)
        return decision_makers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 