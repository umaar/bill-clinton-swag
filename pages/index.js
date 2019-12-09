import { useRef, useState, useEffect, forwardRef } from 'react';
import Perspective from 'perspective-transform';
import useDebounce from '../utils/debounce';
import useAxios from '../utils/axios';
import Head from 'next/head';
import Layout from '../layouts';

const DEFAULT_IMAGE = '/images/placeholder.png';
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
            key={idx}
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

const AlbumSelector = forwardRef(({ onChange, active = false }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isExpanded = searchTerm !== '';
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, error, loading } = useAxios(
    debouncedSearchTerm === ''
      ? null
      : {
          method: 'get',
          url: `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${debouncedSearchTerm}&api_key=ca14ba934a1e3c12f36c30bdf81f4f43&format=json&callback=`
        }
  );

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (data) {
            onChange(data.results.albummatches.album[0].image[3]['#text']);
            setSearchTerm('');
          }
        }}>
        <div className="flex">
          <input
            ref={ref}
            disabled={!active}
            tabIndex={0}
            type="text"
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={e => e.target.select()}
            value={searchTerm}
            placeholder="Search for an album..."
          />
          {loading && <img className="loading" src="/images/loading.gif" />}
        </div>
      </form>
      <br />
      {data &&
        searchTerm &&
        data.results.albummatches.album.slice(0, 6).map((album, idx) => {
          function handleSelection() {
            onChange(album.image[3]['#text']);
            setSearchTerm('');
          }
          return (
            <img
              className="album"
              key={idx}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSelection();
                }
              }}
              onClick={handleSelection}
              src={album.image[3]['#text']}
            />
          );
        })}

      <style jsx>{`
        .flex {
          display: flex;
        }
        .flex > input {
          flex: 1;
          max-width: 80%;
        }
        .flex > img {
          height: 25px;
          width: 25px;
          padding: 3px;
          box-sizing: border-box;
          margin-left: 10px;
        }
        .album {
          width: 140px;
          margin: 0 20px 20px 0;
        }
        input {
          color: #333;
          width: 100%;
          box-sizing: border-box;
          padding: 7px 15px;
          border: 1px solid #ccc;
          position: relative;
          background: transparent;
        }
      `}</style>
    </div>
  );
});

const Header = () => (
  <header className="root">
    <h1>Bill Clinton Swag</h1>
    <span>"I did not have sexual relations with that record"</span>
    <style jsx>
      {`
        .root {
          margin: 2rem 0;
        }
        h1 {
          font-size: 3em;
          line-height: 0.95;
          margin: 0;
          padding-top: 25px;
        }
        span {
          display: block;
          text-align: right;
          margin-right: 2.2em;
          font-style: italic;
          font-weight: 300;
        }
      `}
    </style>
  </header>
);

const Page = () => {
  const inputRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [albums, setAlbums] = useState([
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE
  ]);

  let defaultIndex = albums.indexOf(DEFAULT_IMAGE);
  if (defaultIndex === -1) {
    defaultIndex = 0;
  }

  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag</title>
      </Head>
      <div className="container">
        <Header />

        <div className="flex">
          <div>
            <BillClintonSwag
              albums={albums}
              onClick={idx => {
                setSelectedIndex(idx);
                inputRef.current.focus();
              }}
              selectedIndex={selectedIndex}
            />
          </div>
          <div>
            <AlbumSelector
              ref={inputRef}
              active={true}
              onChange={album => {
                const newAlbums = [...albums];
                const idx = selectedIndex !== null ? selectedIndex : defaultIndex;
                newAlbums[idx] = album;
                setAlbums(newAlbums);
                if (selectedIndex === albums.length - 1) {
                } else {
                  setSelectedIndex((selectedIndex + 1) % 4);
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>
        {`
          html,
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: helvetica;
          }

          .container {
            margin: 0 auto;
            max-width: 900px;
            display: flex;
            align-items: center;
            flex-direction: column;
          }

          .flex {
            display: flex;
            align-items: flex-start;
            width: 100%;
          }
          .flex > div {
            margin: 0 25px;
            flex: 1;
          }
        `}
      </style>
    </Layout>
  );
};

export default Page;
