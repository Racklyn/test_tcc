from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By

# TODO: ajustar, por vezes o emoji não virá na posição correta
def get_text_with_emojis(element: WebElement) -> str:
    try:
        def get_text(advanced_text_extration = False) -> tuple[str, bool]:
            has_chars = False
            full_text = []
            advanced_text_xpath = ' | .//div[@class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"]' # to get markdown texts
            xpath = './/span//img | .//div[@dir="auto"]' + (advanced_text_xpath if advanced_text_extration else '')

            for child in element.find_elements(By.XPATH, xpath):
                if child.tag_name == 'img' and child.get_attribute('alt'):
                    full_text.append(child.get_attribute('alt'))
                elif child.text:
                    full_text.append(child.text)
                    has_chars = True

            return (''.join(full_text), has_chars)

        [result, has_chars] = get_text()
        if not has_chars:
            result = get_text(True)[0]
            print('ADVANCED TEXT EXTRATION!')

        return result
    except Exception as e:
        print(e)
        print("Falha ao extrair emojis. Retornando o texto normal.")
        return element.text