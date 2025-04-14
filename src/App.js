import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [crawlDepth, setCrawlDepth] = useState(1);
  const [scanSummary, setScanSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [email, setEmail] = useState('');

  const handleScan = () => {
    setLoading(true);
    // Simulate scan API call
    setTimeout(() => {
      setScanSummary({
        statusCode: 200,
        serverType: 'Apache',
        issues: ['SQL Injection vulnerability']
      });
      setLoading(false);
    }, 3000);
  };

  const handleDownloadReport = () => {
    // Implement PDF download logic here
    console.log('Downloading report...');
  };

  const handleSendReport = () => {
    // Implement send report via Gmail logic here
    console.log('Sending report to:', email);
  };

  return (
    <div className="container mx-auto p-4 mt-4">
      <h1 className="text-3xl font-bold mb-4">Basic Website Pen Testing App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Scan a Website</h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter target URL"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            value={crawlDepth}
            onChange={(e) => setCrawlDepth(e.target.value)}
            placeholder="Crawl depth"
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
          {scanSummary && (
            <div className="mt-2">
              <h3 className="font-bold">Scan Summary:</h3>
              <p>Status Code: {scanSummary.statusCode}</p>
              <p>Server Type: {scanSummary.serverType}</p>
              <p>Issues: {scanSummary.issues.join(', ')}</p>
            </div>
          )}
        </div>
        <div className="card p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">View Reports</h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{report.url}</td>
                  <td className="border px-4 py-2">{report.status}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={handleDownloadReport}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Send Report via Gmail</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient email"
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleSendReport}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
