import { useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../layouts';
import Header from '../../../components/header';
import Button from '../../../components/button';

const Page = ({ swagId }) => {
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const imageUrl = `https://s3.amazonaws.com/Clinton_Swag/${swagId}/swag.png`;

  async function notifyEmail(email) {
    const data = new FormData();
    data.append('emailAddress', email);
    setLoading(true);
    const resp = await fetch(`/api/subscribe`, { method: 'POST', body: data });

    if (!resp.ok) {
      setError(resp.text());
    } else {
      setComplete(true);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag | Shop</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@thmsmlr" />
        <meta property="og:title" content="Bill Clinton Swag" />
        <meta property="og:description" content="I did not have sexual relations, for the record" />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <div className="container">
        <Header />
        <h3>Coming Soon!</h3>
        <p>Enter your email to get notified when we launch</p>
        {complete ? (
          <div>Thank you!</div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              notifyEmail(email);
            }}>
            <input
              ref={emailRef}
              type="email"
              placeholder="email..."
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              disabled={
                loading ||
                !emailRef.current ||
                (emailRef.current && !emailRef.current.validity.valid)
              }>
              {loading ? 'Loading...' : 'Notify Me'}
            </Button>
          </form>
        )}
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

          input[type='email']:invalid {
            color: red;
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
