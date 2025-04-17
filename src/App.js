import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [crawlDepth, setCrawlDepth] = useState(1); // Keep crawlDepth state if needed later
  const [scanResults, setScanResults] = useState(null); // Renamed state for clarity
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setScanResults(null); // Clear previous results

    if (!url) {
      setError('Please enter a URL.');
      setLoading(false);
      return;
    }

    let hostname;
    try {
      // Ensure URL has a protocol for URL constructor
      const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      hostname = new URL(fullUrl).hostname;
    } catch (e) {
      setError('Invalid URL format.');
      setLoading(false);
      return;
    }

    const results = {
      dns: null,
      ipInfo: null,
      robots: null,
      whois: 'Whois lookup not implemented.', // Placeholder
      subdomains: 'Subdomain enumeration not implemented.', // Placeholder
    };

    try {
      // 1. DNS Lookup (A record via Cloudflare DoH)
      const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
        headers: { 'accept': 'application/dns-json' }
      });
      if (!dnsResponse.ok) throw new Error(`DNS query failed: ${dnsResponse.statusText}`);
      const dnsData = await dnsResponse.json();
      results.dns = dnsData.Answer ? dnsData.Answer.map(a => a.data) : 'No A records found.';

      // 2. IP Info (using the first IP from DNS)
      if (Array.isArray(results.dns) && results.dns.length > 0) {
        const ip = results.dns[0];
        const ipResponse = await fetch(`http://ip-api.com/json/${ip}`);
        if (!ipResponse.ok) throw new Error(`IP info query failed: ${ipResponse.statusText}`);
        results.ipInfo = await ipResponse.json();
      } else {
        results.ipInfo = 'Could not get IP for info lookup.';
      }

      // 3. Robots.txt Discovery
      try {
        const robotsResponse = await fetch(`${url.startsWith('http') ? '' : 'https://'}${hostname}/robots.txt`);
        if (robotsResponse.ok) {
          results.robots = await robotsResponse.text();
        } else if (robotsResponse.status === 404) {
          results.robots = 'robots.txt not found (404).';
        } else {
          results.robots = `Error fetching robots.txt: ${robotsResponse.statusText}`;
        }
      } catch (robotsError) {
        results.robots = `Error fetching robots.txt: ${robotsError.message}`;
      }

      setScanResults(results);

    } catch (err) {
      console.error("Scan error:", err);
      setError(`Scan failed: ${err.message}`);
      // Keep partial results if any
      setScanResults(results);
    } finally {
      setLoading(false);
    }
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {scanResults && (
            <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
              <h3 className="font-bold text-lg mb-2">Scan Results:</h3>
              <div>
                <h4 className="font-semibold">DNS (A Records):</h4>
                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{JSON.stringify(scanResults.dns, null, 2)}</pre>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">IP Info:</h4>
                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{JSON.stringify(scanResults.ipInfo, null, 2)}</pre>
              </div>
               <div className="mt-2">
                 <h4 className="font-semibold">Whois:</h4>
                 <p className="text-gray-600">{scanResults.whois}</p>
               </div>
               <div className="mt-2">
                 <h4 className="font-semibold">Subdomains:</h4>
                 <p className="text-gray-600">{scanResults.subdomains}</p>
               </div>
              <div className="mt-2">
                <h4 className="font-semibold">Robots.txt:</h4>
                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-40 overflow-auto">{scanResults.robots || 'Not found or error fetching.'}</pre>
              </div>
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
              {/* Example report data */}
              <tr>
                <td className="border px-4 py-2">https://example.com</td>
                <td className="border px-4 py-2">Completed</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={handleDownloadReport}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
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
