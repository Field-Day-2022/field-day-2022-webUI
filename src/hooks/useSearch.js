import { useState, useCallback } from 'react';

export default function useSearch() {
    const [search, setSearch] = useState('');

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    return { search, handleSearchChange };
}
