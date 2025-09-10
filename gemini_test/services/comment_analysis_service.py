from entities.comment_analysis import CommentAnalysis
from services.database_conection import DatabaseConnection
from services.endpoints import COMMENT_ANALYSIS

db = DatabaseConnection()

class CommentAnalysisService:
    def create(commentAnalysis: CommentAnalysis) -> CommentAnalysis:
        try:
            analysis = db.generic_insertion(COMMENT_ANALYSIS, commentAnalysis)
        except Exception as e:
            print(f'Erro ao criar análise de comentário: {e}')
            return None
        
        return analysis
