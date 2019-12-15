import Head from 'next/head';

const gTagConfig = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-35719589-1');
`;
export default ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-35719589-1" />
        <script dangerouslySetInnerHTML={{ __html: gTagConfig }} />
      </Head>
      {children}

      <style jsx global>
        {`
          html,
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: helvetica;
          }
        `}
      </style>
    </>
  );
};
