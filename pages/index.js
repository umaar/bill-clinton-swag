import { useRef, useState, useEffect } from 'react';
import Perspective from 'perspective-transform';
import useDebounce from '../utils/debounce';
import useAxios from '../utils/axios';
import Head from 'next/head';

const DEFAULT_IMAGE =
  'https://www.nicepng.com/png/full/430-4305845_question-mark-doubt-icon-png.png';
const COORDS = [
  [107, 238, 262, 288, 67, 384, 212, 436],
  [118, 512, 266, 546, 9, 626, 186, 692],
  [271, 517, 436, 511, 280, 651, 501, 646],
  [365, 300, 473, 331, 333, 425, 436, 474]
];

const BillClintonSwag = ({ onClick, albums = [], selectedIndex = null }) => {
  const dim = 512;
  let matrices = COORDS.map(dest => Perspective([0, 0, dim, 0, 0, dim, dim, dim], dest).coeffs).map(
    x => [x[0], x[3], 0, x[6], x[1], x[4], 0, x[7], 0, 0, 1, 0, x[2], x[5], 0, x[8]].join(',')
  );
  const classNames = ['one', 'two', 'three', 'four'];

  return (
    <div className="wrapper">
      <img src="/images/clinton.png" />
      <div className="bg">
        {albums.map((x, idx) => (
          <img
            key={x}
            draggable="false"
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onClick(idx === selectedIndex ? null : idx);
            }}
            className={'album ' + classNames[idx] + (idx === selectedIndex ? ' selected' : '')}
            src={x}
          />
        ))}
      </div>
      <div className="fg">
        <img src="/images/clintonfront.png" />
      </div>
      <style jsx>
        {`
          .wrapper {
            position: relative;
            display: inline-block;
            overflow: hidden;
            transform: scale(0.9);
          }

          .wrapper > img {
            position: relative;
            z-index: 1;
            display: block;
            pointer-events: none;
            user-select: none;
          }

          .bg {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
          }

          .fg {
            position: absolute;
            z-index: 9;
            top: 0;
            left: 0;
            pointer-events: none;
            user-select: none;
          }

          .fg > img {
            pointer-events: none;
          }

          .album {
            top: 0;
            left: 0;
            position: absolute;
            z-index: 7;
            width: ${dim}px;
            height: ${dim}px;
            transform-origin: 0px 0px 0px;
            box-sizing: border-box;
          }

          .album.selected {
            border: 15px solid blue;
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

const AlbumSelector = ({ onChange, active = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef();
  const isExpanded = searchTerm !== '';
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (active) {
      inputRef.current.focus();
    }
  }, [active]);

  const { data, error } = useAxios(
    debouncedSearchTerm === ''
      ? null
      : {
          method: 'get',
          url: `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${debouncedSearchTerm}&api_key=ca14ba934a1e3c12f36c30bdf81f4f43&format=json&callback=`
        }
  );

  return (
    <div className={'root' + (active ? ' active' : ' inactive') + (isExpanded ? ' expanded' : '')}>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (data) {
            onChange(data.results.albummatches.album[0].image[3]['#text']);
            setSearchTerm('');
          }
        }}>
        <input
          ref={inputRef}
          disabled={!active}
          type="text"
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Search for an album..."
        />
      </form>
      <br />
      {data &&
        searchTerm &&
        data.results.albummatches.album.map(album => (
          <img
            key={album.image[3]['#text']}
            onClick={() => {
              onChange(album.image[3]['#text']);
              setSearchTerm('');
            }}
            src={album.image[3]['#text']}
          />
        ))}

      <style jsx>
        {`
          .root {
            width: 100%;
            position: fixed;
            bottom: -80vh;
            z-index: 99;
            background: white;
            height: 80vh;
            transition: bottom 0.2s;
          }
          .root.active {
            bottom: calc(-80vh + 100px);
          }
          .root.active.expanded {
            bottom: calc(-20vh);
          }
          .root.inactive {
          }
        `}
      </style>
    </div>
  );
};

const Page = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [albums, setAlbums] = useState([
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE
  ]);

  return (
    <>
      <Head>
        <title>Bill Clinton Swag</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <header>
          <h1>Bill Clinton Swag</h1>
          <span>"I did not have sexual relations with the record"</span>
        </header>

        <BillClintonSwag
          albums={albums}
          onClick={idx => setSelectedIndex(idx)}
          selectedIndex={selectedIndex}
        />
      </div>
      <AlbumSelector
        active={selectedIndex !== null}
        onChange={album => {
          const newAlbums = [...albums];
          newAlbums[selectedIndex] = album;
          setAlbums(newAlbums);
          setSelectedIndex(null);
        }}
      />

      <style jsx global>
        {`
          html,
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .container {
            margin: 0 auto;
            max-width: 1000px;
            display: flex;
            align-items: center;
            flex-direction: column;
          }

          h1 {
            color: #265da5;
            margin: 0;
            padding-top: 25px;
          }
        `}
      </style>
    </>
  );
};

export default Page;
