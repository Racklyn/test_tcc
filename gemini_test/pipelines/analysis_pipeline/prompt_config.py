from pydantic import BaseModel, Field

# STRUCTURED OUTPUTS

class InfoAboutPost(BaseModel):
    ''' Classe contendo informações sobre a publicação '''

    post_type: str = Field(description='Indica se a publicação trata especificamente sobre um produto, sobre um serviço ou outro. Terá um dos valores: "product", "service" ou "other"')
    summary: str = Field(description='Resumo com até 120 caracteres do conteúdo da publicação')

class CommentAnalysis(BaseModel):
    ''' Classe contendo informações da análise de um comentário '''

    comment_id: int = Field(description='Id do comentário analisado. Valor inteiro')
    related_to: str = Field(description='Indica a quê o comentário se refere, "postItem" (ao item da publicação), "postBrand" (à marca) ou “beyondPost” (não relacionado com o conteúdo da publicação nem com a marca')
    score: float = Field(description='Valor entre 0 e 1 que corresponde à análise de sentimento do comentário.')

class PostAnalysis(BaseModel):
    ''' Classe contendo a lista com as análises dos comentários '''

    analysis: list[CommentAnalysis] = Field(description='A lista com itens na qual cada item é um objeto com informações da análise de um comentário.')



# PROMPTS

class PromptConfig:
    COMMENT_SEPARATOR = '<comment-separator/>'


    GET_INFO_ABOUT_POST_SYSTEM = '''
        Você é responsável por extrair informações sobre publicações de marcas no Facebook.

        Você receberá:
        - o texto de uma publicação do Facebook da marca {brand};
        - uma curta descrição sobre a marca {brand}.

        Sua tarefa é retornar os campos "post_type" e "summary", de acordo com as seguintes regras:
        1. Para o campo "post_type", retorne apenas o valor:
            - "product", se a publicação estiver tratando sobre um único produto específico da marca;
            - "service", se a publicação estiver tratando sobre algum serviço prestado ou anunciado pela marca, como um evento ou promoção;
            - "other", caso não trate de um produto nem de um serviço específico, seja apenas uma publicação de engajamento com o público ou outro.
        
        2. Para o campo "summary", retorne um pequeno resumo do que a marca está anunciando ou divulgando com o texto da publicação. Não ultrapasse 120 caracteres no resumo.        
    '''

    GET_INFO_ABOUT_POST_HUMAN = '''
        **Texto da publicação**: {post_content}
        \n\n\n
        **Descrição sobre a marca {brand}**: {brand_about}
    '''


    GET_COMMENT_ANALYSIS_SYSTEM = '''
        Você é um assistente especializado em análise de sentimentos de comentários feitos em publicações de marcas no Facebook.

        Você receberá:
        - O texto da publicação.
        - Informações da marca (nome e descrição).
        - Informações sobre o item (nome e descrição) ao qual a publicação se refere.
        - Uma lista de comentários, separados pela tag {{COMMENT_SEPARATOR}}.

        Sua tarefa é analisar cada comentário **individualmente**, considerando o texto da publicação e as informações fornecidas.

        Para cada comentário, identifique:

        1. **score**: o sentimento do comentário.
        - Retorne "1" se for positivo.
        - Retorne "0.5" se for neutro ou ambíguo.
        - Retorne "0" se for negativo.

        2. **comment_id**: o ID do comentário (valor inteiro fornecido junto com o comentário).

        3. **related_to**: o contexto ao qual o comentário está relacionado:
        - Retorne "postItem" se o comentário for sobre o item mencionado ou a publicação em si, incluindo elogios ou críticas diretas.
        - Retorne "postBrand" se o comentário for sobre a marca, mas não sobre o item ou a publicação.
        - Retorne "beyondPost" se o comentário não tiver qualquer relação com a publicação, o item ou a marca.

        Sempre baseie a análise no conteúdo da publicação e nas informações contextuais. Em caso de dúvida sobre o sentimento, escolha `0.5`.
    '''

    
    GET_COMMENT_ANALYSIS_HUMAN = '''
        Texto da publicação: {post_content}

        Marca da publicação: {brand}

        Descrição da marca: {brand_about}

        Nome do item a que a publicação se refere: {related_item_name}

        Descrição do item a que a publicação se refere: {related_item_desc}

        Lista de comentários: \n\n\n\n\n{{COMMENT_SEPARATOR}} {comments} {{COMMENT_SEPARATOR}}
    '''
