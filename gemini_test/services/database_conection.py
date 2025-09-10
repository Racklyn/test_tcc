from zoneinfo import ZoneInfo
import requests

from datetime import datetime
import json
import services.endpoints as endpoints

class DatabaseConnection():
    def __init__(self):
        self.datatime = datetime
        self.default_tz = ZoneInfo('America/Sao_Paulo')
        self.base_url = endpoints.BASE_URL
        self.requests = requests

    def generic_update(self, route: str, data: dict) -> json:
        response = self.requests.patch(f'{self.base_url}/{route}', json=data)
        response.raise_for_status()
        return response.json()

    def generic_insertion(self, route: str, data: dict) -> json:
        response = self.requests.post(f'{self.base_url}/{route}', json=data)
        response.raise_for_status()
        return response.json()

    def generic_getter(self, route: str, params: dict={}) -> json:
        response = self.requests.get(f'{self.base_url}/{route}', params=params)
        response.raise_for_status()
        
        try:
            return response.json()
        except Exception as e:
            print(f'Erro ao converter resposta para JSON: {e}')
            raise  # Re-levanta a exceção para ser tratada no service