from datetime import datetime
import json

def posts_data_to_string(posts, file_location):
    def datetime_converter(obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')  # Formato desejado
        raise TypeError(f'Type {type(obj)} not serializable')

    data_str = json.dumps(posts, default=datetime_converter, indent=2, ensure_ascii=False)

    with open(file_location, 'w') as arquivo:
        arquivo.write(data_str)

    return data_str