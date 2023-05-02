import { getKey } from '../const/tableLabels';
import { getCollectionNameFromDoc } from './firestore';

export const generateCSV = (labels, entries, name) => {
  if (!labels || !entries) {
    return [];
  }
  let csvData = [];
  csvData.push(labels);
  entries.forEach((entry) => {
    let row = [];
    labels.forEach((label) => {
      if (label !== 'Actions') {
        let key = getKey(label, name);
        row.push(entry.data()[key]);
      }
    });
    csvData.push(row);
  });
  return csvData;
};

export const getCSVName = (entry, name) => {
  if (!entry) {
    return '';
  }
  const collectionName = getCollectionNameFromDoc(entry);
  const dateTime = new Date().toLocaleString();
  if (name === 'Session') {
    return collectionName + ' ' + dateTime;
  } else {
    return collectionName.slice(0, -4) + name + ' ' + dateTime;
  }
};

export const QuickExportButton = () => {
  return (
    <CSVLink
      className='hover:scale-125 transition h-8 cursor-pointer'
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