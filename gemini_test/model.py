from langchain_google_genai import ChatGoogleGenerativeAI
#from langchain_google_vertexai import ChatVertexAI
import os

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.environ["GEMINI_API_KEY"])
#llm = ChatVertexAI(model="gemini-1.5-flash", api_key=os.environ["GEMINI_API_KEY"]) # precisa de credecial do Google Cloud
