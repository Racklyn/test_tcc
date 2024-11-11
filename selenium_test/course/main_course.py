from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from math import ceil
import time

PAGE = ['fila.br', 'nike', 'Olympikus', 'SamsungBrasil'][2]

service = Service(ChromeDriverManager().install())
options = Options()
options.add_experimental_option("detach", True) # para manter o browser aberto após o processo
driver = webdriver.Chrome(service=service, options=options)
driver.get(f'https://www.facebook.com/{PAGE}/?locale=pt_BR')
driver.implicitly_wait(3) #por padrão, aguardará até 3s buscando por elementos

time.sleep(1) # para simular atraso humano
driver.find_element(By.XPATH, '//div[@role="button"][@aria-label="Fechar"]').click()

# TODO: para pegar as publicações mais abaixo, será necessário colocasr um wait enquanto o scroll carrega...
#time.sleep(1) # para simular atraso humano

#seria melhor clicar no "link" da data da publicação, que já abre ela completa (mas no caso de transmissões ao vivo e de reels, abre uma página diferente)
# TODO:Implementar para clicar no número de comentários da publicação, ao invés do link "ver todos os comentários"
# Barra da publicação com qtd de comentários. Dentro procuraremos pela 2ª div e pelo 1° botão
post_details_div = driver.find_element(By.XPATH, '//div[@class="x6s0dn4 xi81zsa x78zum5 x6prxxf x13a6bvl xvq8zen xdj266r xat24cr x1d52u69 xktsk01 x889kno x1a8lsjc xkhd6sd x4uap5 x80vd3b x1q0q8m5 xso031l"]')
com_btn = post_details_div.find_element(By.XPATH, './/div[2]').find_element(By.XPATH, './/div[@role="button"][1]')
# see_more_container = driver.find_element(By.XPATH, '//div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x78zum5 x1iyjqo2 x21xpn4 x1n2onr6"]')

# see_more_btn = see_more_container.find_element(By.XPATH, './/div[@role="button"]')

#driver.execute_script("window.scrollBy(0, 600);")
time.sleep(1) # para simular atraso humano
driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", com_btn)
#driver.execute_script("window.scrollBy(0, -200);")

n_comments = int(com_btn.text)
print(f'{n_comments} comentário(s)\n')

time.sleep(1)  # para simular atraso humano
com_btn.click()


# vai esperar até o dialog estar visível ou até completar 10s
WebDriverWait(driver, 5).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//div[@role="dialog"]')
    )
)


# TODO: pegar texto principal da publicação (se houver), data publicação, num de comentários

time.sleep(2) # TODO: substituir por um Wait até o conteúdo do dialog aparecer
dialog = driver.find_element(By.XPATH, '//div[@role="dialog"]')
# dialog_header = dialog.find_element(By.XPATH, './/div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1jx94hy xh8yej3"]')

# print(dialog_header.text)


# PEGAR TEXTO DA PUBLICAÇÃO
### verificar se publicação possui texto
post_text_container = None
try:
    post_text_container = dialog.find_element(By.XPATH, './/div[@class="x1l90r2v x1pi30zi x1swvt13 x1iorvi4"]') #data-ad-preview="message" OU data-ad-comet-preview="message"
except:
    print('* Publicação não possui texto *')
else:
    ### verificar se possui "Ver mais" no final do texto para expandi-lo
    if post_text_container.text.endswith("Ver mais"):
        # clicando no botão "ver mais" para expandir o texto
        try:
            see_more_btn = post_text_container.find_element(By.XPATH, './/div[@role="button"]')
            # TODO: verificar se o seguinte código é necessário
            driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", see_more_btn)
            time.sleep(0.5)
            see_more_btn.click()

            time.sleep(0.5)
            post_text_container = dialog.find_element(By.XPATH, './/div[@class="x1l90r2v x1pi30zi x1swvt13 x1iorvi4"]') #data-ad-preview="message" OU data-ad-comet-preview="message"
        except:
            print("Falha ao expandir o texto da publicação")

    print(post_text_container.text)


time.sleep(1)



# PEGANDO OS COMENTÁRIOS:
# TODO: implementar verificação de n_comments > 0


# clicando no botão de selecioar quais comentários estarão visíveis
comments_order_div = dialog.find_element(By.XPATH, './/div[@class="x6s0dn4 x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xe0p6wg"]')
driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", comments_order_div)
time.sleep(1)
comments_order_div.click()


#Obs.: o popup de seleção não fica dentro do dialog, mas numa div especial

time.sleep(1)
# Alterando para opção "Todos os comentários"
driver.find_element(By.XPATH, '//div[@aria-label="Ordem dos comentários"]').find_element(By.XPATH, './/div[@role="menuitem"][3]').click()



#dialog = driver.find_element(By.XPATH, '//div[@role="dialog"]')

# comment_1 = WebDriverWait(driver, 5).until(
#     lambda d: dialog.find_element(By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]')
# )
# EC.visibility_of_element_located(
#     (By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]')
# )

time.sleep(5) # TODO: mudar para esperar até o carregamento

# como o dialog foi recarregado (após alterar a ordem), é necessário criar uma nova referência para ele
dialog = driver.find_element(By.XPATH, '//div[@role="dialog"]')

comments = []

# TODO podemos pegar de acordo com a qtd de comentários
max_rep = ceil(n_comments/10) # repetições máximas para previnir loop infinito
dialog_scroll = dialog.find_element(By.XPATH, './/div[@class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck xx8ngbg xwo3gff x1n2onr6 x1oyok0e x1odjw0f x1iyjqo2 xy5w88m"]')
last_scroll_height = dialog_scroll.get_attribute('scrollHeight')

print(f'Repetições esperadas: {max_rep}')

while max_rep > 0:
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", dialog_scroll)
    time.sleep(5) # TODO: verificar esse tempo. O melhor é esperar pelos itens aparecerem

    print('-', end='')

    new_height = dialog_scroll.get_attribute('scrollHeight')
    if (new_height == last_scroll_height):
        print('\n')
        break

    last_scroll_height = new_height
    max_rep -= 1



#some_comments = dialog.find_elements(By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]')
comments_container = dialog.find_elements(By.XPATH, './/div[@class="x1r8uery x1iyjqo2 x6ikm8r x10wlt62 x1pi30zi"]')
print(f'Containers: {len(comments_container)}')

# print('PRIMEIRO:')
# print(comments_container[0].text)
# print('\n')

# print('ÚLTIMO:')
# print(comments_container[-1].text)
# print('\n'*5)


for i, container in enumerate(comments_container):
    print(i)

    try:
        # TODO: podemos adicionar alguma forma de verificar se o comentário possui texto ao invés de lançar a exceção
        comm_text = container.find_element(By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]').text
        # por enquanto, pegando apenas o texto reduzido da data. A data completa fica num tooltip
        comm_date = container.find_element(By.XPATH, './/a[@role="link"]').text
    except:
        print(container.text)
        continue

    comments.append({
        "text": comm_text,
        "date": comm_date
    })

#time.sleep(1)


print(comments)
print(f'{len(comments)} comentários extraídos.')