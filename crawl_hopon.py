import requests
from bs4 import BeautifulSoup
import json
import time

HEADERS = {'User-Agent': 'Mozilla/5.0'}
URLS = [
    'https://hopon-hopoff.vn/?toursearch=1&s=HoChiMinh+City',
    'https://hopon-hopoff.vn/?toursearch=1&s=Hanoi',
    'https://hopon-hopoff.vn/tours',
    'https://hopon-hopoff.vn/tours/page/2',
    'https://hopon-hopoff.vn/tours/page/3',
    'https://hopon-hopoff.vn/?toursearch=1&s=Mekong+delta',
    'https://hopon-hopoff.vn/?toursearch=1&s=CuChi',
    'https://hopon-hopoff.vn/asia',
    'https://hopon-hopoff.vn/europe',
    # Thêm các trang tiếng Việt
    'https://hopon-hopoff.vn/vi/',
    'https://hopon-hopoff.vn/vi/tours',
    'https://hopon-hopoff.vn/vi/tours/page/2',
    'https://hopon-hopoff.vn/vi/tours/page/3',
    'https://hopon-hopoff.vn/vi/asia',
    'https://hopon-hopoff.vn/vi/europe',
    'https://hopon-hopoff.vn/vi/?toursearch=1&s=HoChiMinh+City',
    'https://hopon-hopoff.vn/vi/?toursearch=1&s=Hanoi',
    'https://hopon-hopoff.vn/vi/?toursearch=1&s=Mekong+delta',
    'https://hopon-hopoff.vn/vi/?toursearch=1&s=CuChi',
]

def parse_atlist_item(item):
    title_tag = item.select_one('.atlist__item__title a')
    title = title_tag.text.strip() if title_tag else ''
    url = title_tag['href'] if title_tag and title_tag.has_attr('href') else ''
    desc_tag = item.select_one('.atlist__item__description')
    description = desc_tag.text.strip() if desc_tag else ''
    price_tag = item.select_one('.atlist__item__price .amount')
    price = price_tag.text.strip() if price_tag else ''
    duration_tag = item.select_one('.item-attributes__item__content__item--text span')
    duration = duration_tag.text.strip() if duration_tag else ''
    type_tag = item.select_one('.atlist__item__angle')
    tour_type = type_tag.text.strip() if type_tag else ''
    return {
        'title': title,
        'url': url,
        'description': description,
        'price': price,
        'duration': duration,
        'tour_type': tour_type
    }

def parse_atgrid_item(item):
    title_tag = item.select_one('.atgrid__item__title a')
    title = title_tag.text.strip() if title_tag else ''
    url = title_tag['href'] if title_tag and title_tag.has_attr('href') else ''
    desc_tag = item.select_one('.atgrid__item__description')
    description = desc_tag.get_text(' ', strip=True) if desc_tag else ''
    price_tag = item.select_one('.atgrid__item__price .amount')
    price = price_tag.text.strip() if price_tag else ''
    duration_tag = item.select_one('.item-attributes__item__content__item--text span')
    duration = duration_tag.text.strip() if duration_tag else ''
    return {
        'title': title,
        'url': url,
        'description': description,
        'price': price,
        'duration': duration,
        'tour_type': ''
    }

def crawl_tours():
    tours = []
    seen_urls = set()
    for base_url in URLS:
        print(f'Crawling {base_url}...')
        resp = requests.get(base_url, headers=HEADERS)
        if resp.status_code != 200:
            continue
        soup = BeautifulSoup(resp.text, 'html.parser')
        atlist_items = soup.select('.atlist__item')
        atgrid_items = soup.select('.atgrid__item')
        for item in atlist_items:
            tour = parse_atlist_item(item)
            if tour['url'] and tour['url'] not in seen_urls:
                tours.append(tour)
                seen_urls.add(tour['url'])
        for item in atgrid_items:
            tour = parse_atgrid_item(item)
            if tour['url'] and tour['url'] not in seen_urls:
                tours.append(tour)
                seen_urls.add(tour['url'])
        time.sleep(0.5)
    # Phân loại ra 2 mảng
    tours_vn = [t for t in tours if '/vi/' in t['url']]
    tours_en = [t for t in tours if '/vi/' not in t['url']]
    with open('tours_crawled.json', 'w', encoding='utf-8') as f:
        json.dump({'tours_vn': tours_vn, 'tours_en': tours_en}, f, ensure_ascii=False, indent=2)
    print(f'Crawled {len(tours)} tours. VN: {len(tours_vn)}, EN: {len(tours_en)}')

if __name__ == '__main__':
    crawl_tours()
