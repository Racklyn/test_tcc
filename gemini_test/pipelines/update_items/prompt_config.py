from pydantic import BaseModel, Field
from typing import Optional


# STRUCTURED OUTPUTS

class UpdatedItemInfos(BaseModel):
    ''' Classe contendo informações atualizadas de um item (produto ou serviço)  '''

    name: Optional[str] = Field(default=None, description='Nome atualizado do item. Se não for necessário atualizar, deixe vazio ou retorne null')
    description: str = Field(description='Descrição do item atualizada')

class SyncItemAnalysisResults(BaseModel):
    ''' Classe contendo resultados da análise de comentários do item '''

    summary: str = Field(description='Resumo da análise de comentários do item')
    positivePoints: str = Field(description='Pontos positivos da análise de comentários do item')
    negativePoints: str = Field(description='Pontos negativos da análise de comentários do item')


# PROMPTS

class PromptConfig:
    SYNC_ITEM_INFOS_SYSTEM = \
    f'''
        Você é um assistente especializado em atualização de informações de itens (produtos ou serviços) de uma marca no Facebook.

        Você receberá:
        - Informações da marca (nome e descrição)
        - Informações atuais do item (nome, tipo e descrição)
        - Lista de textos das publicações da marca sobre o item

        Sua tarefa é analisar as informações fornecidas e atualizar o item conforme necessário:

        1. VERIFICAÇÃO DO NOME (campo "name"):
           - Analise se o nome atual do item ainda é adequado com base em todos os posts fornecidos
           - Se o nome atual não especifica bem o item e existe um nome que o descreva melhor nos posts, retorne esse novo nome
           - Caso contrário, deixe o campo vazio ou retorne null

        2. ATUALIZAÇÃO DA DESCRIÇÃO (campo "description"):
           - Com base na descrição anterior e nos textos de todos os posts fornecidos, crie uma nova descrição do item
           - A nova descrição deve ser mais completa e precisa, incorporando informações relevantes dos posts
           - Defina uma descrição para o item que seja sucinta e que contenha os pontos chaves do que o item representa.
    '''

    SYNC_ITEM_INFOS_HUMAN = \
    f'''
        INFORMAÇÕES DA MARCA:
        Nome: {{brand_name}}
        Sobre: {{brand_about}}

        INFORMAÇÕES ATUAIS DO ITEM:
        Nome: {{item_name}}
        Tipo: {{item_type_PT}}
        Descrição: {{item_description}}

        POSTS SOBRE O ITEM:
        {{posts_content}}
    '''


    SYNC_ANALYSIS_RESULTS_SYSTEM = \
    f'''
        Você é um assistente especializado em análisar a repercussão de comentários sobre produtos e serviços de uma marca no Facebook.

        Você receberá:
        - Informações do item (nome e descrição)
        - Uma lista de comentários NEGATIVOS, uma de comentários NEUTROS e uma de comentários POSITIVOS sobre o item

        Sua tarefa é analisar todos os comentários fornecidos e gerar um resumo estruturado sobre as opiniões do público e a repercussão que o item está causando:

        1. ANÁLISE GERAL (campo "summary"):
           - Crie um curto resumo geral das opiniões sobre o item
           - Considere o sentimento predominante (positivo, negativo ou neutro)
           - Mencione se há consenso ou divergência nas opiniões
           - Exemplo: "Em geral, o produto é bem visto pelo público, mas recebe algumas críticas sobre durabilidade"

        2. PONTOS POSITIVOS (campo "positivePoints"):
           - Analise os comentários positivos e identifique as características mais citadas como vantajosas
           - Extraia os aspectos mais elogiados pelos usuários
           - Exemplo: "Preço baixo, conforto, design moderno, facilidade de uso"

        3. PONTOS NEGATIVOS (campo "negativePoints"):
           - Analise os comentários negativos e identifique os problemas mais mencionados
           - Extraia as principais reclamações e pontos de melhoria
           - Exemplo: "Durabilidade baixa, poucas opções de cor, atendimento lento"

        IMPORTANTE:
        - Seja objetivo e baseie-se apenas nos comentários fornecidos
        - Use linguagem clara e direta
        - Evite repetições desnecessárias
        - Se não houver comentários de um tipo específico, indique isso claramente
    '''

    SYNC_ANALYSIS_RESULTS_HUMAN = \
    f'''
        INFORMAÇÕES DO ITEM:
        Nome: {{item_name}}
        Descrição: {{item_description}}


        ###COMENTÁRIOS NEGATIVOS:
        {{negative_comments}}


        ###COMENTÁRIOS NEUTROS:
        {{neutral_comments}}


        ###COMENTÁRIOS POSITIVOS:
        {{positive_comments}}
    '''