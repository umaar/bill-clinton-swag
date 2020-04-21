import Link from 'next/link';

export default () => (
  <>
    <Link href="/">
      <a className="flex items-center ">
        <header className="text-center cursor-pointer text-gray-900">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold leading-none tracking-wide">
            Bill Clinton Swag
          </h1>
          <span className="text-xs sm:text-base font-light block xs:-mt-1 -ml-6 sm:-ml-4 italic">
            "I did not have sexual relations,
            <br className="xs:hidden" /> for the record"
          </span>
        </header>
      </a>
    </Link>
  </>
);
