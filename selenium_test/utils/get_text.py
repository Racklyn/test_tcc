from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By

# TODO: ajustar, por vezes o emoji não virá na posição correta
def get_text_with_emojis(element: WebElement) -> str:
    try:
        full_text = []

        for child in element.find_elements(By.XPATH, './/span//img | .//div[@dir="auto"]'):
            if child.tag_name == 'img' and child.get_attribute('alt'):
                full_text.append(child.get_attribute('alt'))
            elif child.text:
                full_text.append(child.text)

        return ''.join(full_text)
    except Exception as e:
        print(e)
        print("Falha ao extrair emojis. Retornando o texto normal.")
        return element.text