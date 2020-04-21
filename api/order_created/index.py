import pprint
import requests
import base64
import os
import time

from flask import Flask, jsonify, request, redirect

app = Flask(__name__)

API_KEY = base64.b64encode(os.environ.get('PRINTFUL_API_KEY').encode()).decode('utf-8')


@app.route('/', defaults={'path': ''}, methods=['POST'])
@app.route('/<path:path>', methods=['POST'])
def catch_all(path):
    attributes = request.json.get('note_attributes', {})
    attributes = {x['name']: x['value'] for x in attributes}
    order_number = request.json['order_number']

    if 'swag' not in attributes:
        return 'Not a order i care about'

    swag_id = attributes['swag']
    personalize_order(order_number, swag_id)

    return 'Success'


def personalize_order(order_number, swag):
    resp = requests.get(
        f'https://api.printful.com/orders/@{order_number}',
        headers={'Authorization': f'Basic {API_KEY}'}
    )
    resp.raise_for_status()
    order = resp.json()['result']
    pprint.pprint(order)

    order['items'][0]['files'][0] = {
        'url': f'https://s3.amazonaws.com/Clinton_Swag/{swag}/swag.png'
    }

    resp = requests.put(
        f'https://api.printful.com/orders/@{order_number}',
        headers={'Authorization': f'Basic {API_KEY}'},
        json=order
    )
    resp.raise_for_status()
    pprint.pprint(resp.json())

    # resp = requests.post(
    #     f'https://api.printful.com/orders/@{order_number}/confirm',
    #     headers={'Authorization': f'Basic {API_KEY}'}
    # )
    # resp.raise_for_status()


# if __name__ == '__main__':
#     personalize_order('1004', '5tMuddUOAg')
