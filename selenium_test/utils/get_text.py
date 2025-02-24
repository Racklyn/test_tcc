from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By

# TODO: ajustar, por vezes o emoji não virá na posição correta
# TODO: verificar se está funcionando corretamente:
def get_text_with_emojis(element: WebElement) -> str:
    try:
        def get_text(advanced_text_extration = False) -> str:
            full_text = []
            advanced_text_xpath = ' | .//div[@class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"]' # to get markdown texts
            xpath = './/span//img | .//div[@dir="auto"]' + (advanced_text_xpath if advanced_text_extration else '')

            for child in element.find_elements(By.XPATH, xpath):
                if child.tag_name == 'img' and child.get_attribute('alt'):
                    full_text.append(child.get_attribute('alt'))
                elif child.text:
                    full_text.append(child.text)

            return ''.join(full_text)

        result = get_text()
        if not result:
            result = get_text(True)
            print('ADVANCED TEXT EXTRATION!') # TODO: remove this

        return result
    except Exception as e:
        print(e)
        print("Falha ao extrair emojis. Retornando o texto normal.")
        return element.text