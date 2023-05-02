import { useCallback } from 'react';
import { getValue } from '../components/TableEntry';

export default function useFilteredEntries(entries, search, labels) {
    return useCallback(
        (entries, search) => {
            if (search === '') {
                return entries;
            }

            return entries.filter((entry) => {
                return labels.some((label) => {
                    const entryValue = getValue(entry, label);
                    return entryValue?.toString().toLowerCase().includes(search.toLowerCase());
                });
            });
        },
        [labels]
    )(entries, search);
}
