import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../layouts';
import Header from '../../../components/header';

const Page = ({ swagId }) => {
  const imageUrl = `https://s3.amazonaws.com/Clinton_Swag/${swagId}/swag.png`;
  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@thmsmlr" />
        <meta property="og:title" content="Bill Clinton Swag" />
        <meta property="og:description" content="I did not have sexual relations, for the record" />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <div className="container">
        <Header />
        <h3>COMING SOON!</h3>
      </div>

      <style jsx>
        {`
          .container {
            margin: 0 auto;
            max-width: 900px;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0 25px;
            padding-bottom: 150px;
          }
          img {
            max-width: 100%;
          }
          @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
            button {
              position: fixed;
              bottom: -2px;
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

Page.getInitialProps = async ({ res, query: { swagId } }) => {
  if (res) {
    res.setHeader('Cache-Control', 's-maxage=31449600, stale-while-revalidate');
  }

  return {
    swagId
  };
};

export default Page;
