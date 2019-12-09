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
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-35719589-1" />
        <script dangerouslySetInnerHTML={{ __html: gTagConfig }} />
      </Head>
      {children}
    </>
  );
};
