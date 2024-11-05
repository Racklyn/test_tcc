from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

service = Service(ChromeDriverManager().install())
options = Options()
options.add_experimental_option("detach", True) # para manter o browser aberto após o processo
driver = webdriver.Chrome(service=service, options=options)
driver.get('https://www.facebook.com/Olympikus/?locale=pt_BR')
driver.implicitly_wait(3) #por padrão, aguardará até 3s buscando por elementos

time.sleep(1) # para simular atraso humano
driver.find_element(By.XPATH, '//div[@role="button"][@aria-label="Fechar"]').click()

# TODO: para pegar as publicações mais abaixo, será necessário colocasr um wait enquanto o scroll carrega...
time.sleep(1) # para simular atraso humano
see_more_container = driver.find_element(By.XPATH, '//div[@class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x78zum5 x1iyjqo2 x21xpn4 x1n2onr6"]')
#see_more_container.click()

see_more_btn = see_more_container.find_element(By.XPATH, './/div[@role="button"]')

#driver.execute_script("window.scrollBy(0, 600);")
driver.execute_script("arguments[0].scrollIntoView({ block: 'center' });", see_more_btn)
time.sleep(1)  # para simular atraso humano
#driver.execute_script("window.scrollBy(0, -200);")

see_more_btn.click()


# vai esperar até o dialog estar visível ou até completar 10s
dialog = WebDriverWait(driver, 5).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//div[@role="dialog"]')
    )
)

time.sleep(1)

# TODO: pegar texto principal da publicação (se houver)


# Esperar até o btn "mais relevantes" estar visível
 #TODO: Verificar. O comando abaixo está considerando o contexto da página completa, não apenas do dialog
WebDriverWait(driver, 5).until(
    EC.visibility_of_element_located(
        (By.XPATH, './/div[@class="x6s0dn4 x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xe0p6wg"]')
    )
).click()


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
c = 6 # repetições máximas para previnir loop infinito
dialog_scroll = dialog.find_element(By.XPATH, './/div[@class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck xx8ngbg xwo3gff x1n2onr6 x1oyok0e x1odjw0f x1iyjqo2 xy5w88m"]')
last_scroll_height = dialog_scroll.get_attribute('scrollHeight')

driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", dialog_scroll)
while c > 0:
    time.sleep(2) # TODO: verificar esse tempo
    print('-', end='')

    new_height = dialog_scroll.get_attribute('scrollHeight')
    if (new_height == last_scroll_height):
        break

    last_scroll_height = new_height
    c -= 1
    
print('\n')



#some_comments = dialog.find_elements(By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]')
comments_container = dialog.find_elements(By.XPATH, './/div[@class="x1r8uery x1iyjqo2 x6ikm8r x10wlt62 x1pi30zi"]')
print(f'Containers: {len(comments_container)}')
for container in comments_container:
    comm_text = container.find_element(By.XPATH, './/div[@class="x1lliihq xjkvuk6 x1iorvi4"]').text
    # por enquanto, pegando apenas o texto reduzido da data. A data completa fica num tooltip
    comm_date = container.find_element(By.XPATH, './/a[@role="link"]').text

    comments.append({
        "text": comm_text,
        "date": comm_date
    })

time.sleep(1)


print(comments)
print(len(comments))