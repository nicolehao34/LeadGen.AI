from pydantic import BaseModel
from typing import List, Optional

class Company(BaseModel):
    name: str
    revenue_range: Optional[str]
    industry: str
    website: Optional[str]
    linkedin_url: Optional[str]

class Event(BaseModel):
    name: str
    date: str
    location: str
    description: str
    website: str

class DecisionMaker(BaseModel):
    name: str
    title: str
    linkedin_url: Optional[str]

class Lead(BaseModel):
    company: Company
    event: Event
    decision_makers: List[DecisionMaker]
    qualification_rationale: str
    outreach_message: Optional[str] 