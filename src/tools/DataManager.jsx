import React from 'react';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { Table } from '../components/Table';
import { SearchField } from '../components/FormFields';
import useColumns from '../hooks/useColumns';
import useSearch from '../hooks/useSearch';
import useFilteredEntries from '../hooks/useFilteredEntries';
import { QuickExportButton } from '../components/QuickExportButton';

export default function DataManager({ name, labels = [], entries = [], setEntries }) {
  const { columns, toggleColumn } = useColumns(labels);
  const { search, handleSearchChange } = useSearch();
  const filteredEntries = useFilteredEntries(entries, search, labels);

  return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <SearchField search={search} setSearch={handleSearchChange} />
                    <div className='flex justify-center text-2xl'>
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumn}
                        />
                        <QuickExportButton 
                            labels={labels}
                            entries={entries}
                        />
                    </div>

                </div>
            </div>
            <div className="overflow-auto w-full h-full-table">
                <Table
                    labels={labels}
                    columns={columns}
                    entries={filteredEntries}
                    name={name}
                    setEntries={setEntries}
                />
            </div>
        </motion.div>
    );
}