import pprint
import requests
import base64
import os
import time
import boto3
import requests
import io

from PIL import Image

from flask import Flask, jsonify, request, redirect

app = Flask(__name__)

API_KEY = base64.b64encode(os.environ.get('PRINTFUL_API_KEY').encode()).decode('utf-8')

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('SECRET_ACCESS_KEY')
)


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


def personalize_order(order_number, swag_id):
    swag_url = f'https://s3.amazonaws.com/Clinton_Swag/{swag_id}/swag.png'

    # Download the swag
    swag = Image.open(io.BytesIO(requests.get(swag_url).content)).convert(mode='RGBA')

    # Save as 12x16" with 150dpi for Printful.
    # Make the image have a transparent background.
    # The swag should be 9" wide, centered horizontal (1350px @ 150dpi).
    # The swag should be positioned 2" from the top (300px @ 150dpi).
    swag_printfile = Image.new(mode='RGBA', size=(1800, 2400), color=(0, 0, 0, 0))
    swag_printfile.paste(
        swag.copy().resize((1350, 1983), resample=Image.ANTIALIAS),  # Based on aspect ratio
        (int((1800 / 2) - (1350 / 2)), int((2400 / 2) - (1983 / 2)))
    )

    swag_printfile_key = f'{swag_id}/swag-printfile.png'
    swag_printfile_url = f'https://s3.amazonaws.com/Clinton_Swag/{swag_id}/swag-printfile.png?x=2'

    # Write to s3
    output = io.BytesIO()
    swag_printfile.save(output, format='png', dpi=(150, 150))
    output.seek(0)
    s3.put_object(
        Bucket='Clinton_Swag',
        Key=swag_printfile_key,
        Body=output,
        ContentType='image/png',
    )

    # Fetch Printful order
    resp = requests.get(
        f'https://api.printful.com/orders/@{order_number}',
        headers={'Authorization': f'Basic {API_KEY}'}
    )
    resp.raise_for_status()
    order = resp.json()['result']
    pprint.pprint(order)

    order['items'][0]['files'] = [
        {
            'type': 'default',
            'url': swag_printfile_url
        },
        {
            'type': 'preview',
            'url': f'https://billclintonswag.com/api/shirt_mockup?swag={swag_id}'
        },
    ]

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


if __name__ == '__main__':
    personalize_order('1009', 'njuiuR78mb')
