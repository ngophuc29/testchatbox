import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse

BASE_URL = 'https://hopon-hopoff.vn/'
HEADERS = {'User-Agent': 'Mozilla/5.0'}
DOMAIN = 'hopon-hopoff.vn'


def is_internal(url):
    parsed = urlparse(url)
    return (not parsed.netloc or DOMAIN in parsed.netloc) and url.startswith('http')

def crawl_full_site():
    visited = set()
    to_visit = set([BASE_URL])
    results = []
    while to_visit:
        url = to_visit.pop()
        if url in visited:
            continue
        print(f'Crawling: {url}')
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, 'html.parser')
            title = soup.title.text.strip() if soup.title else ''
            body = soup.get_text(separator=' ', strip=True)
            results.append({'url': url, 'title': title, 'content': body[:2000]})
            visited.add(url)
            # Lấy các link nội bộ mới
            for a in soup.find_all('a', href=True):
                link = urljoin(url, a['href'])
                if link.startswith(BASE_URL) and link not in visited:
                    to_visit.add(link)
            time.sleep(0.5)
        except Exception as e:
            print(f'Error: {e}')
            continue
    with open('fullsite_crawled.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f'Crawled {len(results)} pages.')

if __name__ == '__main__':
    crawl_full_site()
