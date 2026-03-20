// Documents.tsx
export default function Documents() {
  const docs = [
    { id: 'SHP2041', name: 'Bill of Lading – SHP2041', type: 'PDF', size: '2.4 MB', date: '2025-03-01' },
    { id: 'SHP2041', name: 'Commercial Invoice – SHP2041', type: 'PDF', size: '1.1 MB', date: '2025-03-01' },
    { id: 'SHP2042', name: 'Packing List – SHP2042', type: 'XLSX', size: '0.4 MB', date: '2025-02-20' },
    { id: 'SHP2043', name: 'Insurance Certificate – SHP2043', type: 'PDF', size: '0.9 MB', date: '2025-02-28' },
    { id: 'SHP2044', name: 'Bill of Lading – SHP2044', type: 'PDF', size: '2.1 MB', date: '2025-03-05' },
    { id: 'SHP2045', name: 'Customs Declaration – SHP2045', type: 'PDF', size: '1.6 MB', date: '2025-03-08' },
  ]
  const typeIcon: Record<string, string> = { PDF: '📄', XLSX: '📊', DOC: '📝' }
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Documents</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>All shipping documents — bills of lading, invoices, and more.</p></div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>{['Type', 'Document Name', 'Shipment', 'Size', 'Date', 'Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 20 }}>{typeIcon[d.type] ?? '📄'}</td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{d.id}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{d.size}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{d.date}</td>
                  <td><button className="btn btn-secondary btn-sm">⬇ Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
