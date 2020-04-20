import requests

from flask import Flask, jsonify, request, redirect

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    q = request.args.get('q')
    resp = requests.get(f'https://genius.com/api/search/album?page=1&q={q}')
    resp.raise_for_status()
    results = resp.json()
    results = results['response']['sections'][0]['hits']

    return jsonify(results)
