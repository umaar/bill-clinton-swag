import { useState, useEffect, useRef, forwardRef } from 'react';
import useDebounce from '../utils/debounce';
import useAxios from '../utils/axios';

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

let APIKey = [
  '229711d2e395166fa34412c2ea8e5fca',
  'ca14ba934a1e3c12f36c30bdf81f4f43',
  '7bc383ee4b0d111c335f516fbc53e4eb'
];
APIKey = APIKey[Math.floor(Math.random() * APIKey.length)];

export default forwardRef(({ onSelect, ...rest }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, error, loading: searchInFlight } = useAxios(
    debouncedSearchTerm === ''
      ? null
      : {
          method: 'get',
          url: `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${debouncedSearchTerm}&api_key=${APIKey}&format=json&callback=`
        }
  );

  const isLoading = debouncedSearchTerm !== searchTerm || searchInFlight;

  let results;

  if (data) {
    results = data?.results?.albummatches?.album?.slice(0, 5).map(x => ({
      url: x.image[3]['#text'],
      album: x.name,
      artist: x.artist
    }));
  }

  if (!results) {
    results = [];
  }

  function setModal(open) {
    setSelectedIndex(0);
    if (open) {
      setOpen(open);
      document.body.classList.add('modal-open');
    } else {
      setOpen(open);
      document.body.classList.remove('modal-open');
    }
  }

  return (
    <>
      <form
        className={open ? 'open' : ''}
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
            setSelectedIndex(-1);
            onSelect(results[selectedIndex]);
            setModal(false);
            ref.current.blur();
          }
        }}>
        <input
          tabIndex={0}
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={e => setModal(true)}
          {...rest}
        />
        <div className="results" onTouchStart={e => ref.current.blur()}>
          {results.map((x, idx) => (
            <SearchResult
              key={idx}
              result={x}
              onMouseOver={e => setSelectedIndex(idx)}
              onClick={e => {
                setSelectedIndex(-1);
                onSelect(x);
                setModal(false);
                ref.current.blur();
              }}
              selected={idx === selectedIndex}
            />
          ))}
        </div>
        {isLoading && <img className="loading" src="/images/loading.gif" />}
        <img
          className="back-button"
          draggable="false"
          src="/images/backarrow.svg"
          onClick={() => setModal(false)}
        />
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
            padding: 1em 1.5em;
            font-size: 0.75em;
            border: 1px solid #ccc;
            position: relative;
            background: transparent;
            width: 100%;
            -webkit-appearance: none;
            border-radius: 0;
          }

          .loading {
            position: absolute;
            top: 0.7em;
            right: 0.7em;
            width: 1.25em;
          }

          .back-button {
            display: none;
            cursor: pointer;
            user-select: none;
          }

          .results {
            display: none;
          }

          form {
            z-index: 99;
          }

          form.open .results:not(:empty) {
            display: block;
            position: absolute;
            width: 100%;
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

            form.open {
              position: fixed;
              top: 0;
              left: 0;
              bottom: 0;
              width: 100%;
              background: white;
              z-index: 100;
            }

            form.open {
              display: block;
            }

            form.open input {
              padding-left: 45px;
              padding-top: 1.5em;
              padding-bottom: 1.5em;
            }

            form.open .back-button {
              display: block;
              position: absolute;
              top: 1em;
              left: 1em;
              width: 1.25em;
            }

            form.open .loading {
              top: 1em;
              right: 1em;
            }

            form.open .results:not(:empty) {
              display: block;
              min-height: 75%;
              border-bottom: none;
            }
          }
        `}
      </style>
    </>
  );
});
