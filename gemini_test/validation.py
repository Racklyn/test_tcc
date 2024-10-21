from functions import getAnalysis
import pandas as pd
import asyncio
import math

def run_analysis():
    comments = pd.read_csv('test_data/comments.csv')
    postsInfo = pd.read_csv('test_data/posts.csv')

    posts = []

    for postInfo in postsInfo.iloc():
        posts.append({
            'brand': postInfo['BRAND'],
            'text': postInfo['TEXT'],
            'comments': comments[comments['POST_ID'] == postInfo['ID']]['CONTENT'].to_list()
        })

    all_analysis = []
    batch_size = 10
    for i, p in enumerate(posts):
            comm = p['comments']
            
            comm_analysis = []

            for _ in range(math.ceil(len(comm)/batch_size)):
                batch = comm[:batch_size]
                comm = comm[batch_size:]
                values = getAnalysis(p['text'], batch)
                comm_analysis.extend(values)
                print(f'\n\nPublicação ID: {i+1}; Analisados: {len(values)}\n\n')

            comm_analysis = comm_analysis + [-1]*(len(p['comments'])-len(comm_analysis))
            all_analysis.extend(comm_analysis)

    print(all_analysis)
    comments['ANALYSIS'] = all_analysis
    comments.to_csv('test_data/analysis_result.csv')


# n = 2

# a = getAnalysis(posts[n]['text'], posts[n]['comments'])
# print(len(posts[n]['comments']))
# print(len(a))

def get_statistics():
    comments_with_analysis = pd.read_csv('test_data/analysis_result.csv')
    #label_analysis = comments_with_analysis[['CONTENT', 'LABEL', 'ANALYSIS']]
    
    matrix_columns = {
        'negativo': [0, 0, 0],
        'neutro': [0, 0, 0],
        'positivo': [0, 0, 0]
    }
    matrix = pd.DataFrame(matrix_columns, index=['negativo', 'neutro', 'positivo'])
    values = {
        0: 'negativo',
        0.5: 'neutro',
        1: 'positivo'
    }


    poorly_evaluated = pd.DataFrame(columns=comments_with_analysis.columns)

    correct = 0  # Percentual de acerto
    total = len(comments_with_analysis) #len(label_analysis)
    deviation = 0

    for i, row in comments_with_analysis.iterrows():
        lab = row['LABEL']
        ana = row['ANALYSIS']
        if (lab == ana):
            correct += 1
        else:
            dif = ana - lab
            deviation += dif
            if abs(dif) == 1:
                poorly_evaluated = pd.concat([poorly_evaluated, row.to_frame().T])
        matrix.loc[values[lab],values[ana]] += 1

    percentage = (correct/total)*100
    print(f'\nTotal de itens analisados: {total}')
    print(f'Percentual de acertos: {percentage}%')
    print(f'Desvio: {deviation}')

    print('\nLinhas: valor real - label (o que é)')
    print('Colunas: resultado da análise (o que a predição disse)')
    print(matrix)
    print('\n\n Avaliações mais erradas:')
    print(poorly_evaluated[['CONTENT', 'LABEL', 'ANALYSIS']])


if __name__ == "__main__":
    # run_analysis()

    get_statistics()