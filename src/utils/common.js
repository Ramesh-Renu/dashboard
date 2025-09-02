import * as XLSX from 'xlsx';

export const getLast30DaysDate = (date = new Date()) => {
  // Clone the date to avoid modifying the original one
  const last30DaysDate = new Date(date);
  last30DaysDate.setDate(date.getDate() - 30); // Subtract 30 days

  // Format the date as YYYY-MM-DD
  const formattedDate = `${last30DaysDate.getFullYear()}-${String(
    last30DaysDate.getMonth() + 1
  ).padStart(2, "0")}-${String(last30DaysDate.getDate()).padStart(2, "0")}`;

  return formattedDate;
};

/** USED TO GENERATE EXCEL FILE AND PERFORM DOWNLOAD */
export const generateExcelFile = (data, reportName=null) => {

  const ws = XLSX.utils.aoa_to_sheet(data);
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '');
  const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }).replace(/:/g, '');
  const filename = reportName || `Report_${formattedDate}${formattedTime}.xlsx`;
  
  // Create a Blob from the binary string and download
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xff;
  }
  const blob = new Blob([buf], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}