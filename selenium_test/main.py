from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from math import ceil
import locale
from datetime import datetime
from time import sleep


# TODO: verificar. Se a conta de acesso estiver em inglês, não precisará do seguinte
# Configurar a localidade para português (Brasil)
locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')



def login(driver: webdriver.Chrome, credencials: str = None):
    try:
        # Por enquanto, estou acessando sem estar logado
        driver.find_element(By.XPATH, '//div[@role="button"][@aria-label="Fechar"]').click()
    except:
        print('Falha ao logar')
        return False

    # TODO: implementar acesso logado

    return True


def get_posts_to_be_scrapped(driver: webdriver.Chrome, posts_after_date: datetime):
    last_height = driver.execute_script('return document.body.scrollHeight')

    while True: # TODO: verificar isso
        curr_post_cards = driver.find_elements(By.XPATH, '//div[@class="x1yztbdb x1n2onr6 xh8yej3 x1ja2u2z"]//div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x78zum5 x1n2onr6 xh8yej3"]')
        print(f'{len(curr_post_cards)} publicações encontradas')
        last_post_card = curr_post_cards[-1]

        # procurar pela data da publicação
        post_date_elem = last_post_card.find_element(By.XPATH, './/div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1q0g3np"]//a[@role="link"]')

        post_date_elem.send_keys(Keys.SHIFT);
        #driver.execute_script('arguments[0].focus();', post_date_elem) # TODO: verificar se é necessário

        sleep(0.5)

        tooltip_date_txt = driver.find_element(By.XPATH, '//div[@class="xu96u03 xm80bdy x10l6tqk x13vifvy"]').text
        print(tooltip_date_txt)

        post_date = datetime.strptime(tooltip_date_txt, '%A, %d de %B de %Y às %H:%M')

        # Verificar se data está fora do intervalo desejado
        if post_date < posts_after_date:
            return curr_post_cards[:-1]
        
        # 'Scrolla' para baixo até onde é possível
        driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        sleep(3) # TODO: verificar esse tempo. O ideal era usar um 'wait'

        new_height = driver.execute_script('return document.body.scrollHeight')

        if last_height == new_height:
            return curr_post_cards
        
        last_height = new_height


# Código temporário enquanto não logamos no Facebook
def get_posts_to_be_scrapped_temp(driver: webdriver.Chrome, n_posts = 2, posts_after_date: datetime = None):
    posts = []
    last_height = driver.execute_script('return document.body.scrollHeight')
    c = 0

    while c < n_posts:
        curr_post_cards = driver.find_elements(By.XPATH, '//div[@class="x1yztbdb x1n2onr6 xh8yej3 x1ja2u2z"]//div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x78zum5 x1n2onr6 xh8yej3"]')
        next_post_card = curr_post_cards[c] # por enquanto, sem estar logado, usaremos isso

        # procurar pela data da publicação
        post_date_elem = next_post_card.find_element(By.XPATH, './/div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1q0g3np"]//a[@role="link"]')
        post_date_elem.send_keys(Keys.SHIFT);

        sleep(0.5)

        tooltip_date_txt = driver.find_element(By.XPATH, '//div[@class="xu96u03 xm80bdy x10l6tqk x13vifvy"]').text
        print(tooltip_date_txt)

        post_date = datetime.strptime(tooltip_date_txt, '%A, %d de %B de %Y às %H:%M')

        # Verificar se data está fora do intervalo desejado
        if (not posts_after_date == None) and post_date < posts_after_date:
            return curr_post_cards[:-1]
        

        posts.append(next_post_card)
        c += 1
        
        if c < n_posts:
            # 'Scrolla' para baixo até onde é possível
            driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
            sleep(3)
            new_height = driver.execute_script('return document.body.scrollHeight')

            if last_height == new_height:
                return curr_post_cards
            
            last_height = new_height

    return posts


# TODO: implementar função de entrar numa publicação e extrair os comentários




def run(page: str):
    service = Service(ChromeDriverManager().install())
    options = Options()
    options.add_experimental_option("detach", True) # para manter o browser aberto após o processo
    options.add_argument('--window-size=1280x1696')
    options.add_argument('--disable-dev-tools')
    #options.add_argument('--headless=new') # para não abrir a interface gráfica do browser
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')

    driver = webdriver.Chrome(service=service, options=options)
    driver.get(f'https://www.facebook.com/{page}/?locale=pt_BR')
    driver.implicitly_wait(3) #por padrão, aguardará até 3s buscando por elementos

    sleep(1) # para simular atraso humano
    login_success = login(driver)

    if not login_success:
        return
    
    sleep(1)

    # post_cards = get_posts_to_be_scrapped(
    #     driver=driver,
    #     posts_after_date=datetime(day=8, month=11, year=2024)
    # )

    post_cards = get_posts_to_be_scrapped_temp(
        driver=driver,
        n_posts=2
    )

    print(len(post_cards))

    # TODO: iterar por cada post_cards, verificando a data. Se estiver no intervalo, entra




if __name__ == '__main__':
    PAGE = ['fila.br', 'nike', 'Olympikus', 'SamsungBrasil'][1]

    run(PAGE)