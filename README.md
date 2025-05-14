# DuPont Tedlar Lead Generation System

An AI-powered lead generation and management system for DuPont Tedlar's Graphics & Signage team. This system automates the process of identifying, qualifying, and generating personalized outreach for potential leads.

## Features

- **Event Research**: Automatically identifies relevant industry events and trade shows
- **Company Sourcing**: Finds and prioritizes companies based on revenue and industry fit
- **Decision Maker Identification**: Locates key stakeholders at target companies
- **AI-Powered Qualification**: Generates qualification rationale using GPT-4
- **Personalized Outreach**: Creates tailored outreach messages for each lead
- **Interactive Dashboard**: Modern UI for managing and viewing leads

## Tech Stack

### Backend
- FastAPI (Python)
- OpenAI GPT-4
- BeautifulSoup4 for web scraping
- Pydantic for data validation

### Frontend
- React
- Material-UI
- Axios for API calls
- DataGrid for data display

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd dupont-tedlar-lead-generator
```

2. Set up the backend:
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the Backend directory:
```
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the frontend:
```bash
cd Frontend
npm install
```

5. Run the application:
```bash
# Terminal 1 (Backend)
cd Backend
uvicorn app.main:app --reload

# Terminal 2 (Frontend)
cd Frontend
npm start
```

## API Integration Points

The system is designed to integrate with:
- LinkedIn Sales Navigator API (for decision maker identification)
- Clay API (for company data enrichment)
- Event APIs (for event research)

## Project Structure

```
.
├── Backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── models/
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Usage

1. Access the dashboard at `http://localhost:3000`
2. Enter industry keywords to search for relevant events
3. Click "Generate Leads" to start the lead generation process
4. View and manage leads in the interactive dashboard
5. Export leads or generate personalized outreach messages

## Future Enhancements

- Integration with CRM systems
- Advanced analytics and reporting
- Automated follow-up scheduling
- Lead scoring and prioritization
- Custom outreach templates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
