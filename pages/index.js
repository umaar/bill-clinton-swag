import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../layouts';
import Header from '../components/header';
import SearchBar from '../components/searchbar';
import SwagPreview from '../components/swag-preview';
import ThreeDots from '../components/three-dots';
import Footer from '../components/footer';

const DEFAULT_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const Page = () => {
  const inputRef = useRef();
  const buttonRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [albums, setAlbums] = useState([
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE
  ]);

  const isComplete = albums.indexOf(DEFAULT_IMAGE) === -1;

  useEffect(() => {
    if (isComplete) {
      window.scrollTo({
        top: buttonRef.current.offsetTop,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [isComplete]);

  function generateSwag() {
    setLoading(true);
    let url = '/api/image?';
    url += albums
      .map(x => (x.startsWith('/') ? `${window.location.origin}${x}` : x))
      .map(x => `album_url=${encodeURIComponent(x)}`)
      .join('&');
    setTimeout(() => {
      window.location = url;
    }, 50);
  }

  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@thmsmlr" />
        <meta property="og:title" content="Bill Clinton Swag" />
        <meta property="og:description" content="I did not have sexual relations, for the record" />
        <meta
          property="og:image"
          content="http://s3.amazonaws.com/Clinton_Swag/ubIFiBgLQO/swag.png"
        />
      </Head>
      <div className="py-12 px-2 md:px-4 lg:px-6 max-w-screen-xl flex flex-col items-center mx-auto">
        <Header />
        <div className="grid gap-4 mt-8">
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
            <button
              ref={buttonRef}
              className="text-white bg-blue-900 p-3 text-lg font-bold"
              onClick={generateSwag}>
              {loading ? <ThreeDots /> : 'Generate Swag'}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Page;
