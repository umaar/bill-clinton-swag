import requests
import re
import os

from bs4 import BeautifulSoup
from flask import Flask, jsonify, request, redirect, make_response

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    q = request.args.get('q')
    base_url = request.headers.get('X-Now-Deployment-Url')
    if 'localhost' in base_url:
        base_url = f'http://{base_url}'
    else:
        base_url = f'https://{base_url}'
    resp = jsonify(search(q, base_url))
    resp.headers['Cache-Control'] = 's-maxage=86400, stale-while-revalidate'
    return resp


def search(query, base_url='http://localhost:300'):
    resp = requests.get(f'https://www.last.fm/search/albums?q={query}')
    resp.raise_for_status()

    soup = BeautifulSoup(resp.content)

    return [
        {
            'url':
            re.sub('(\d+s)', '300x300',
                   x.find('img').attrs['src']
                  ).replace('https://lastfm.freetls.fastly.net/i/', f'{base_url}/i/'),
            'album':
            x.find('h4').a.text,
            'artist':
            x.find('p').a.text,
        } for x in soup.findAll('div', {'class': 'album-result-inner'})
    ]


if __name__ == '__main__':
    print(search('city of the weak'))
