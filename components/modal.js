import { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const duration = 250;

export default ({ children, open, onClose }) => {
  useLayoutEffect(() => {
    if (open) {
      document.body.style.cssText = `position: fixed; top: -${window.scrollY}px; width: 100%;`;

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = ``;
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [open]);

  return createPortal(
    <>
      <CSSTransition in={open} classNames="modal-transition" unmountOnExit timeout={duration}>
        <div className="fixed inset-0 flex justify-center items-end md:items-center z-40">
          <div className="backdrop bg-tint-400 z-30" onClick={onClose} />
          <div className="modal w-full md:w-auto z-50 bg-white shadow md:rounded pt-6 pb-12 md:pb-6 px-6 ">
            {children}
          </div>
        </div>
      </CSSTransition>
      <style jsx global>
        {`
          .backdrop {
            height: 120%;
            bottom: 0;
            left: 0;
            right: 0;
            position: fixed;
          }

          .modal-transition-enter .modal {
            transform: translateY(calc(100% - 30px));
          }
          .modal-transition-enter-active .modal {
            transition: transform ${duration}ms;
            transform: translateY(0);
          }
          .modal-transition-exit .modal {
            transform: translateY(0);
          }
          .modal-transition-exit-active .modal {
            transition: transform ${duration}ms;
            transform: translateY(calc(100%));
          }

          .modal-transition-enter .backdrop {
            opacity: 0;
          }
          .modal-transition-enter-active .backdrop {
            transition: opacity ${duration}ms;
            opacity: 1;
          }
          .modal-transition-exit .backdrop {
            opacity: 1;
          }
          .modal-transition-exit-active .backdrop {
            transition: opacity ${duration}ms;
            opacity: 0;
          }

          @media (min-width: 768px) {
            .modal-transition-enter .modal {
              transform: translateY(calc(20%));
              opacity: 0;
            }
            .modal-transition-enter-active .modal {
              transition: transform ${duration}ms, opacity ${duration}ms;
              transform: translateY(0);
              opacity: 1;
            }
            .modal-transition-exit .modal {
              transform: translateY(0);
              opacity: 1;
            }
            .modal-transition-exit-active .modal {
              transition: transform ${duration}ms, opacity ${duration}ms;
              transform: translateY(calc(20%));
              opacity: 0;
            }
          }
        `}
      </style>
    </>,
    document.body
  );
};
