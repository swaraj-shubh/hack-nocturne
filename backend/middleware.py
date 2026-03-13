from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Define the specific origins that are allowed to connect.
# Do NOT include the wildcard "*" when allow_credentials is True.
origins = [
    "https://quantumchattingapp-frontend.onrender.com",
    "https://localhost:5173",  # Best practice to remove trailing slashes
    "http://localhost:5174"
]

def corsPolicy(app: FastAPI):
    """
    Configures the Cross-Origin Resource Sharing (CORS) middleware for the FastAPI app.
    This allows the frontend application to communicate with the backend API across different origins.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,        # A list of specific origins allowed
        allow_credentials=True,       # Allows cookies/authorization headers
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], # Be specific or use ["*"]
        allow_headers=["*"],          # Allows all headers
    )

# Example of how you would use this in your main app file:
#
# from main_app_file import corsPolicy
#
# app = FastAPI()
#
# # Apply the CORS policy
# corsPolicy(app)
#
# @app.get("/")
# def read_root():
#     return {"Hello": "World"}
