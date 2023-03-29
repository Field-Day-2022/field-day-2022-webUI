import { useState, useEffect, useCallback } from 'react';

export function useEntryFilter(initialEntries) {
    const [filteredEntries, setFilteredEntries] = useState(initialEntries);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setFilteredEntries(initialEntries);
        setFilter('');
    }, [initialEntries]);

    const handleFilterChange = useCallback((e) => {
        setFilter(e.target.value);
    }, []);

    useEffect(() => {
        if (filter === '') {
            setFilteredEntries(initialEntries);
        } else {
            setFilteredEntries(initialEntries.filter((entry) => {
                return Object.values(entry).some((value) => {
                    return value?.toString().toLowerCase().includes(filter.toLowerCase());
                });
            }));
        }
    }, [filter, initialEntries]);

    return { filteredEntries, filter, handleFilterChange };
}