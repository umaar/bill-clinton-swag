import { useRef, useState } from 'react';
import Head from 'next/head';
import Layout from '../layouts';
import Header from '../components/header';
import SearchBar from '../components/searchbar';
import SwagPreview from '../components/swag-preview';
import ThreeDots from '../components/three-dots';

const DEFAULT_IMAGE = '/images/placeholder.png';

const Page = () => {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [albums, setAlbums] = useState([
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE
  ]);

  const isComplete = albums.indexOf(DEFAULT_IMAGE) === -1;

  function generateSwag() {
    setLoading(true);
    let url = '/api/image?';
    url += albums
      .map(x => (x.startsWith('/') ? `${window.location.origin}${x}` : x))
      .map(x => `album_url=${encodeURIComponent(x)}`)
      .join('&');
    window.location = url;
  }

  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag</title>
      </Head>
      <div className="container">
        <Header />
        <SearchBar
          ref={inputRef}
          onSelect={album => {
            const newAlbums = [...albums];
            newAlbums[selectedIndex] = album.url;
            setAlbums(newAlbums);
            setSelectedIndex((selectedIndex + 1) % 4);
          }}
          placeholder="Search for Album..."
        />

        <SwagPreview
          albums={albums}
          onClick={idx => {
            setSelectedIndex(idx);
          }}
          selectedIndex={selectedIndex}
        />

        {isComplete && (
          <button onClick={generateSwag}>{loading ? <ThreeDots /> : 'Generate Swag'}</button>
        )}
      </div>

      <style jsx>
        {`
          .container {
            margin: 0 auto;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0 25px;
            max-width: 900px;
          }

          button {
            font-size: 18px;
            color: white;
            background-color: #0e233e;
            border: none;
            padding: 0.75em;
            font-weight: bold;
            margin-left: 0;
            width: 250px;
          }

          @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
            button {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100vw;
              padding: 20px;
              padding-bottom: 27px;
              z-index: 99;
            }
            .container {
              padding-bottom: 100px;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default Page;
