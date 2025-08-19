from entities.comment_analysis import CommentAnalysis
from database_conection import DatabaseConnection
from endpoints import COMMENT_ANALYSIS

db = DatabaseConnection()

class CommentAnalysisService:
    def create(commentAnalysis: CommentAnalysis):
        analysis = db.generic_insertion(COMMENT_ANALYSIS, commentAnalysis.to_dict()) #TODO: verificar isto
        return analysis
