from typing import TypedDict

class ItemAnalysisResult(TypedDict):
    analysis_summary: str
    positive_points: str
    negative_points: str
    analysis_date: str
    item_id: int