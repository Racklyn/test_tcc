from entities.item_analysis_result import ItemAnalysisResult
from services.database_conection import DatabaseConnection
from services.endpoints import ITEM_ANALYSIS_RESULT

db = DatabaseConnection()

class ItemAnalysisResultService:
    def create(itemAnalysisResult: ItemAnalysisResult) -> ItemAnalysisResult:
        try:
            result = db.generic_insertion(ITEM_ANALYSIS_RESULT, itemAnalysisResult)
        except Exception as e:
            print(f'Erro ao criar resultado da análise de item: {e}')
            return None
        
        return result
