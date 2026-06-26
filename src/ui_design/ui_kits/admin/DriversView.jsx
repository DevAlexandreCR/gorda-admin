// Drivers view — searchable roster table with avatars, status badges & row actions.
function DriversView({ onEditDriver }) {
  const { Card, Avatar, Badge, Button, Switch } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [enabledMap, setEnabledMap] = React.useState(
    Object.fromEntries(data.drivers.map((d) => [d.id, d.enabled]))
  );

  const rows = data.drivers.filter((d) => {
    const matchQ = (d.name + d.email + d.plate).toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' || (filter === 'enabled' ? enabledMap[d.id] : !enabledMap[d.id]);
    return matchQ && matchF;
  });

  const th = { textAlign: 'left', textTransform: 'uppercase', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.02rem', color: '#8392ab', padding: '0.6rem 0.75rem', borderBottom: '1px solid #e9ecef' };
  const td = { padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#67748e', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'enabled', label: 'Enabled' },
    { id: 'disabled', label: 'Disabled' },
  ];

  return (
    <Card padding="0">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1rem 0.75rem', flexWrap: 'wrap' }}>
        <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#344767' }}>Drivers · {data.drivers.length}</h6>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #d2d6da', borderRadius: '0.5rem', padding: '0.4rem 0.7rem', width: 220 }}>
          <em className="fas fa-magnifying-glass" style={{ color: '#8392ab', fontSize: '0.78rem' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search drivers..." style={{ border: 'none', outline: 'none', fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem', width: '100%', color: '#495057' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '0.35rem 0.8rem', borderRadius: '50rem', border: '1px solid', cursor: 'pointer',
              fontFamily: "'Open Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700,
              borderColor: filter === f.id ? '#cb0c9f' : '#e9ecef',
              background: filter === f.id ? '#fde6f7' : '#fff',
              color: filter === f.id ? '#a30c80' : '#8392ab',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button color="warning" variant="outline" size="sm" icon="fas fa-paper-plane">Send to all</Button>
        </div>
        <Button color="primary" size="sm" rounded icon="fas fa-plus" />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Phone</th>
            <th style={th}>Vehicle</th>
            <th style={th}>Plate</th>
            <th style={th}>Status</th>
            <th style={th}>Last connection</th>
            <th style={th}>Balance</th>
            <th style={{ ...th, textAlign: 'right' }}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id}>
              <td style={td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Avatar name={d.name} size="sm" status={d.status} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#344767' }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#adb5bd' }}>{d.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ ...td, fontWeight: 600, whiteSpace: 'nowrap' }}>{d.phone}</td>
              <td style={td}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#344767' }}>{d.brand}</div>
                <div style={{ fontSize: '0.7rem', color: '#adb5bd' }}>{d.model}</div>
              </td>
              <td style={td}>
                <span style={{ color: '#82d616', marginRight: 4 }}>●</span>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#cb0c9f', fontWeight: 600 }}>{d.plate}</a>
              </td>
              <td style={td}>
                <Badge color={enabledMap[d.id] ? 'success' : 'danger'} variant="solid">{enabledMap[d.id] ? 'Enabled' : 'Disabled'}</Badge>
              </td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>{d.last}</td>
              <td style={{ ...td, fontWeight: 700, color: d.balance.includes('−') ? '#ea0606' : '#344767' }}>{d.balance}</td>
              <td style={{ ...td, textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Switch checked={enabledMap[d.id]} onChange={(v) => setEnabledMap((m) => ({ ...m, [d.id]: v }))} />
                  <em className="fas fa-pencil" style={{ color: '#cb0c9f', cursor: 'pointer' }} title="Edit" onClick={() => onEditDriver && onEditDriver(d)} />
                  <em className="fas fa-paper-plane" style={{ color: '#8392ab', cursor: 'pointer' }} title="Message" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#8392ab' }}>
        <span>Showing 1–{rows.length} of {data.drivers.length}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={pagBtn(false)}>‹</button>
          <button style={pagBtn(true)}>1</button>
          <button style={pagBtn(false)}>2</button>
          <button style={pagBtn(false)}>›</button>
        </div>
      </div>
    </Card>
  );
}
function pagBtn(active) {
  return {
    width: 30, height: 30, borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700,
    background: active ? 'linear-gradient(310deg, #7928ca, #ff0080)' : '#fff',
    color: active ? '#fff' : '#8392ab',
    boxShadow: active ? '0 4px 7px -1px rgba(0,0,0,0.11)' : '0 1px 3px rgba(0,0,0,0.08)',
  };
}
window.DriversView = DriversView;
