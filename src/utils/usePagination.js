import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { limit, startAfter, startAt, where } from 'firebase/firestore';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from './jotai';
import { notify, Type } from '../components/Notifier';
import { keyLabelMap, TABLE_LABELS } from '../const/tableLabels';
import {
    getDocsFromCollection,
    updateDocInCollection,
    deleteDocFromCollection,
    getCollectionName,
} from './firestore';
import { useCallback } from 'react';

export const usePagination = () => {
    const batchSize = useAtomValue(currentBatchSize);
    const currentProject = useAtomValue(currentProjectName);
    const currentTable = useAtomValue(currentTableName);
    const environment = useAtomValue(appMode);

    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [entries, setEntries] = useState([]);
    const [collectionName, setCollectionName] = useState(
        getCollectionName(environment, currentProject, currentTable)
    );

    useEffect(() => {
        setCollectionName(getCollectionName(environment, currentProject, currentTable));
    }, [environment, currentProject, currentTable]);

    useEffect(() => {
        const loadBatch = async (constraints = []) => {
            if (!Array.isArray(constraints)) {
                constraints = [constraints];
            }

            const whereClause =
                currentTable !== 'Session' &&
                where('taxa', '==', currentTable === 'Arthropod' ? 'N/A' : currentTable);
            whereClause && constraints.push(whereClause);

            constraints.push(limit(batchSize));

            const { docs } = await getDocsFromCollection(collectionName, constraints);
            const lastVisibleDoc = docs[docs.length - 1];
            setEntries(docs);
            setDocumentQueryCursor(lastVisibleDoc);
        };

        console.log('Loading batch of entries from collection:', collectionName);
        console.log('Batch size:', batchSize);
        loadBatch();
    }, [collectionName, batchSize, currentTable]);

    const deleteEntry = (docId) => {
        deleteDocFromCollection(collectionName, docId);
        setEntries(entries.filter((entry) => entry.id !== docId));
    };

    const updateEntry = (docId, data) => {
        updateDocInCollection(collectionName, docId, data);
        setEntries(
            entries.map((entry) => {
                if (entry.id === docId) {
                    return { ...entry, data };
                }
                return entry;
            })
        );
    };

    const getEntryValue = (entry, key) => {
        if (key === 'dateTime') {
            return entry.data().dateTime.toDate();
        }
        return entry.data()[key];
    };

    const getLabel = (key) => {
        if (key === 'commentsAboutTheArray' && currentTable === 'Session') {
            return 'Comments';
        }
        return keyLabelMap[key];
    };

    const getLabels = () => {
        return TABLE_LABELS[currentTable];
    };

    const getKey = (label) => {
        if (label === 'Comments' && currentTable === 'Session') {
            return 'commentsAboutTheArray';
        }
        return Object.keys(keyLabelMap).find((key) => keyLabelMap[key] === label);
    };

    const getKeys = () => {
        const labels = TABLE_LABELS[currentTable];
        return labels.map((label) => getKey(label, currentTable));
    };

    const loadPrevBatch = async () => {
        if (queryCursorStack.length === 0) {
            notify(Type.error, 'Unable to go back. This is the first page.');
            return;
        }
        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        setQueryCursorStack(queryCursorStack.slice(0, -1));
        await loadBatch(startAt(prevQueryCursor));
    };

    const loadNextBatch = async () => {
        setQueryCursorStack([...queryCursorStack, entries[0]]);
        await loadBatch(startAfter(documentQueryCursor));
    };

    return {
        entries,
        setEntries,
        updateEntry,
        deleteEntry,
        loadPrevBatch,
        loadNextBatch,
        getEntryValue,
        getKey,
        getKeys,
        getLabel,
        getLabels
    };
};

export const useColumns = () => {
    const { entries, getEntryValue, getKey, getLabels } = usePagination();
    
    const [columns, setColumns] = useState({});
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const sortedEntries = () => {
        if (!sortedColumn) {
            return entries;
        }
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            const aValue = getEntryValue(a, getKey(sortedColumn));
            const bValue = getEntryValue(b, getKey(sortedColumn));
            if (aValue < bValue) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        setColumns(
            getLabels().reduce((acc, label) => {
                acc[label] = { show: true };
                return acc;
            }, {})
        );
    }, [getLabels()]);

    const toggleColumnVisibility = (label) => {
        setColumns({
            ...columns,
            [label]: {
                ...columns[label],
                show: !columns[label].show,
            },
        });
    };

    return {columns, toggleColumnVisibility, sortedColumn, setSortedColumn, toggleSortOrder, sortedEntries};
};

export const useSearch = () => {
    const [search, setSearch] = useState('');
    const { getEntryValue, getLabels } = usePagination();
    const filteredEntries = useCallback((entries, search) => {
        if (search === '') {
            return entries;
        }
        return entries.filter((entry) => {
            return getLabels().some((label) => {
                const entryValue = getEntryValue(entry, label);
                return entryValue?.toString().toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [getLabels()]);
    return { search, setSearch, filteredEntries };
};
