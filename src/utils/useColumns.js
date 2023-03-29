import { useState, useEffect, useCallback } from 'react';
import { useTable } from './useTable';

export const useColumns = (labels, initialEntries) => {
    
    const [processedEntries, setProcessedEntries] = useState(initialEntries);
    const [filter, setFilter] = useState('');
    const [columns, setColumns] = useState({});
    const [sortedColumn, setSortedColumn] = useState(undefined);
    const [sortDirection, setSortDirection] = useState('asc');
    const { getEntryValue } = useTable();
    
    useEffect(() => {
        setProcessedEntries(initialEntries);
        setFilter('');
    }, [initialEntries]);

    const handleFilterChange = useCallback((e) => {
        setFilter(e.target.value);
    }, []);

    useEffect(() => {
        console.log('Sorting and filtering: ', filter, sortedColumn, sortDirection, '')
        if (filter === '' && sortedColumn === undefined) {
            setProcessedEntries(initialEntries);
        } else {
            setProcessedEntries(
                sortedEntries(filteredEntries(initialEntries))
            );
        }
    }, [filter, initialEntries, sortedColumn, sortDirection]);


    const filteredEntries = useCallback((entries) => {
        if (filter === '') {
            return entries;
        } else {
            return entries.filter((entry) => {
                return Object.values(entry).some((value) => {
                    return value?.toString().toLowerCase().includes(filter.toLowerCase());
                });
            });
        }
    }, [filter]);


    useEffect(() => {
        setColumns(
            labels.reduce((acc, label) => {
                acc[label] = { show: true };
                return acc;
            }, {})
        );
    }, [labels]);

    const getShownColumns = useCallback((columns) => {
        return Object.keys(columns).reduce((acc, key) => {
            if (columns[key].show) {
                acc[key] = columns[key];
            }
            return acc;
        }, {});
    }, []);

    const toggleColumnVisibility = useCallback((label) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [label]: {
                ...prevColumns?.[label],
                show: !prevColumns?.[label]?.show,
            },
        }));
    }, []);


    const sortByColumn = useCallback(
        (column) => {
            const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            setSortedColumn(column);
            setSortDirection(newSortDirection);
        },
        [sortDirection, sortedColumn]
    );

    const sortedEntries = useCallback((entries) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getEntryValue(a, sortedColumn) > getEntryValue(b, sortedColumn)) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            if (getEntryValue(a, sortedColumn) < getEntryValue(b, sortedColumn)) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    }, []);

    return {
        columns,
        getShownColumns,
        toggleColumnVisibility,
        sortDirection,
        sortByColumn,
        sortedEntries,
        processedEntries,
        handleFilterChange,
    };
};
