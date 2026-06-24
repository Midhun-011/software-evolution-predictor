import client from './client';

function downloadBlob(response, filename) {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const reportAPI = {
  downloadPDF: (type) =>
    client.get(`/reports/pdf/${type}`, { responseType: 'blob' }).then((r) => {
      downloadBlob(r, `${type}-report.pdf`);
    }),
  downloadExcel: (type) =>
    client.get(`/reports/excel/${type}`, { responseType: 'blob' }).then((r) => {
      downloadBlob(r, `${type}-report.xlsx`);
    }),
  downloadCSV: (type) =>
    client.get(`/reports/csv/${type}`, { responseType: 'blob' }).then((r) => {
      downloadBlob(r, `${type}-report.csv`);
    }),
};
