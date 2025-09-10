from langchain_core.utils.function_calling import convert_to_openai_function
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from pydantic import BaseModel
from retry import retry
import os

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", api_key=os.environ["GEMINI_API_KEY"])

class Pipeline:
    @retry(delay=10, tries=10, backoff=2)
    def generic_pipeline(system_prompt: str, human_prompt: str, input_data: dict, structured_output: BaseModel = None) -> dict | str:
        """
        Generic pipeline to handle LLM tasks with system and human prompts.
        """

        prompt = ChatPromptTemplate(
            [
                ('system', system_prompt),
                ('human', human_prompt)
            ]
        )

        if structured_output:
            dict_schema = convert_to_openai_function(structured_output)
            structured_llm = llm.with_structured_output(dict_schema)
            chain = prompt | structured_llm
            resp = chain.invoke(input_data)[0]['args']
            return resp
        
        else:
            chain = prompt | llm
            return chain.invoke(input_data).content


        