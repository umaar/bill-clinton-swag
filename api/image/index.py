import io
# import numpy
import random
import string
import boto3
import urllib.request
import os

from flask import Flask, jsonify, request, redirect
from PIL import Image
from urllib.parse import urlparse
from typing import List

app = Flask(__name__)
s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('SECRET_ACCESS_KEY')
)

COORDS = [
    [(107, 238), (262, 288), (67, 384), (212, 436)],
    [(118, 512), (266, 546), (9, 626), (186, 692)],
    [(271, 517), (436, 511), (280, 651), (501, 646)],
    [(365, 300), (473, 331), (333, 425), (436, 474)]
]  # yapf: disable

COEFFS = [
    [ 6.89723654e-01, 1.88965385e-01, -4.75096770e+02, -3.17077824e-01,
          9.82941256e-01, -8.00050766e+02, 7.65631402e-05,  -6.88638878e-05],
    [-1.68321049e+00, -1.60938547e+00, 4.09049678e+03, 8.29622208e-01,
         -3.61129667e+00, 7.00435390e+03, -1.70997503e-04, -1.57128511e-03],
    [-2.22553055e+00, 1.49475933e-01, 2.10335889e+03, -1.91535176e-01,
         -5.26721733e+00, 1.11002296e+04, -1.49193264e-04, -1.91112495e-03],
    [ 2.54932360e+00, 6.52626842e-01, -4.50516467e+03, -8.08405475e-01,
          2.81638036e+00, -2.19938444e+03, 6.99165082e-04, 1.65874132e-04],
]  # yapf: disable


#
# PRECOMPUTED IN COEFFS BECAUSE NUMPY TOO FAT
#
# def find_coeffs(source_coords, target_coords):
#     matrix = []
#     for s, t in zip(source_coords, target_coords):
#         matrix.append([t[0], t[1], 1, 0, 0, 0, -s[0] * t[0], -s[0] * t[1]])
#         matrix.append([0, 0, 0, t[0], t[1], 1, -s[1] * t[0], -s[1] * t[1]])
#     A = numpy.matrix(matrix, dtype=numpy.float)
#     B = numpy.array(source_coords).reshape(8)
#     res = numpy.dot(numpy.linalg.inv(A.T * A) * A.T, B)
#     return numpy.array(res).reshape(8)


def download_image(url):
    """Download a PIL image from a url"""
    return Image.open(io.BytesIO(urllib.request.urlopen(url).read())).convert(mode='RGBA')


def scale(coords, factor=4):
    return [(x * factor, y * factor) for x, y in coords]


def main(album_urls: List[str]) -> io.BytesIO:
    bg = Image.open('./template/clinton.png').convert(mode='RGBA')
    fg = Image.open('./template/clintonfront.png').convert(mode='RGBA')

    albums = [
        download_image(album_url).resize((bg.width, bg.height), resample=Image.ANTIALIAS)
        for album_url in album_urls
    ]

    for idx, album in enumerate(albums):
        width, height = 465, 683
        album = album.resize((width, height), resample=Image.ANTIALIAS)
        coeffs = COEFFS[idx]
        # coeffs = find_coeffs(
        #     [(0, 0), (width, 0), (0, height), (width, height)], scale(COORDS[idx], factor=4)
        # )
        album = album.transform((width * 4, height * 4), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        album = album.resize((bg.width, bg.height), resample=Image.ANTIALIAS)
        bg = Image.alpha_composite(bg, album)

    bg = Image.alpha_composite(bg, fg)
    output = io.BytesIO()
    bg.save(output, format='png')
    output.seek(0)

    token = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    key = f'{token}/swag.png'
    bucket = 'Clinton_Swag'
    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=output,
        ContentType='image/png',
    )

    return token


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    album_urls = request.args.getlist('album_url')
    assert len(album_urls) == 4, album_urls
    token = main(album_urls=album_urls)
    url = urlparse(request.base_url)
    output_url = f'{url.scheme}://{url.netloc}/swag/{token}'
    return redirect(output_url, code=302)


if __name__ == '__main__':
    main(
        [
            'https://lastfm.freetls.fastly.net/i/u/300x300/ccf9a25ab8f34558946deb6010839c7c.png',
            'https://lastfm.freetls.fastly.net/i/u/300x300/ccf9a25ab8f34558946deb6010839c7c.png',
            'https://lastfm.freetls.fastly.net/i/u/300x300/ccf9a25ab8f34558946deb6010839c7c.png',
            'https://lastfm.freetls.fastly.net/i/u/300x300/ccf9a25ab8f34558946deb6010839c7c.png',
        ]
    )
