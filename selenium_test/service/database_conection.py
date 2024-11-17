from io import BytesIO
from zoneinfo import ZoneInfo
import requests

from datetime import datetime, timedelta
import json
import endpoints

from logger import log

class DatabaseConnection():
    def __init__(self):
        self.datatime = datetime
        self.default_tz = ZoneInfo('America/Sao_Paulo')
        self.base_url = endpoints.BASE_URL #TODO: verificar isso!
        self.requests = requests

    def generic_update(self, route: str, data: dict) -> requests.Response:
        response = self.requests.patch(route, json=data)
        if response.status_code != 200:
            self.log.database_error(
                f'Atualização falhou.\nDados: {str(data)}\nResponse: {str(response.json())}')
        return response.status_code

    def generic_insertion(self, route: str, data: dict) -> json:
        response = self.requests.post(route, json=data)
        if response.status_code != 201:
            self.log.database_error(
                f'Inserção falhou.\Dados: {str(data)}\nResponse: {str(response.json())}')
        return response.json()

    def generic_getter(self, route: str) -> json:
        response = self.requests.get(route)
        if response.status_code == 404:
            response = dict()
        else:
            response = response.json()
        return response