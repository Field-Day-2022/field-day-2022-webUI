// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';

export default function Table({ tableName, collectionName }) {
    const [entries, setEntries] = useState([]);
    const [lastVisibleDocument, setLastVisibleDocument] = useState();
    const [batchSize, setBatchSize] = useState(15);

    const sessionLabels = [
        'Date & Time',
        'Recorder',
        'Handler',
        'Site',
        'Array',
        'No Captures',
        'Trap Status',
        'Comments',
    ];

    useEffect(() => {
        const loadInitialEntries = async () => {
            const initialQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                limit(batchSize)
            );
            const initialQuerySnapshot = await getDocs(initialQuery);
            setEntries(initialQuerySnapshot.docs);
            const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
            setLastVisibleDocument(lastVisibleDoc);
        };
        loadInitialEntries();
    }, []);

    const loadNextBatch = async () => {
        const nextBatchQuery = query(
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            startAfter(lastVisibleDocument),
            limit(batchSize)
        );
        const nextBatchSnapshot = await getDocs(nextBatchQuery);
        setEntries(nextBatchSnapshot.docs);
        const lastVisibleDoc = nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1];
        setLastVisibleDocument(lastVisibleDoc);
    };

    return (
        <div  className="bg-slate-200 border-spacing-2 border border-black">
            <table>
                <thead>
                    <tr>
                        <TableHeading label="Actions" />
                        {tableName === 'Session' &&
                            sessionLabels.map((label) => <TableHeading key={label} label={label} />)}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <Entry key={entry.id} entrySnapshot={entry} tableName={tableName} />
                    ))}
                </tbody>
            </table>
            <Pagination 
                batchSize={batchSize}
                setBatchSize={setBatchSize}
                loadNextBatch={loadNextBatch}
            />
        </div>
    );
}

const Pagination = ({
    batchSize,
    setBatchSize,
    loadNextBatch,
}) => {
    const [ batchSizeOptionsShown, setBatchSizeOptionsShown ] = useState(false);


    return (
        <div className="w-full p-2 flex justify-end items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

            <div className='relative p-2'>
                <button 
                    className="peer cursor-pointer border-[1px] border-gray-400 rounded-xl drop-shadow-lg p-2 active:scale-100 transition hover:scale-110"
                    onClick={() => setBatchSizeOptionsShown(!batchSizeOptionsShown)}
                >{`${batchSize} Rows`}</button>            
                {batchSizeOptionsShown && 
                <ul className="absolute p-2 rounded-xl w-24 -left-1 text-center bg-white/90 drop-shadow-2xl">
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => setBatchSize(15)}>15 Rows</li>
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => setBatchSize(50)}>50 Rows</li>
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => setBatchSize(100)}>100 Rows</li>
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => setBatchSize('all')}>All Rows</li>
                </ul>}
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadNextBatch}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>

        </div>
    )
}



const TableHeading = ({ label }) => {
    return <th className="border-b border-gray-800 p-2 text-sm text-gray-600 font-semibold">{label}</th>;
};

const Entry = ({ entrySnapshot, tableName }) => {
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());

    // console.log(entryData);

    const SESSION_KEYS = [
        'dateTime',
        'recorder',
        'handler',
        'site',
        'array',
        'noCaptures',
        'trapStatus',
        'commentsAboutTheArray',
    ];

    const onEditClickedHandler = () => {
        console.log('Edit clicked');
        setCurrentState('editing');
    };

    const onDeleteClickedHandler = () => {
        console.log('Delete clicked');
        setCurrentState('deleting');
    };

    const onSaveClickedHandler = () => {
        console.log('Save clicked');
    };

    const onCancelClickedHandler = () => {
        console.log('Cancel clicked');
        setCurrentState('viewing');
    };

    return (
        <tr>
            {currentState === 'viewing' ? (
                <EditDeleteActions
                    onEditClickedHandler={onEditClickedHandler}
                    onDeleteClickedHandler={onDeleteClickedHandler}
                />
            ) : currentState === 'editing' ? (
                <SaveCancelActions
                    onSaveClickedHandler={onSaveClickedHandler}
                    onCancelClickedHandler={onCancelClickedHandler}
                />
            ) : null}
            {tableName === 'Session'
                ? SESSION_KEYS.map((key) => (
                      <EntryItem
                          entrySnapshot={entrySnapshot}
                          currentState={currentState}
                          dbKey={key}
                          entryData={entryData}
                          setEntryData={setEntryData}
                          key={key}
                      />
                  ))
                : null}
        </tr>
    );
};

const EntryItem = ({ entrySnapshot, dbKey, currentState, setEntryData, entryData }) => {
    const [displayText, setDisplayText] = useState('');
    const [editable, setEditable] = useState(true);

    const BINARY_KEYS = ['noCaptures', 'isAlive'];
    const TRUE_KEYS = ['Y', 'y', 'T','t'];
    const FALSE_KEYS = ['N', 'n', 'F', 'f'];

    useEffect(() => {
        setDisplayText(entrySnapshot.data()[dbKey]);
        if (dbKey === 'dateTime') {
            let tempDate = new Date(entrySnapshot.data()[dbKey]);
            setDisplayText(tempDate.toLocaleString());
            setEditable(false);
        }
    }, []);

    const onChangeHandler = (e) => {
        console.log(e.target.value)
        if (BINARY_KEYS.includes(dbKey)) {
            if (TRUE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'true'
                }))
            } else if (FALSE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'false'
                }))
            }
        } else {
            setEntryData((prevEntryData) => ({
                ...prevEntryData,
                [dbKey]: e.target.value,
            }));
        }
    }

    let disabled = false;

    if (currentState === 'viewing' || (currentState === 'editing' && !editable)) {
        disabled = true;
    }

    return (
        <td key={dbKey} className="text-center border-b border-gray-400 p-2">
            <input
                disabled={disabled}
                className="text-center transition disabled:bg-transparent outline-none rounded-lg"
                type="text"
                value={entryData[dbKey]}
                onChange={e => onChangeHandler(e)}
                size={entryData[dbKey].length || 1}
            />
        </td>
    );
};

const EditDeleteActions = ({ onEditClickedHandler, onDeleteClickedHandler }) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-between">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                    onClick={() => onEditClickedHandler()}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                    onClick={() => onDeleteClickedHandler()}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
            </div>
        </td>
    );
};

const SaveCancelActions = ({ onSaveClickedHandler, onCancelClickedHandler }) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-between">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                    onClick={() => onSaveClickedHandler()}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                    />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                    onClick={() => onCancelClickedHandler()}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </td>
    );
};