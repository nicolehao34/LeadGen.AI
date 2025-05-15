# Iteration 1

├── Backend/
│ ├── app/
│ │ ├── pycache/
│ │ ├── models/
│ │ ├── routers/
│ │ │ └── pycache/
│ │ ├── leads.py
│ │ └── services/
│ │ └── main.py
│ ├── .env
│ └── requirements.txt
├── Documentation/
│ └── Readme.md
├── Frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ └── Dashboard.js
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ └── package-lock.json
├── venv/
├── .gitignore
├── documentation.md
├── README.md
└── requirements.txt


Backend/app/
Core FastAPI application containing models, API routes, and services.

- pycache/: Python’s cache of compiled bytecode to speed up execution.

- models/: Defines data schemas and request/response models using Pydantic.

- routers/: Stores modular route definitions (e.g. /leads) to keep code clean and scalable.

- services/: Contains business logic or utility functions separate from route logic.

- main.py: Entry point of the FastAPI app where the server and routers are initialized.

Frontend/
Top-level folder for all frontend (React.js) source code.

- node_modules/: Contains all installed JavaScript dependencies (auto-generated).

- public/: Static files served directly, like the base HTML file.

    - index.html: The base HTML template React injects into.

    - manifest.json: Metadata for the web app, often used for PWA features.

- src/: All custom frontend source code lives here.

    - components/: React UI components, such as dashboards or lead cards.

        - Dashboard.js: React component responsible for rendering the lead dashboard.

    - App.js: Root React component; usually sets up routing and layout.

    - index.js: Main entry point for the React app that renders <App /> into the DOM.

- package.json: Declares project metadata and dependencies for the frontend.
- package-lock.json: Auto-generated file locking specific versions of dependencies for consistency.


Notes: The very first attempt. I design this just to get the repo structure set up first, as well as testing running the API locally. Then I moved on to designing the user + AI agent workflow. 

# Iteration 2

Now with the completed workflows, I added...


