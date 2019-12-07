import io
import numpy

from flask import Flask, send_file
from PIL import Image

app = Flask(__name__)

COORDS = [
  [(107, 238), (262, 288), (67, 384),  (212, 436)],
  [(118, 512), (266, 546), (9, 626),   (186, 692)],
  [(271, 517), (436, 511), (280, 651), (501, 646)],
  [(365, 300), (473, 331), (333, 425), (436, 474)]
]

def find_coeffs(source_coords, target_coords):
    matrix = []
    for s, t in zip(source_coords, target_coords):
        matrix.append([t[0], t[1], 1, 0, 0, 0, -s[0]*t[0], -s[0]*t[1]])
        matrix.append([0, 0, 0, t[0], t[1], 1, -s[1]*t[0], -s[1]*t[1]])
    A = numpy.matrix(matrix, dtype=numpy.float)
    B = numpy.array(source_coords).reshape(8)
    res = numpy.dot(numpy.linalg.inv(A.T * A) * A.T, B)
    return numpy.array(res).reshape(8)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    bg = Image.open('./public/images/clinton.png').convert(mode='RGBA')
    fg = Image.open('./public/images/clintonfront.png').convert(mode='RGBA')
    albums = [bg.copy(), bg.copy(), bg.copy(), bg.copy()]
    for idx, album in enumerate(albums):
        width, height = album.size
        coeffs = find_coeffs([
          (0,0), (width,0), (0,height), (width,height)
        ], COORDS[idx])
        album = album.transform((width, height), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        bg = Image.alpha_composite(bg, album)

    bg = Image.alpha_composite(bg, fg)
    output = io.BytesIO()
    bg.save(output, format='png')
    output.seek(0)
    return send_file(
        output,
        attachment_filename='billclintonswag.png',
        mimetype='image/png'
    )


