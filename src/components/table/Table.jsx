import React from 'react';
import { ExportIcon } from '../../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../table/ColumnSelectorButton';
import { TableEntry } from '../table/TableEntry';
import { TableHeading } from '../table/TableHeading';
import { SearchField } from '../forms/Fields';
import { useColumns, usePagination, useSearch } from '../../utils/usePagination';
import { tableBody } from '../../const/animationVariants';

export const Table = ({ name }) => {
    const { getLabels, entries } = usePagination();
    const { columns, toggleColumnVisibility } = useColumns();
    const { search, setSearch, filteredEntries } = useSearch();

    const {
        sortedColumn,
        sortOrder,
        setSortedColumn,
        sortedEntries,
        toggleSortOrder,
    } = useColumns();

    const onClick = (label) => {
        if (sortedColumn === label) {
            toggleSortOrder();
        } else {
            setSortedColumn(label);
        }
    };

    const tableHeadings = getLabels().filter((label) => columns[label]?.show);

    const tableRows = sortedEntries(filteredEntries(entries, search)).map((entry, index) => (
        <TableEntry
            key={entry.id}
            index={index}
            entrySnapshot={entry}
            shownColumns={tableHeadings}
            tableName={name}
        />
    ));

    const tableHeadingsMarkup = tableHeadings.map((label) => (
        <TableHeading
            key={label}
            label={label}
            active={sortedColumn === label}
            sortDirection={sortOrder}
            onClick={() => onClick(label)}
        />
    ));

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <SearchField setField={(e) => setSearch(e)} />

                    <ColumnSelectorButton
                        labels={getLabels()}
                        columns={columns}
                        toggleColumn={toggleColumnVisibility}
                    />
                    <ExportIcon />

                </div>
            </div>
            <div className="overflow-auto w-full h-table">
                <table className="w-full table-auto border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {tableHeadingsMarkup}
                        </tr>
                    </thead>
                    <motion.tbody initial="hidden" animate="visible" variants={tableBody}>
                        {tableRows}
                    </motion.tbody>
                </table>
            </div>
        </motion.div>
    );
};