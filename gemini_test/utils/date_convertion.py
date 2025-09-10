from datetime import datetime

def date_to_str_iso_format(date: datetime) -> str:
    # Formato ISO 8601 com milissegundos (3 dígitos), exemplo: 2025-05-24T22:29:53.587Z
    return date.strftime('%Y-%m-%dT%H:%M:%S') + f'.{date.microsecond // 1000:03d}Z'