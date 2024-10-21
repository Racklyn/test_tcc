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
    # print(comments)

    prompt = ChatPromptTemplate(
        [
            (
                "system",
                '''
                    Você é um assistente responsável por fazer análise de sentimentos em comentários de publicações de marcas no Facebook.
                    Você receberá o texto de uma publicação e uma lista de comentários da publicação.
                    Analise detalhadamente cada comentário de maneira INDIVIDUAL e com base no texto da publicação.
                    Os comentários estão separados pela tag <comment-separator/>
                    Analise cada comentário e retorne 0 se for negativo, 0.5 se for neutro e 1 se for positivo.
                    Em caso de dúvida, retorne 0.5.
                '''

                    #Além de retornar a lista com o resultado das análises, você irá retornar também a lista com os comentários que foram providos.
                    # Retorne uma lista de floats chamada "analysis" com o resultado das análises.
                # ou se o comentário não tiver nenhuma relação com o texto da publicação ou com a marca...
            ),
            ("user",
                '''
                    Texto da publicação: {publication}

                    Tamanho da lista de análise a ser retornada: {anylisis_size}

                    Lista de comentários: \n\n\n\n\n<comment-separator/> {comments} <comment-separator/>

                '''
            )
        ]
    )

    # output_parser = ...
    dict_schema = convert_to_openai_function(PublicationAnalysis) # TODO: Verify if this is a good approach
    structured_llm = llm.with_structured_output(dict_schema)
    chain = prompt | structured_llm # | output_parser


    # TODO: Verify is this separator is ok
    formatedComments = "\n\n\n\n<comment-separator/>\n\n\n\n".join(comments)
    #print(formatedComments)

    resp = chain.invoke({
        "publication": pubText,
        "anylisis_size": len(comments),
        "comments": formatedComments
    })

    print(resp)

    if (len(resp) > 0):
        return resp[0]['args']['analysis'] #TODO: Verify this. Should return only 'resp'?
    else:
        return []


class PublicationAnalysis(BaseModel):
    """ Classe contendo a lista com a análise dos comentários """

    analysis: list[float] = Field(description="A lista com {anylisis_size} itens na qual cada item é um float que corresponde à análise de um comentário.")
    #comments: list[str] = Field(description='A lista de comentários que foi enviada para análise')
    





if __name__ == "__main__":
    pub = publications[0]

    #print(getPublicationContext(pub["text"], pub["brand"]))

    #print(summarizePublication(pub["text"], pub["brand"]))


    #print(getAnalysis(pub["text"], pub["comments"]))
    pubText = pub["text"]
    comments = pub["comments"]#[5:6]
    analysis = getAnalysis(pub["text"], comments)#[0]['args']['analysis']
    for i, c in enumerate(comments):
        print(f"[{i}] - {c}\nAnálise: {analysis[i]}\n-------------")

    # prompt = ChatPromptTemplate([
    #     ('user', 'Meu nome é Racklyn')
    # ])
    # chain = prompt | llm
    # r = chain.invoke({})
    # print(r)