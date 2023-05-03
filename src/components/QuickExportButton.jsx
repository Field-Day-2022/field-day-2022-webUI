import { CSVLink } from 'react-csv';
import { ExportIcon } from '../assets/icons';
import { generateCSV, getCSVName } from '../utils/csv';

export const QuickExportButton = ({ labels, entries }) => {
    return (
        <CSVLink
            className="hover:scale-125 transition h-8 cursor-pointer"
            data={generateCSV(labels, entries)}
            filename={getCSVName(entries[0]) + '.csv'}
            onClick={() => {
                if (generateCSV(labels, entries).length === 0) {
                    notify(Type.error, 'No data to export');
                } else {
                    notify(Type.success, 'Exported data to CSV');
                }
            }}
        >
            <ExportIcon />
        </CSVLink>
    );
};
