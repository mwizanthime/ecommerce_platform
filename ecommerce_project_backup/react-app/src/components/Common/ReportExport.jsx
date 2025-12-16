// src/components/Common/ReportExport.jsx
import React, { useState } from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ReportExport = ({ 
  tableId, 
  fileName, 
  pageTitle,
  showPeriod = true,
  showDateRange = false,
  data = [],
  columns = []
}) => {
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const getReportPeriodDates = (period) => {
    const now = new Date();
    const start = new Date();
    
    switch(period) {
      case 'daily':
        start.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setDate(now.getDate() - 1);
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  const handlePrint = () => {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const clonedTable = table.cloneNode(true);
    // Remove action columns
    clonedTable.querySelectorAll("tr").forEach(row => {
      const lastCell = row.lastElementChild;
      if (lastCell && (lastCell.textContent.includes('Edit') || lastCell.textContent.includes('Delete') || lastCell.textContent.includes('Actions'))) {
        row.removeChild(lastCell);
      }
    });
    
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head><title>${fileName} - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .report-header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .report-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .report-subtitle { font-size: 14px; color: #666; margin-bottom: 10px; }
        .report-period { font-size: 12px; color: #888; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f3f4f6; text-align: left; padding: 10px; border: 1px solid #ddd; font-weight: bold; }
        td { padding: 8px 10px; border: 1px solid #ddd; }
        .print-date { text-align: right; font-size: 12px; color: #666; margin-top: 30px; }
      </style></head>
      <body>
        <div class="report-header">
          <div class="report-title">${fileName}</div>
          <div class="report-subtitle">${pageTitle || fileName}</div>
          <div class="report-period">Period: ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report</div>
        </div>
        ${clonedTable.outerHTML}
        <div class="print-date">Printed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
      </body></html>`);
    win.document.close();
    win.print();
  };

  const exportTableToWord = () => {
    const table = document.getElementById(tableId);
    const clonedTable = table.cloneNode(true);
    
    clonedTable.querySelectorAll("tr").forEach(row => {
      const lastCell = row.lastElementChild;
      if (lastCell && (lastCell.textContent.includes('Edit') || lastCell.textContent.includes('Delete') || lastCell.textContent.includes('Actions'))) {
        row.removeChild(lastCell);
      }
    });

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export to Word</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .report-header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .report-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .report-subtitle { font-size: 14px; color: #666; margin-bottom: 10px; }
        .report-period { font-size: 12px; color: #888; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f3f4f6; }
        .export-date { text-align: right; font-size: 12px; color: #666; margin-top: 30px; }
      </style>
      </head>
      <body>
        <div class="report-header">
          <div class="report-title">${fileName}</div>
          <div class="report-subtitle">${pageTitle || fileName}</div>
          <div class="report-period">Period: ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report | Generated: ${new Date().toLocaleDateString()}</div>
        </div>
        ${clonedTable.outerHTML}
        <div class="export-date">Exported: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${reportPeriod}_report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTableToPDF = () => {
    const table = document.getElementById(tableId);
    const clonedTable = table.cloneNode(true);
    
    clonedTable.querySelectorAll("tr").forEach(row => {
      const lastCell = row.lastElementChild;
      if (lastCell && (lastCell.textContent.includes('Edit') || lastCell.textContent.includes('Delete') || lastCell.textContent.includes('Actions'))) {
        row.removeChild(lastCell);
      }
    });

    const headers = Array.from(clonedTable.querySelectorAll("thead tr th")).map(th => th.innerText);
    const rows = Array.from(clonedTable.querySelectorAll("tbody tr")).map(tr =>
      Array.from(tr.querySelectorAll("td")).map(td => td.innerText)
    );

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`${fileName} - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report`, 14, 15);
    
    // Add subtitle
    doc.setFontSize(10);
    doc.text(pageTitle || fileName, 14, 22);
    
    // Add report period and date
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Period: ${reportPeriod}`, 14, 28);
    
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: 35 },
      theme: 'grid'
    });
    
    doc.save(`${fileName}_${reportPeriod}_report.pdf`);
  };

  const exportTableToExcel = () => {
    const table = document.getElementById(tableId);
    const clonedTable = table.cloneNode(true);
    
    clonedTable.querySelectorAll("tr").forEach(row => {
      const lastCell = row.lastElementChild;
      if (lastCell && (lastCell.textContent.includes('Edit') || lastCell.textContent.includes('Delete') || lastCell.textContent.includes('Actions'))) {
        row.removeChild(lastCell);
      }
    });
    
    const worksheet = XLSX.utils.table_to_sheet(clonedTable);
    const workbook = XLSX.utils.book_new();
    
    // Add metadata to first row
    const titleRow = [
      `${fileName} - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report`,
      '', '', '', '', '', '', ''
    ];
    const subtitleRow = [
      pageTitle || fileName,
      '', '', '', '', '', '', ''
    ];
    const dateRow = [
      `Generated: ${new Date().toLocaleDateString()} | Period: ${reportPeriod}`,
      '', '', '', '', '', '', ''
    ];
    
    XLSX.utils.sheet_add_aoa(worksheet, [titleRow, subtitleRow, dateRow, []], { origin: -1 });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileName}_${reportPeriod}_report.xlsx`);
  };

  const handleExport = (format) => {
    switch(format) {
      case 'word':
        exportTableToWord();
        break;
      case 'pdf':
        exportTableToPDF();
        break;
      case 'excel':
        exportTableToExcel();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Report Period Dropdown */}
      {showPeriod && (
        <div className="relative">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="yearly">Yearly Report</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      )}

      {/* Date Range Inputs */}
      {showDateRange && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {/* Print Button */}
      <div className="relative group">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>

      {/* Download Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 hidden group-hover:block">
          <button
            onClick={() => handleExport('word')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
            Word Document (.doc)
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            </svg>
            PDF Document (.pdf)
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
            Excel Spreadsheet (.xlsx)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;