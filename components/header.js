export default () => (
  <header className="root">
    <h1>Bill Clinton Swag</h1>
    <span>"I did not have sexual relations with that record"</span>
    <style jsx>
      {`
        .root {
          margin: 2rem 0;
        }
        h1 {
          font-size: 3em;
          line-height: 0.95;
          margin: 0;
          padding-top: 25px;
        }
        span {
          display: block;
          text-align: right;
          margin-right: 2.2em;
          font-style: italic;
          font-weight: 300;
        }
      `}
    </style>
  </header>
);
