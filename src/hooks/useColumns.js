import { useState, useEffect, useCallback } from 'react';

export default function useColumns(labels) {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    setColumns(labels.reduce((acc, label) => {
      acc[label] = { show: true };
      return acc;
    }, {}));
  }, [labels]);

  const toggleColumn = useCallback((label) => {
    setColumns(prevColumns => ({
      ...prevColumns,
      [label]: {
        ...prevColumns?.[label],
        show: !prevColumns?.[label]?.show
      }
    }));
  }, []);

  return { columns, toggleColumn };
}
