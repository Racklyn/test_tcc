from entities.post_comment import Post, Comment
from entities.item import Item

samsung_comments_post_3: list[Comment] = [
  Comment(
    0,
    '''
       A Samsung, não gosta de ouvir verdadeiros sobre seus produtos, bloqueia os commentários principalmente as smart TVs QLED, que não têm durabilidade e apresentam problemas com menos de dois anos de uso.
    '''
  ),
  Comment(
    1,
    '''
       Quantas vezes no Cartao de credito do Banco do Brasil noa meus perfil de Whatsapp nao concorda se eu compra vai ser so para meu uzo vai depender de quantas vezes,voces dividir no cartao de credito Angela da cruz cavalcate ivalidez.
    '''
  ),
  Comment(
    2,
    '''
       Se ela concordar vou compra, quero saber o valor das prestacoes, para ver se ela libera os creditos.Ok Cruz Cavalcante Angela invalidez.Boa Noite pessoal do feicebuk anonimo vou comer, alguma coiza estou com muita fome!!!Cruz Cavalcante Angela Cruz invalidez...
    '''
  ),
  Comment(
    3,
    '''
       Pode ser?angeladacruzcavalcante1@ gmail.com
    '''
  ),
  Comment(
    4,
    '''
       Vou na loja da operadora claro,Joia, Rodrigo Claro Net claro. So se for do feicebuk anonimo OK?
    '''
  ),
  Comment(
    5,
    '''
       Minhas irmans sao minhas piores inimigas so tenho duas que eu confio.cruz cavalcante Angela cruz invalidez OK?
    '''
  ),
  Comment(
    6,
    '''
       Quando vai ter reposição do s24 ultra 1tb violeta?
    '''
  ),
  Comment(
    7,
    '''
       Oi, estou muito de decepcionada! @samsung foi só atualizar o S22 Ultra que dei para meu namorado que a rede móvel passou a oscilar muito, caindo ligações no meio, sem internet e constantemente sem sinal nenhum. Já trocamos o sim card mas o problema persiste. Vocês lançam uma atualização porém os problemas continuam? Como comprar um bem durável que é descartável e nada barato? Aguardo contato para resolução do problema extrajudicialmente. Sou uma cliente de vocês há mais de 20 anos.
    '''
  ),
  Comment(
    8,
    '''
       Corram pessoal.. Vejam o Reclame aqui... São péssimos no atendimento ao cliente.. Mentem e se vocês precisarem vão morrer esperando...
    '''
  ),
  Comment(
    9,
    '''
       So segunda feira dia 11 de novembro,vou falar com monha geremte!!! Cruz Cavalcante Angla Cruz invalidez
    '''
  ),
  Comment(
    10,
    '''
       #listrasverticais #SAMSUNGNUNCAMAIS
    '''
  )
]



samsung_posts: list[Post] = [
    Post(
        0,
        '',
        []
    ),
    Post(
        1,
        '''
            Aproveite agora os descontos da Live Shop Samsung Empresas com o cupom LIVEB2B: https://cutt.ly/ceHzb7R5
        ''',
        []
    ),
    Post(
        2,
        '''
            ‘Sobrecarregados, mas ainda assim coroados’
            Como parceira oficial do T1 League of Legends / T1 리그오브레전드 , saudamos os campeões mundiais consecutivos, ZOFGK!
            #T1WIN #T1Fighting #Odyssey #Samsung
        ''',
        []
    ),
    Post(
        3,
        '''
            A #SAM já sabe quando o dia vai ser incrível só de olhar para o Galaxy Watch7. 😍 
            Imagina acordar e saber exatamente o seu nível de energia, unir estilo e tecnologia na hora de montar o look e ainda monitorar suas atividades físicas e sua noite de sono? 
            Quem aí também quer um desses para chamar de seu? 🙌✨
        ''',
        samsung_comments_post_3
    ),
    Post(
        4,
        '''
            Nosso Esquenta Back Friday continua e hoje você pode aproveitar o melhor da semana! Vem que a Samsung Faz a Sua oferta em Tv, eletrodomésticos, o melhor da família Galaxy e muito mais! Não perca!
            🛒 Compre agora os produtos da Live Shop usando o cupom LIVEBF2024:  https://cutt.ly/HeGqSAE7
            📲 Baixe o App Samsung Shop e aproveite: https://cutt.ly/deGqSCpb
            🌟 Faça parte do Samsung Members:  https://cutt.ly/JeGqSFjG
            🗓️ Ofertas válidas até 10/11 - 23h59
        ''',
        []
    ),
    Post(
        5,
        '''
            Temos o prazer de anunciar que estamos lançando o Galaxy Watch7, um smartwatch com todas as funcionalidades para você! 😁
            Vem conferir nossas ofertas no site: https://cutt.ly/HeGqSAE7
        ''',
        []
    ),
    Post(
        6,
        '''
            Se liga nessa novidade para você fechar o ano da melhor maneira possível:
            A Smart Big TV 85" Cristal UHD 4K já está disponível para ser comprada no site e, o melhor de tudo, com 50% de desconto.
        ''',
        []
    )

]


samsung_items: list[Item] = [
    Item(
        id=0,
        name='Descontos da Live Shop Samsung Empresas',
        type='service',
        description='Anúncio de descontos durante a live',
        posts=[samsung_posts[1]]
    ),
    Item(
        id=1,
        name='Galaxy Watch7',
        type='product',
        description='smart watch',
        posts=[samsung_posts[3]]
    ),
]