import { useState, useRef, useLayoutEffect } from 'react';
import Perspective from 'perspective-transform';
import useWindowSize from '../utils/window-size';

const COORDS = [
  [107, 238, 262, 288, 67, 384, 212, 436],
  [118, 512, 266, 546, 9, 626, 186, 692],
  [271, 517, 436, 511, 280, 651, 501, 646],
  [365, 300, 473, 331, 333, 425, 436, 474]
];

const [WIDTH, HEIGHT] = [465, 683];
const ALBUM_SIZE = 512;
const CLASS_NAMES = ['one', 'two', 'three', 'four'];

const useReload = () => {
  const [count, setCount] = useState(0);
  return () => {
    setCount(count + 1);
  };
};

export default ({ onClick, albums = [], selectedIndex = null }) => {
  const ref = useRef();
  const reload = useReload();
  const windowSize = useWindowSize();

  useLayoutEffect(() => {
    reload();
  }, [JSON.stringify(windowSize)]);

  const scale = ref.current ? ref.current.width / 465.0 : 1.0;
  let matrices = COORDS.map(
    dest =>
      Perspective(
        [0, 0, ALBUM_SIZE, 0, 0, ALBUM_SIZE, ALBUM_SIZE, ALBUM_SIZE],
        dest.map(x => x * scale)
      ).coeffs
  ).map(x => [x[0], x[3], 0, x[6], x[1], x[4], 0, x[7], 0, 0, 1, 0, x[2], x[5], 0, x[8]].join(','));

  return (
    <div className="wrapper">
      <img src="/images/clinton.png" ref={ref} />
      <div className="bg">
        {ref.current &&
          albums.map((x, idx) => (
            <img
              key={idx}
              draggable="false"
              onClick={e => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                onClick(idx === selectedIndex ? null : idx);
              }}
              className={'album ' + CLASS_NAMES[idx] + (idx === selectedIndex ? ' selected' : '')}
              src={x}
            />
          ))}
      </div>
      <div className="fg">
        <img src="/images/clintonfront.png" />
        <div className="watermark-wrapper">
          <div className="watermark">PREVIEW</div>
        </div>
      </div>
      <style jsx>
        {`
          .watermark-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .watermark {
            color: rgba(255, 255, 255, 0.3);
            font-weight: bold;
            letter-spacing: 1px;
            transform: rotate(45deg) scale(${scale});
            font-size: 80px;
          }

          .wrapper {
            position: relative;
            display: inline-block;
            overflow: hidden;
            margin-top: 25px;
          }

          .wrapper > img {
            position: relative;
            z-index: 1;
            display: block;
            pointer-events: none;
            user-select: none;
            max-width: 100%;
          }

          .bg {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          .fg {
            position: absolute;
            z-index: 9;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            user-select: none;
          }

          .fg > img {
            pointer-events: none;
            max-width: 100%;
          }

          .album {
            top: 0;
            left: 0;
            position: absolute;
            z-index: 7;
            width: ${ALBUM_SIZE}px;
            height: ${ALBUM_SIZE}px;
            transform-origin: 0px 0px 0px;
            box-sizing: border-box;
          }

          .album.selected {
            border: 15px solid #265da5;
          }

          .album.one {
            transform: matrix3d(${matrices[0]});
          }

          .album.two {
            transform: matrix3d(${matrices[1]});
          }

          .album.three {
            transform: matrix3d(${matrices[2]});
          }

          .album.four {
            transform: matrix3d(${matrices[3]});
          }
        `}
      </style>
    </div>
  );
};
