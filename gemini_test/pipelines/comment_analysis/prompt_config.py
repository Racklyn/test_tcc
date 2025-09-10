from pydantic import BaseModel, Field

COMMENT_SEPARATOR = '<comment-separator/>'
ITEM_SEPARATOR = '<item-separator/>'
ITEM_TAG_START = '<item>'
ITEM_TAG_END = '</item>'

# STRUCTURED OUTPUTS

class InfoAboutPost(BaseModel):
    ''' Classe contendo informações sobre a publicação '''

    post_type: str = Field(description='Indica se a publicação trata especificamente sobre um produto, sobre um serviço ou outro. Terá um dos valores: "product", "service" ou "other"')
    summary: str = Field(description='Resumo com até 120 caracteres do conteúdo da publicação')

class CommentAnalysisResponse(BaseModel):
    ''' Classe contendo informações da análise de um comentário '''

    comment_idx: int = Field(description='Índice do comentário analisado. Valor inteiro')
    related_to: str = Field(description='Indica a quê o comentário se refere, "postItem" (ao item da publicação), "postBrand" (à marca) ou “beyondPost” (não relacionado com o conteúdo da publicação nem com a marca')
    score: float = Field(description='Valor entre 0 e 1 que corresponde à análise de sentimento do comentário.')

class PostAnalysis(BaseModel):
    ''' Classe contendo a lista com as análises dos comentários '''

    analysis: list[CommentAnalysisResponse] = Field(description='A lista com itens na qual cada item é um objeto com informações da análise de um comentário.')

class NewItemDefinition(BaseModel):
    ''' Classe contendo um novo item (produto ou serviço) a ser criado '''

    name: str = Field(description='Nome do novo item')
    description: str = Field(description='Descrição do novo item')


# PROMPTS

