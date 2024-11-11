from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
#from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time

website = 'https://www.adamchoi.co.uk/teamgoals/detailed'

## Antes precisava baixar o Chromedriver:
#path = '/home/pessoal/Downloads/chromedriver-linux64/chromedriver'
#service = webdriver.ChromeService(executable_path=path)

## Agora ele pode ser instalado em tempo de execução:
service = Service(ChromeDriverManager().install())

options = Options()
options.add_experimental_option("detach", True) # para manter o browser aberto após o processo

driver = webdriver.Chrome(service=service, options=options)

driver.get(website)

all_matches_btn = driver.find_element(By.XPATH, '//label[@analytics-event="All matches"]')
all_matches_btn.click()


dropdown = Select(driver.find_element(By.ID, 'country'))
dropdown.select_by_visible_text('Brazil')

time.sleep(3)


matches = driver.find_elements(By.TAG_NAME, 'tr')

date = []
home_team = []
score = []
away_team = []

for match in matches:
    if (match.get_attribute('class').find('upcoming') != -1):
        print(f'Contém "upcoming". Texto: {match.text}')
        continue

    date.append(match.find_element(By.XPATH, './td[1]').text)
    home_team.append(match.find_element(By.XPATH, './td[2]').text)
    s = match.find_element(By.XPATH, './td[3]').text
    print(s)
    score.append(s)
    away_team.append(match.find_element(By.XPATH, './td[4]').text)

driver.quit()


df = pd.DataFrame({
    'date': date,
    'home_team': home_team,
    'score': score,
    'away_team': away_team
})

df.to_csv('footbal_data.csv', index=False)
print(df)