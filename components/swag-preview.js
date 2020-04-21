import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Perspective from 'perspective-transform';

const COORDS = [
  [107, 238, 262, 288, 67, 384, 212, 436],
  [118, 512, 266, 546, 9, 626, 186, 692],
  [271, 517, 436, 511, 280, 651, 501, 646],
  [365, 300, 473, 331, 333, 425, 436, 474]
];

const [WIDTH, HEIGHT] = [465, 683];
const ALBUM_SIZE = 512;
const CLASS_NAMES = ['one', 'two', 'three', 'four'];

export default ({ onClick, albums = [], selectedIndex = null }) => {
  const ref = useRef();
  const [count, setCount] = useState(0);
  const width = (ref.current && ref.current.width) || 0;

  useEffect(() => {
    if (!width) {
      setTimeout(() => {
        setCount(count + 1);
      }, 10);
    }
  }, [count]);

  const scale = width ? width / 465.0 : 1.0;

  let matrices = COORDS.map(
    dest =>
      Perspective(
        [0, 0, ALBUM_SIZE, 0, 0, ALBUM_SIZE, ALBUM_SIZE, ALBUM_SIZE],
        dest.map(x => x * scale)
      ).coeffs
  ).map(x => [x[0], x[3], 0, x[6], x[1], x[4], 0, x[7], 0, 0, 1, 0, x[2], x[5], 0, x[8]].join(','));

  return (
    <div className="relative inline-block overflow-hidden">
      <img
        src="/images/clinton.png"
        style={{ filter: 'grayscale(1)' }}
        className="relative z-10 block pointer-events-none select-none max-w-full"
        ref={ref}
      />
      <div className="absolute inset-0 z-20">
        {width &&
          albums.map((x, idx) => (
            <img
              key={idx}
              draggable="false"
              onClick={e => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                onClick(idx);
              }}
              className="max-w-none border-blue-700 absolute top-0 left-0 box-border"
              style={{
                transform: `matrix3d(${matrices[idx]})`,
                transformOrigin: '0px 0px 0px',
                borderWidth: idx === selectedIndex ? '15px' : '0',
                width: `${ALBUM_SIZE}px`,
                height: `${ALBUM_SIZE}px`
              }}
              src={x}
            />
          ))}
      </div>
      <div className="absolute inset-0 z-30 pointer-events-none select-none">
        <img
          className="pointer-events-none max-w-full"
          src="/images/clintonfront.png"
          style={{ filter: 'grayscale(1)' }}
        />
        {width && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="font-bold text-6xl"
              style={{
                color: 'rgba(255,255,255,0.3)',
                transform: `rotate(45deg) scale(${scale})`
              }}>
              PREVIEW
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
