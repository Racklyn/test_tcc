from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from math import ceil
import locale
from datetime import datetime
from time import sleep
from utils.posts_data_to_string import posts_data_to_string
from utils.get_text import get_text_with_emojis
from service.database_conection import DatabaseConnection
from service import endpoints
from entities.post_comment import Comment, Post, CreatePostDto
from common import elements_path as elem_path


db = DatabaseConnection()


def get_post_card_date(driver: webdriver.Remote, post_card: WebElement) -> datetime:
    try:
        post_date_elem = post_card.find_element(By.XPATH, elem_path.POST_DATE_ELEMENT)
        post_date_elem.send_keys(Keys.SHIFT);

        sleep(1) #sleep(0.5) #TODO: verificar esse tempo

        tooltip_date_txt = driver.find_element(By.XPATH, elem_path.TOOLTIP_DATE_TEXT).text
        print(tooltip_date_txt)

        return datetime.strptime(tooltip_date_txt, '%A, %d de %B de %Y às %H:%M')
    except Exception as e:
        print('Falha ao extrair data da publicação')
        print(e)
        return None


def get_comment_date(driver: webdriver.Remote, comment_elem: WebElement) -> datetime:
    try:
        comm_date_elem = comment_elem.find_element(By.TAG_NAME, 'li').find_element(By.TAG_NAME, 'a')
        comm_date_elem.send_keys(Keys.SHIFT)

        sleep(1) #sleep(0.5) #TODO: verificar esse tempo. O ideal seria que fosse adaptável

        tooltip_date_txt = driver.find_element(By.XPATH, elem_path.TOOLTIP_DATE_TEXT).text
        print(f'--> Date: {tooltip_date_txt}')

        return datetime.strptime(tooltip_date_txt, '%A, %d de %B de %Y às %H:%M')
    except Exception as e:
        print('Falha ao extrair data do comentário')
        print(e)
        return None


def login(driver: webdriver.Remote, credencials: str = None):
    try:
        # Por enquanto, estou acessando sem estar logado
        driver.find_element(By.XPATH, elem_path.CLOSE_DIALOG_BTN).click()
        sleep(1)
        not_logged_in_footer = driver.find_element(By.XPATH, elem_path.NOT_LOGGED_IN_FOTTER)
        driver.execute_script('arguments[0].setAttribute("style", "visibility: hidden")', not_logged_in_footer)
        sleep(0.5)
    except Exception as e:
        print('Falha ao logar')
        print(e)
        return False

    # TODO: implementar acesso logado

    return True


def get_posts_to_be_scrapped(driver: webdriver.Remote, posts_since_date: datetime):
    last_height = driver.execute_script('return document.body.scrollHeight')

    while True: # TODO: verificar isso
        curr_post_cards = driver.find_elements(By.XPATH, elem_path.CURRENT_POST_CARD)
        print(f'{len(curr_post_cards)} publicações encontradas')
        last_post_card = curr_post_cards[-1]

        post_date = get_post_card_date(driver, last_post_card)

        # Verificar se data está fora do intervalo desejado
        if post_date < posts_since_date:
            return curr_post_cards[:-1]
        
        # 'Scrolla' para baixo até onde é possível
        driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        sleep(3) #TODO: verificar se é possível diminuir esse tempo

        new_height = driver.execute_script('return document.body.scrollHeight')

        if last_height == new_height:
            return curr_post_cards
        
        last_height = new_height


# Código temporário enquanto não logamos no Facebook
def get_posts_to_be_scrapped_temp(driver: webdriver.Remote, n_posts = 2, posts_since_date: datetime = None) -> list[WebElement]:
    posts = []
    last_height = driver.execute_script('return document.body.scrollHeight')
    c = 0
    max_reps = n_posts
    MAX_SCROLL_RETRIES = 3
    scroll_retries = 0

    while c < max_reps:
        curr_post_cards = driver.find_elements(By.XPATH, elem_path.CURRENT_POST_CARD)

        if len(curr_post_cards) >= n_posts:
            posts = curr_post_cards[:n_posts]
            break
        
        driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        sleep(3) #TODO: verificar se é possível diminuir esse tempo
        new_height = driver.execute_script('return document.body.scrollHeight;')

        if last_height == new_height:
            print('Scroll bar chegou no limite inferior.')
            scroll_retries += 1
            if scroll_retries > MAX_SCROLL_RETRIES:
                posts = curr_post_cards
                break
            print('Retrying scroll')
        else:
            scroll_retries = 0
            c += 1
        
        last_height = new_height


    posts_to_be_scrapped = []

    # filtrando por data
    for post_card in posts:
        print('#'*15)
        post_date = get_post_card_date(driver, post_card)

        if post_date == None:
            print('Não foi possível extrair a data da publicação. Seguindo para a próxima...')
            continue

        if posts_since_date and post_date < posts_since_date: # Verifica se data está fora do intervalo desejado
            break
        

        posts_to_be_scrapped.append(post_card)
        sleep(1)
        
    return posts_to_be_scrapped