class PromptConfig:

    GET_INFO_ABOUT_POST_SYSTEM = \
    f'''
        Você é responsável por extrair informações sobre publicações de marcas no Facebook.

        Você receberá:
        - o texto de uma publicação do Facebook da marca {{brand}};
        - uma curta descrição sobre a marca {{brand}}.

        Sua tarefa é retornar os campos "post_type" e "summary", de acordo com as seguintes regras:
        1. Para o campo "post_type", retorne apenas o valor:
            - "product", se a publicação estiver tratando sobre um PRODUTO específico da marca;
            - "service", se a publicação estiver tratando sobre:
                * Eventos, promoções, suporte ao cliente;
                * Serviços digitais ou de software oferecidos pela marca;
                * Funcionalidades, recursos ou capacidades genéricas, que não pertençam a um único produto em específico;
            - "other", caso não trate de um produto nem de um serviço específico, seja apenas uma publicação de engajamento com o público ou outro.
        
        2. Para o campo "summary", retorne um pequeno resumo do que a marca está anunciando ou divulgando com o texto da publicação. Não ultrapasse 120 caracteres no resumo.        
    '''

    GET_INFO_ABOUT_POST_HUMAN = \
    f'''
        **Texto da publicação**: {{post_content}}
        \n\n\n
        **Descrição sobre a marca {{brand}}**: {{brand_about}}
    '''



    GET_RELATED_ITEM_SYSTEM = \
    f'''
        Você é um assistente especializado em análise de conteúdo de redes sociais para marcas.

        SUA TAREFA:
        Analisar uma publicação do Facebook e identificar qual item (produto ou serviço) da marca está sendo mencionado ou referenciado.

        CONTEXTO:
        - Marca: {{brand}}
        - Sobre a marca: {{brand_about}}
        - Tipo de item procurado: {{item_type}}

        INSTRUÇÕES:
        1. Analise o conteúdo da publicação fornecida
        2. Compare com os itens disponíveis na lista
        3. Identifique qual item corresponde EXATAMENTE ao conteúdo da publicação
        4. Considere sinônimos, variações linguísticas e contexto da marca

        CRITÉRIOS DE MATCH:
        - O item deve estar relacionado ao conteúdo da publicação
        - Pode ser mencionado explicitamente ou implicitamente (pode aparecer com um nome parcialmente diferente)
        - Deve fazer sentido no contexto da marca e do tipo de item

        RESPOSTA:
        - Se encontrar um item correspondente: retorne o número do ID
        - Se não encontrar correspondência: retorne "None"
        - Envolva a resposta em tags {ITEM_TAG_START} e {ITEM_TAG_END}
        - Não inclua explicações ou texto adicional

        EXEMPLO DE RESPOSTA:
        {ITEM_TAG_START}42{ITEM_TAG_END}
        ou
        {ITEM_TAG_START}None{ITEM_TAG_END}
    '''

    GET_RELATED_ITEM_HUMAN = \
    f'''
        PUBLICAÇÃO PARA ANÁLISE:
        {{post_content}}

        ITENS DISPONÍVEIS:
        {{items_posts}}

        Analise e retorne o ID do item correspondente ou "None".
    '''


    
    DEFINE_NEW_ITEM_SYSTEM = \
    f'''
        Você é um assistente especializado em definição de nomes e descrições para novos itens (produtos ou serviços) de uma marca.

        VOCÊ RECEBERÁ:
        O texto de uma publicação do Facebook da marca {{brand}};

        SUA TAREFA:
        Definir um nome e uma descrição para um novo {{item_type}} da marca {{brand}} identificado em uma publicação do Facebook.

        INSTRUÇÕES:
        1. Se a publicação citar um nome específico para o novo item, use-o. Caso contrário, defina um nome intuitivo.
        2. Defina uma descrição para o novo item que seja sucinta e que contenha os pontos chaves do que o item representa.

        CONTEXTO:
        - Marca: {{brand}}
        - Sobre a marca: {{brand_about}}
        - Tipo de item procurado: {{item_type}}

        RESPOSTA:
        - Retorne os campos "name" e "description".
    '''

    DEFINE_NEW_ITEM_HUMAN = \
    f'''
        PUBLICAÇÃO PARA ANÁLISE:
        {{post_content}}
    '''



    GET_COMMENT_ANALYSIS_SYSTEM = \
    f'''
        Você é um assistente especializado em análise de sentimentos de comentários feitos em publicações de marcas no Facebook.

        Você receberá:
        - O texto da publicação.
        - Informações da marca (nome e descrição).
        - Informações sobre o item (nome e descrição) ao qual a publicação se refere.
        - Uma lista de comentários, separados pela tag {COMMENT_SEPARATOR}.

        Sua tarefa é analisar cada comentário **individualmente**, considerando o texto da publicação e as informações fornecidas.

        Para cada comentário, identifique:

        1. **score**: o sentimento do comentário.
        - Retorne "1" se for positivo.
        - Retorne "0.5" se for neutro ou ambíguo.
        - Retorne "0" se for negativo.

        2. **comment_idx**: o índice do comentário (valor inteiro fornecido junto com o comentário).

        3. **related_to**: o contexto ao qual o comentário está relacionado:
        - Retorne "postItem" se o comentário for sobre o item mencionado ou a publicação em si, incluindo elogios ou críticas diretas.
        - Retorne "postBrand" se o comentário for sobre a marca, mas não sobre o item ou a publicação.
        - Retorne "beyondPost" se o comentário não tiver qualquer relação com a publicação, o item ou a marca.

        Sempre baseie a análise no conteúdo da publicação e nas informações contextuais. Em caso de dúvida sobre o sentimento, escolha `0.5`.
    '''

    
    GET_COMMENT_ANALYSIS_HUMAN = \
    f'''
        Texto da publicação: {{post_content}}

        Marca da publicação: {{brand}}

        Descrição da marca: {{brand_about}}

        Nome do item a que a publicação se refere: {{related_item_name}}

        Descrição do item a que a publicação se refere: {{related_item_desc}}

        Lista de comentários: \n\n\n\n\n{COMMENT_SEPARATOR} {{comments}} {COMMENT_SEPARATOR}
    '''
