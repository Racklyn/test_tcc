from datetime import datetime

def date_default_str(d: datetime):
    return d.strftime('%Y-%m-%dT%H:%M:%S.%fZ')