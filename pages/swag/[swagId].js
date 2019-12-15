import Layout from '../../layouts';
import Header from '../../components/header';

const Page = ({
  url: {
    query: { swagId }
  }
}) => {
  return (
    <Layout>
      <div className="container">
        <Header />
        <img src={`https://s3.amazonaws.com/Clinton_Swag/${swagId}/swag.png`} />
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

export default Page;
