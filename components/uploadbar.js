import { useState, useEffect, useRef, forwardRef } from 'react';

export default forwardRef(({ onSelect, ...rest }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  let results = [];

  function onChange([file]) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload =  e => {
        const res = e.target.result;
        setSelectedIndex(-1);
        onSelect({
            url: res
        });
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <form
        className={
          'z-50 bg-white md:relative relative' 
        }
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (selectedIndex !== -1) {
            setSelectedIndex(-1);
            onSelect(results[selectedIndex]);
          }
        }}>
        <input
          tabIndex={0}
          ref={ref}
          type="file"
          onChange={e => onChange(e.target.files)}
          className={
            'appearance-none focus:outline-none sm:block text-sm border border-gray-400 w-full py-2 px-4 '
          }
          {...rest}
        />
      </form>
    </>
  );
});
