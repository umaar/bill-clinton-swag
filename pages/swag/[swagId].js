import Head from 'next/head';
import Layout from '../../layouts';
import Header from '../../components/header';

const Page = ({ swagId }) => {
  const imageUrl = `https://s3.amazonaws.com/Clinton_Swag/${swagId}/swag.png`;
  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@thmsmlr" />
        <meta property="og:title" content="Bill Clinton Swag" />
        <meta
          property="og:description"
          content="I did not have sexual relations with that record"
        />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <div className="container">
        <Header />
        <div>
          <img src={imageUrl} />
        </div>
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
        `}
      </style>
    </Layout>
  );
};

Page.getInitialProps = async ({ res, query: { swagId } }) => {
  res.setHeader('Cache-Control', 's-maxage=31449600, stale-while-revalidate');
  return {
    swagId
  };
};

export default Page;
