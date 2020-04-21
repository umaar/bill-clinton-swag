export default ({ open = false, ...rest }) => {
  return (
    <div className="root" {...rest}>
      <div className={`line ${open && 'open'}`} />
      <div className={`line ${open && 'open'}`} />
      <style jsx>
        {`
          .root {
            height: 24px;
            widht: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
          .line {
            height: 1px;
            width: 18px;
            background-color: currentColor;
            transition: transform 0.15s ease 0s;
          }

          .line:first-child {
            transform: translateY(-3px) rotate(0deg);
          }

          .line:last-child {
            transform: translateY(3px) rotate(0deg);
          }

          .line.open:first-child {
            transform: translateY(0px) rotate(45deg);
          }
          .line.open:last-child {
            transform: translateY(0px) rotate(-45deg);
          }
        `}
      </style>
    </div>
  );
};
