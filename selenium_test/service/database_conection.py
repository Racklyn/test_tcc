from io import BytesIO
from zoneinfo import ZoneInfo
import requests

from datetime import datetime
import json
from service import endpoints

#from logger import log

class DatabaseConnection():
    def __init__(self):
        self.datatime = datetime
        self.default_tz = ZoneInfo('America/Sao_Paulo')
        self.base_url = endpoints.BASE_URL
        self.requests = requests

    def generic_update(self, route: str, data: dict) -> requests.Response:
        response = self.requests.patch(f'{self.base_url}/{route}', json=data)
        if response.status_code != 200:
            print(f'Atualização falhou.\nDados: {str(data)}\nResponse: {str(response.json())}')
            # self.log.database_error(
            #     f'Atualização falhou.\nDados: {str(data)}\nResponse: {str(response.json())}')
        return response.status_code

    def generic_insertion(self, route: str, data: dict) -> json:
        response = self.requests.post(f'{self.base_url}/{route}', json=data)
        if response.status_code != 201:
            print(f'Inserção falhou!')
            # self.log.database_error(
            #     f'Inserção falhou.\Dados: {str(data)}\nResponse: {str(response.json())}')
        return response.json()

    def generic_getter(self, route: str, params: dict) -> json:
        response = self.requests.get(f'{self.base_url}/{route}', params=params)
        if response.status_code == 404:
            response = dict()
        else:
            # TODO: ajustar isso
            try:
                response = response.json()
            except Exception as e:
                print(f'Erro ao converter resposta para JSON: {e}')
                response = dict()
        return response