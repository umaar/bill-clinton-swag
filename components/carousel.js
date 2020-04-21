import { useState, useLayoutEffect, useRef } from 'react';

const isBrowser = typeof window !== `undefined`;

function getScrollPosition({ element, useWindow }) {
  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element.current : document.body;

  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: target.scrollLeft, y: target.scrollTop };
}

function useScrollPosition(effect, deps, element, useWindow, wait) {
  const position = useRef(getScrollPosition({ useWindow }));

  let throttleTimeout = null;

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };

    if (element.current) {
      element.current.addEventListener('scroll', handleScroll);
      return () => element.current.removeEventListener('scroll', handleScroll);
    }
  }, deps);
}

const Carousel = ({ className, children = [] }) => {
  const carouselRef = useRef();
  const childRefs = children.map(x => useRef());
  const [pageIndex, setPageIndex] = useState(0);

  useScrollPosition(
    ({ currPos }) => {
      if (carouselRef && carouselRef.current) {
        setPageIndex(Math.round((currPos.x / carouselRef.current.scrollWidth) * children.length));
      }
    },
    [],
    carouselRef,
    false,
    500
  );

  const scrollToPage = pageIndex => {
    const ref = childRefs[pageIndex];
    if (ref && ref.current) {
      setPageIndex(pageIndex);
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  return (
    <div className={className + ' relative'}>
      <div className="carousel select-none flex items-center" ref={carouselRef}>
        {children.map((child, idx) => (
          <div key={idx} ref={childRefs[idx]} className="inline-block">
            {child}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 mb-3 w-full flex justify-around select-none">
        <ul className="flex">
          {children.map((child, idx) => (
            <li
              key={idx}
              className="w-6 h-1 mx-1"
              onClick={() => scrollToPage(idx)}
              style={{
                backgroundColor:
                  pageIndex === idx ? 'rgba(162, 182, 208, 0.5)' : 'rgba(211,220,231,0.4)'
              }}
            />
          ))}
        </ul>
      </div>
      <div
        className="absolute left-0 pl-8 top-0 h-full items-center arrow-wrapper flex select-none"
        onClick={() => scrollToPage((pageIndex + children.length - 1) % children.length)}>
        <div className="left arrow" />
      </div>
      <div
        className="absolute right-0 pr-8 top-0 h-full items-center arrow-wrapper flex select-none"
        onClick={() => scrollToPage((pageIndex + 1) % children.length)}>
        <div className="right arrow" />
      </div>
      <style jsx>
        {`
          .carousel {
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
          }

          .carousel::-webkit-scrollbar {
            display: none;
          }

          .carousel > * {
            scroll-snap-align: start;
            min-width: 100%;
          }

          .arrow {
            border: solid black;
            border-width: 0 6px 6px 0;
            display: inline-block;
            padding: 6px;
            border-color: rgba(162, 182, 208, 0.5);
          }

          .arrow-wrapper {
            cursor: pointer;
          }

          .arrow-wrapper:hover .arrow {
            border-color: rgba(255, 255, 255, 0.9);
          }

          .left {
            transform: rotate(135deg);
          }
          .right {
            transform: rotate(-45deg);
          }

          @media (hover: none) {
            .arrow-wrapper {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Carousel;
