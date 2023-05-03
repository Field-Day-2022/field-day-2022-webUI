import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputLabel from './InputLabel';

const ColumnSelector = ({ show, labels, columns, setShow, toggleColumn }) => {
  const ref = useRef();

  const handleClickOutside = useCallback(
    (event) => {
      if (show && !ref.current.contains(event.target)) {
        setShow(false);
      }
    },
    [show, setShow]
  );

  const getShownColumnCount = useCallback(() => {
    return Object.values(columns).reduce(
      (count, column) => count + (column.show ? 1 : 0),
      0
    );
  }, [columns]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="column-selector"
          className="flex items-center space-x-5 absolute z-50 bg-white rounded-md shadow-md overflow-auto"
          initial={{ opacity: 0, y: '-100%', x: '-100%' }}
          animate={{ opacity: 1, y: '0%', x: '-100%' }}
          exit={{ opacity: 0, y: '-100%', x: '-100%' }}
          ref={ref}
        >
          <div className="flex-col space-y-2 whitespace-nowrap max-h-full-column-selector-height">
            <h1 className="text-xl pt-2 px-4">Column Selector</h1>
            {labels &&
              labels.map((label) => (
                <div key={label} className="hover:bg-neutral-100 px-6">
                  <InputLabel
                    label={label}
                    orientation="horizontal"
                    input={
                      <input
                        type="checkbox"
                        checked={columns[label]?.show}
                        disabled={
                          getShownColumnCount() === 1 && columns[label].show
                        }
                        onChange={() => {
                          toggleColumn(label);
                        }}
                      />
                    }
                  />
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColumnSelector;