def get_posts_data(driver: webdriver.Remote, post_cards: list[WebElement], posts_since_date: datetime) -> list[CreatePostDto]:
    posts: list[CreatePostDto] = []
    for i, post_card in enumerate(post_cards):
        try:
            post_date = get_post_card_date(driver, post_card)

            # Verificar se data está fora do intervalo desejado
            if (not posts_since_date == None) and post_date < posts_since_date:
                print('Publicação com data anterior ao período desejado.\nFinalizando processos nessa página...')
                break
            
            # Verificar se publicação é uma live ainda em andamento
            post_title = post_card.find_element(By.XPATH, elem_path.POST_CARD_TITLE).text
            if post_title.endswith('está ao vivo agora.'):
                continue
            
            # Expandir e pegar texto da publicação, se ele existir:
            post_text = ''
            try:
                post_text_elem = post_card.find_element(By.XPATH, elem_path.POST_TEXT_ELEMENT)
            except Exception as e:
                print(e) #TODO: remover
                print('* Publicação não possui texto *')
            else:
                ### verificar se possui "Ver mais" no final do texto para expandi-lo
                if post_text_elem.text.endswith("Ver mais"):
                    # clicando no botão "ver mais" para expandir o texto
                    try:
                        see_more_btn = post_text_elem.find_element(By.XPATH, './/div[@role="button"]')
                        driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", see_more_btn)
                        sleep(0.5)
                        see_more_btn.click()

                        sleep(0.5)
                        post_text_elem = post_card.find_element(By.XPATH, elem_path.POST_TEXT_ELEMENT)
                    except:
                        print("Falha ao expandir o texto da publicação. Pegando o texto que está visível.")

                post_text = get_text_with_emojis(post_text_elem) # post_text_elem.text
                print(post_text) # TODO: remover


            post_comments = get_post_comments(driver, post_card)

            posts.append({
                'content': post_text,
                'post_date': str(post_date),
                'comments': post_comments,
                'page_id': 1 # TODO: mudar para pegar id dinamicamente
            })

        except Exception as e:
            print(e)
            print(f'Falha ao coletar informações da publicação: {i}')

        print('-'*50)
        sleep(2)

    return posts


