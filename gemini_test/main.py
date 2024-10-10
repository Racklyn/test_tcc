# import google.generativeai as genai
from langchain.prompts import ChatPromptTemplate
# from langchain.output_parsers import 
from langchain_google_genai import ChatGoogleGenerativeAI
import os

#genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.environ["GEMINI_API_KEY"])

prompt = ChatPromptTemplate(
    [
        (
            "system",
            '''
                Você é um asistente que receberá um texto de uma publicação de rede social de uma marca. Retorne o produto que está sendo anunciado.
                Caso não esteja explícito, tente inferir qual o tipo do produto anunciado. Retorne apenas o nome e/ou tipo do produto.
            '''
        ),
        ("user", "Texto da publicação: {text}")
    ]
)

chain = prompt | model

# resp = model.generate_content(prompt)

resp = chain.invoke({
    "text": "Com a tecnologia Water Resist aquela chuvinha chata não vai atrapalhar o seu corre. A Jaqueta Ultra tem um tecido especial que gera resistência à água, ou seja, você fica seco e protegido durante a corrida."
})

print(resp.content)