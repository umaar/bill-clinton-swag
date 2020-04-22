import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Dynamic from 'next/dynamic';
import Layout from '../layouts';
import Header from '../components/header';
import Carousel from '../components/carousel';

import { useState } from 'react';

const Modal = Dynamic(() => import('../components/modal'), { ssr: false });
const PRODUCTS = [
  { size: 'XS', length: '27', width: '16.5', id: 33749364179077 },
  { size: 'S', length: '28', width: '18', id: 33749364211845 },
  { size: 'M', length: '29', width: '20', id: 33749364244613 },
  { size: 'L', length: '30', width: '22', id: 33749364277381 },
  { size: 'XL', length: '31', width: '24', id: 33749364310149 },
  { size: '2XL', length: '32', width: '26', id: 33749364342917 }
];

export default () => {
  const {
    query: { swag }
  } = useRouter();
  const [selectedSize, setSelectedSize] = useState('S');
  const [isModalShowing, showModal] = useState(false);

  const selectedProduct = PRODUCTS.find(x => x.size === selectedSize);

  return (
    <Layout>
      <Head>
        <title>Bill Clinton Swag | Shop</title>
      </Head>
      <div className="border-b border-gray-300 sticky top-0 bg-white" style={{ zIndex: 20 }}>
        <Link href="/">
          <div className="max-w-screen-md mx-auto flex justify-center items-center px-4 md:px-6 lg:px-8 pt-2 cursor-pointer">
            <img src="/images/masthead.png" className="w-10" />
            <h1 className="ml-2 font-semibold text-gray-800 tracking-wider">Swag Shop</h1>
          </div>
        </Link>
      </div>

      <div className="mt-6 px-4 md:px-6 lg:px-8 max-w-screen-lg flex flex-col items-center mx-auto">
        <div className="border rounded border-yellow-700 bg-yellow-100 text-yellow-900 px-4 py-2 text-sm">
          <div className="flex">
            <div>
              <svg
                viewBox="0 0 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 mt-1">
                <g stroke="none" stroke-width="1" fill="currentColor" fillRule="evenodd">
                  <g id="icon-shape">
                    <path
                      d="M2.92893219,17.0710678 C6.83417511,20.9763107 13.1658249,20.9763107 17.0710678,17.0710678 C20.9763107,13.1658249 20.9763107,6.83417511 17.0710678,2.92893219 C13.1658249,-0.976310729 6.83417511,-0.976310729 2.92893219,2.92893219 C-0.976310729,6.83417511 -0.976310729,13.1658249 2.92893219,17.0710678 Z M15.6568542,15.6568542 C18.7810486,12.5326599 18.7810486,7.46734008 15.6568542,4.34314575 C12.5326599,1.21895142 7.46734008,1.21895142 4.34314575,4.34314575 C1.21895142,7.46734008 1.21895142,12.5326599 4.34314575,15.6568542 C7.46734008,18.7810486 12.5326599,18.7810486 15.6568542,15.6568542 Z M9,5 L11,5 L11,11 L9,11 L9,5 Z M9,13 L11,13 L11,15 L9,15 L9,13 Z"
                      id="Combined-Shape"></path>
                  </g>
                </g>
              </svg>
            </div>
            <div className="ml-2" style={{ marginTop: '2px' }}>
              <h3 className="font-semibold">Delayed Shipping</h3>
              <p>
                We're open for business, but due to covid-19 our print facilities are operating at
                reduced capacity and are working through a backlog of orders. We ask for your
                patience with any temporary shipping delays. We will notify customers of expected
                shipping times via email.
              </p>
            </div>
          </div>
        </div>
        <div className="md:flex mt-6 font-light tracking-wider">
          <div className="md:mr-6 md:w-1/2">
            <div className="md:hidden mb-4">
              <div className="flex justify-between leading-snug">
                <p className="text-gray-800 tracking-wide">Unisex</p>
                <p className="text-gray-800 font-medium tracking-wide">$35</p>
              </div>
              <h2 className="text-xl font-medium leading-snug inline tracking-normal">The Shirt</h2>
            </div>
            <Carousel className="col-span-3 bg-gray-100">
              <img
                className="mx-auto"
                style={{ maxHeight: '70vh' }}
                src={swag ? `/api/shirt_mockup?swag=${swag}` : ''}
              />
              <img className="mx-auto" style={{ maxHeight: '70vh' }} src="/images/product-3.jpeg" />
              <img className="mx-auto" style={{ maxHeight: '70vh' }} src="/images/product-2.jpeg" />
            </Carousel>
          </div>
          <div className="md:w-1/2">
            <div className="hidden md:block">
              <p className="text-gray-800 tracking-wide leading-snug">Unisex</p>
              <h2 className="text-xl font-medium leading-snug">The Shirt</h2>
            </div>
            <p className="mt-5">Color: White</p>
            <div className="md:inline-block mt-3">
              <div className="flex justify-between">
                <p className="">Size: {selectedSize}</p>
                <p
                  className="text-gray-700 cursor-pointer hover:underline tracking-wider"
                  onClick={() => showModal(true)}>
                  Sizing Guide
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 md:flex mt-1 md:-ml-3">
                {PRODUCTS.map(({ size }) => (
                  <div
                    key={size}
                    className={
                      'p-2 md:w-10 md:h-10 border flex items-center justify-center box-border md:ml-3 cursor-pointer hover:border-gray-800 active:border-gray-900 ' +
                      (size === selectedSize ? 'border-black' : 'border-gray-400')
                    }
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3">
              $35 <span className="text-gray-700">(Free International Shipping)</span>
            </p>
            <p className="mt-3">
              It's white. It's 100% cotton. It's got Bill Clinton on it. It's uniquely yours.
            </p>
            <div className="mt-8">
              <a
                className="block md:inline text-center w-full md:w-auto text-white bg-blue-900 px-8 py-2 font-medium"
                href={`https://bill-clinton-swag.myshopify.com/cart/${selectedProduct.id}:1?attributes[swag]=${swag}`}>
                Buy now
              </a>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-16">
        <hr className="mx-auto" style={{ width: '250px' }} />
        <div className="max-w-screen-lg mx-auto px-4 md:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center text-gray-800">
            <a className="mx-2" href="mailto:millar.thomas+bcs@gmail.com" target="_blank">
              Contact
            </a>
            <a className="mx-2" href="https://twitter.com/thmsmlr" target="_blank">
              Twitter
            </a>
          </div>
          <p className="mt-8 text-gray-700 text-sm">
            ® 2020 Bill Clinton Swag
            <br />
            All rights reserved
          </p>
        </div>
      </footer>

      <Modal open={isModalShowing} onClose={() => showModal(false)}>
        <div className="inline md:block" style={{ width: '35vw' }}>
          <table className="w-full font-light text-center">
            <thead>
              <tr className="text-gray-800 font-medium tracking-wide">
                <td></td>
                <td className="py-1">Length (inches)</td>
                <td>Width (inches)</td>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map(x => (
                <tr key={x.id} className="py-2">
                  <td className="text-gray-800 font-medium tracking-wide py-1">{x.size}</td>
                  <td>{x.length}</td>
                  <td>{x.width}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </Layout>
  );
};