def get_post_comments(driver: webdriver.Remote, post_card: WebElement) -> list[Comment]:
    post_right_details_elem = post_card.find_element(By.XPATH, elem_path.POST_CARD_RIGHT_DETAILS_ELEMENT)
    MAX_SCROLL_RETRIES = 1

    try:
        comm_btn_elem = post_right_details_elem.find_element(By.XPATH, './/div[@role="button"]')
    except:
        print('Publicação não possui comentários')
        return []

    comm_btn_txt = comm_btn_elem.text
    max_scroll_reps = 0
    
    if comm_btn_txt.endswith('mil'):
        n = float(comm_btn_txt.split()[0].replace(',', '.'))
        max_scroll_reps = ceil((n + 0.1) * 100)
    else:
        try:
            max_scroll_reps = ceil(int(comm_btn_txt)/10)
        except Exception as e:
            print(e)

    driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", comm_btn_elem)
    sleep(0.5)
    comm_btn_elem.click()


    # Verificando se dialog é de comentários ou de compartilhamentos
    sleep(3)
    dialog_elem = driver.find_element(By.XPATH, elem_path.MAIN_DIALOG)
    dialog_title = dialog_elem.find_element(By.TAG_NAME, 'h2').text

    if dialog_title == 'Pessoas que compartilharam isso':
        driver.find_element(By.XPATH, elem_path.CLOSE_DIALOG_BTN).click()
        return []


    # Alterando para opção "Todos os comentários"
    comments_order_elem = dialog_elem.find_element(By.XPATH, elem_path.COMMENTS_ORDER_ELEMENT)
    driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", comments_order_elem)
    sleep(0.5)
    comments_order_elem.click()
    sleep(0.5)
    driver.find_element(By.XPATH, elem_path.COMMENTS_ORDER_MENU).find_element(By.XPATH, './/div[@role="menuitem"][3]').click()

    sleep(3)

    # pegando dialog atualizado após recarregar
    dialog_elem = driver.find_element(By.XPATH, elem_path.MAIN_DIALOG)

    # scroll pela lista de comentários
    dialog_scroll_elem = dialog_elem.find_element(By.XPATH, elem_path.DIALOG_SCROLL_ELEMENT)
    last_scroll_height = dialog_scroll_elem.get_attribute('scrollHeight')
    scroll_retries = 0

    while max_scroll_reps > 0:
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", dialog_scroll_elem)
        sleep(5)  #TODO: verificar se é possível diminuir esse tempo

        print(f'Scroll pelos comentários: vez {max_scroll_reps}')

        new_height = dialog_scroll_elem.get_attribute('scrollHeight')

        if new_height == last_scroll_height:
            scroll_retries += 1
            if scroll_retries > MAX_SCROLL_RETRIES:
                break
            print('Retrying scroll')
        else:
            scroll_retries = 0
            max_scroll_reps -= 1

        last_scroll_height = new_height

    sleep(5) #TODO: verificar se esse tempo é necessário aqui

    comment_elems = dialog_elem.find_elements(By.XPATH, elem_path.COMMENT_ELEMENTS)
    print(f'Elementos de comentário: {len(comment_elems)}')
    comments: list[Comment] = []

    for i, comment_elem in enumerate(comment_elems):
        print(f'Extraindo comentário {i}')

        driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", comment_elem)
        try:
            comm_text = get_text_with_emojis(comment_elem.find_element(By.XPATH, elem_path.COMMENT_TEXT_ELEMENT))
            comm_date = get_comment_date(driver, comment_elem)
        except NoSuchElementException as e:
            print('Comentário não possui texto. Ignorando...')
            continue
        except Exception as e:
            print(e)
            continue

        if comm_date:
            comments.append({
                'text': comm_text,
                'date': str(comm_date)
            })
        else:
            print('Não foi possível pegar a data do comentário. Pulando para o próximo...')
            print(f'O texto do comentário era:   {comm_text}')

    # fechando dialog
    driver.find_element(By.XPATH, elem_path.CLOSE_DIALOG_BTN).click()

    return comments



def save_posts(posts: list[Post]):
    for p in posts:
        res = db.generic_insertion('post/createOrUpdate', p)
        print(res)



def run(page: str):
    # Variáveis de configuração:
    posts_since_date = datetime(day=1, month=11, year=2010)
    n_posts = 2

    # TODO: verificar. Se a conta de acesso estiver em inglês, não precisará do seguinte
    locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')


    service = Service(ChromeDriverManager().install())
    options = Options()
    #options.add_experimental_option("detach", True) # para manter o browser aberto após o processo 
    options.add_argument('--disable-dev-tools')
    options.add_argument('--headless=new') # para não abrir a interface gráfica do browser
    options.add_argument('window-size=1600,1000')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=service, options=options)
    driver.get(f'https://www.facebook.com/{page}/?locale=pt_BR')
    driver.implicitly_wait(3) #por padrão, aguardará até 3s buscando por elementos

    sleep(0.5)
    login_success = login(driver)

    if not login_success:
        return
    
    sleep(1)

    # post_cards = get_posts_to_be_scrapped(driver=driver,posts_since_date=posts_since_date)
    post_cards = get_posts_to_be_scrapped_temp(
        driver,
        n_posts,
        #posts_since_date
    )

    print(f'Serão extraídos dados de {len(post_cards)} posts')
    print('-'*10)

    try:
        posts = get_posts_data(driver, post_cards, posts_since_date)
        #print(posts)
    except Exception as e:
        print(e)
        print('Falha ao coletar informações das publicações nesta página.')
    else:
        posts_data_to_string(posts, 'posts.txt')
        print(f'\nExtração de {len(posts)} publicações concluída com sucesso!')

        save_posts(posts)

    driver.close()


def run_all_pages(pages):
    pass


if __name__ == '__main__':
    PAGE = ['fila.br', 'nike', 'Olympikus', 'SamsungBrasil', 'Lula', 'MotoBRA', 'magazineluiza'][6]
    run(PAGE)

    brand_id = 2 # Motorola id = 1

    # db_connection = DatabaseConnection()
    # db_connection.generic_getter(endpoints.PAGE, )

    # run_all_pages()