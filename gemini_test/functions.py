from langchain.prompts import ChatPromptTemplate
from langchain_core.utils.function_calling import convert_to_openai_function
from model import llm
from publications import publications
from typing import Optional
from pydantic import BaseModel, Field

def getPublicationContext(pubText: str, brand: str) -> str:
    prompt = ChatPromptTemplate(
        [
            (
                "system",
                '''
                    Você é um assistente que receberá um texto de uma publicação de rede social da marca {brand}.
                    A publicação pode ser relacionada a algum produto específico da marca ou não.
                    - Se for relacionada a um produto, faça o seguinte:
                    retorne o produto que está sendo anunciado;
                    caso não esteja explícito, tente inferir qual o tipo do produto anunciado;
                    retorne apenas o nome e/ou tipo do produto;
                    caso não seja possível realizar inferência, retorne o texto: "Produto da marca {brand}".

                    - Se NÃO for relacionada a um produto, faça o seguinte:
                    tente inferir o carater da publicação, se a empresa está anuncionando um serviço, uma promoção ou é uma publicação de engajamento com o público;
                    retorne apenas o carater da publicação.
                '''
            ),
            ("user", "Texto da publicação: {text}")
        ]
    )

    chain = prompt | llm

    resp = chain.invoke({
        "brand": brand,
        "text": pubText
    })

    return resp.content


def summarizePublication(pubText: str, brand: str) -> str:
    prompt = ChatPromptTemplate(
        [
            (
                "system",
                '''
                    Você é um assistente que receberá um texto de uma publicação de rede social da marca {brand}.
                    Retorne um pequeno resumo do que a marca está anunciando ou divulgando com o texto da publicação.
                    Se não puder identificar qual o produto está sendo anunciado, identifique-o apenas como "produto".
                    Não ultrapasse 120 caracteres no resumo.
                '''
            ),
            ("user", "Texto da publicação: {text}")
        ]
    )

    chain = prompt | llm

    resp = chain.invoke({
        "brand": brand,
        "text": pubText
    })

    return resp.content



def getAnalysis(pubText: str, comments: list[str]) -> str:
    prompt = ChatPromptTemplate(
        [
            (
                "system",
                '''
                    Você é um assistente responsável por fazer análise de sentimentos em comentários de publicações de marcas no Facebook.
                    Você receberá o texto de uma publicação e uma lista de comentários da publicação.
                    Analise detalhadamente cada comentário de maneira INDIVIDUAL e com base no texto da publicação.
                    Analise cada comentário e retorne 0 se for negativo, 0.5 se for neutro e 1 se for positivo.
                    Em caso de dúvida, retorne 0.5.
                    Retorne uma lista de inteiros chamada "analysis" com o resultado das análises.
                '''

                # ou se o comentário não tiver nenhuma relação com o texto da publicação.
            ),
            ("user",
                '''
                    Texto da publicação: {publication}
                
                    Lista de comentários: \n{comments}
                '''
            )
        ]
    )

    # output_parser = ...
    dict_schema = convert_to_openai_function(PublicationAnalysis)
    structured_llm = llm.with_structured_output(dict_schema)
    chain = prompt | structured_llm # | output_parser


    formatedComments = "\n\n**********************\n".join(comments)
    print(formatedComments)

    resp = chain.invoke({
        "publication": pubText,
        "comments": formatedComments
    })

    return resp


class PublicationAnalysis(BaseModel):
    """ Classe contendo a lista com a análise dos comentários """

    analysis: list[float] = Field(description="A lista na qual cada item corresponde à análise de um comentário.")
    





if __name__ == "__main__":
    pub = publications[0]

    #print(getPublicationContext(pub["text"], pub["brand"]))

    #print(summarizePublication(pub["text"], pub["brand"]))


    #print(getAnalysis(pub["text"], pub["comments"]))
    pubText = pub["text"]
    comments = pub["comments"]#[5:6]
    analysis = getAnalysis(pub["text"], comments)[0]['args']['analysis']
    for i, c in enumerate(comments):
        print(f"[{i}] - {c}\nAnálise: {analysis[i]}\n-------------")
