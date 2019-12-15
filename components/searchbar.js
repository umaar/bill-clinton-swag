import { useState, useEffect, useRef, forwardRef } from 'react';
import useDebounce from '../utils/debounce';
import useAxios from '../utils/axios';

export default forwardRef(({ onSelect, ...rest }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [active, setActive] = useState('active');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, error, loading: searchInFlight } = useAxios(
    debouncedSearchTerm === ''
      ? null
      : {
          method: 'get',
          url: `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${debouncedSearchTerm}&api_key=ca14ba934a1e3c12f36c30bdf81f4f43&format=json&callback=`
        }
  );

  const isLoading = debouncedSearchTerm !== searchTerm || searchInFlight;

  let results = [];
  if (data) {
    results = data.results.albummatches.album.slice(0, 5).map(x => ({
      url: x.image[3]['#text'],
      album: x.name,
      artist: x.artist
    }));
  }

  return (
    <>
      <form
        onKeyDown={e => {
          if (e.key === 'ArrowDown') {
            setSelectedIndex((selectedIndex + 1) % results.length);
          }
          if (e.key === 'n' && e.ctrlKey) {
            setSelectedIndex((selectedIndex + 1) % results.length);
            e.preventDefault();
          }
          if (e.key === 'ArrowUp') {
            setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
          }
          if (e.key === 'p' && e.ctrlKey) {
            setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
            e.preventDefault();
          }
          if (e.key === 'Escape') {
            ref.current.blur();
          }
          if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
              setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
            } else {
              setSelectedIndex((selectedIndex + 1) % results.length);
            }
          }
        }}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!isLoading && selectedIndex !== -1) {
            onSelect(results[selectedIndex]);
            setSelectedIndex(0);
            ref.current.blur();
          }
        }}>
        <input
          className={active ? 'active' : ''}
          tabIndex={0}
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onBlur={e => {
            setActive(false);
          }}
          onFocus={e => {
            setActive(true);
            setSelectedIndex(0);
          }}
          {...rest}
        />
        <div className="results">
          {results.map((x, idx) => (
            <SearchResult
              key={idx}
              result={x}
              onMouseOver={e => setSelectedIndex(idx)}
              onMouseDown={e => e.preventDefault()}
              onClick={e => {
                onSelect(x);
                ref.current.blur();
              }}
              selected={idx === selectedIndex}
            />
          ))}
        </div>
        {isLoading && <img className="loading" src="/images/loading.gif" />}
      </form>

      <style jsx>
        {`
          form {
            position: relative;
            width: 465px;
          }

          input {
            color: #333;
            box-sizing: border-box;
            padding: 7px 15px;
            border: 1px solid #ccc;
            position: relative;
            background: transparent;
            width: 100%;
          }

          .loading {
            position: absolute;
            top: 7px;
            right: 7px;
            width: 15px;
          }

          .results {
            display: none;
          }

          input:focus:not(:placeholder-shown) + .results {
            display: block;
            position: absolute;
            width: 100%;
            z-index: 99;
            border: 1px solid #ccc;
            border-top: none;
            background: white;
            box-sizing: border-box;
          }

          @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
            form {
              align-self: stretch;
              width: auto;
            }
          }
        `}
      </style>
    </>
  );
});

const SearchResult = ({ result: { artist, album, url }, selected, ...rest }) => {
  return (
    <div className={'result' + (selected ? ' selected' : '')} {...rest}>
      <img src={url} />
      <span>
        <h3>{album}</h3>
        <p>{artist}</p>
      </span>

      <style jsx>
        {`
          .result {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 10px 10px;
            border-bottom: 1px solid #eee;
            overflow: hidden;
            font-size: 0.8em;
          }

          img {
            margin-right: 15px;
            width: 64px;
          }

          h3,
          p {
            margin: 0;
            margin-bottom: 0.2rem;
          }

          .result > span {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            flex-shrink: 1;
          }

          .result:last-child {
            border-bottom: none;
          }

          .result:hover {
            background: #eee;
          }

          .result.selected {
            background: #eee;
          }
        `}
      </style>
    </div>
  );
};
