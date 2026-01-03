#!/usr/bin/env python3
"""
市区町村コードを6桁から5桁に変換するスクリプト
"""
import json
from pathlib import Path


def convert_citycode_townwork():
    """citycode_townwork.jsonを6桁から5桁に変換"""
    file_path = Path(__file__).parent.parent / 'src' / \
        'data' / 'citycode_townwork.json'

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 各エントリのcitycodeを5桁に変換
    for entry in data:
        if 'citycode' in entry and len(entry['citycode']) >= 5:
            entry['citycode'] = entry['citycode'][:5]

    # ファイルに書き戻す
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'✅ {file_path} を5桁コードに変換しました')


def convert_prefectures():
    """prefectures.jsonのcitycodeを6桁から5桁に変換"""
    file_path = Path(__file__).parent.parent / 'src' / \
        'data' / 'prefectures.json'

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 各都道府県の市区町村コードを5桁に変換
    for prefecture in data:
        if 'cities' in prefecture:
            for city in prefecture['cities']:
                if 'code' in city and len(city['code']) >= 5:
                    city['code'] = city['code'][:5]

    # ファイルに書き戻す
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'✅ {file_path} を5桁コードに変換しました')


if __name__ == '__main__':
    print('市区町村コードを6桁から5桁に変換中...')
    convert_prefectures()
    convert_citycode_townwork()
    print('完了!')
