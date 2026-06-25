// Dashboard view — KPI stat cards + a couple of summary panels.
function DashboardView() {
  const { StatCard, Card, StatusBadge, Avatar } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        {data.stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} delta={s.delta} deltaUp={s.up} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem' }}>
        <Card header="Latest services">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.history.slice(0, 4).map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: "'Open Sans', sans-serif" }}>
                <span style={{ width: 36, height: 36, borderRadius: '0.6rem', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cb0c9f' }}>
                  <em className="fas fa-route" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#344767', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.start} → {s.end}</div>
                  <div style={{ fontSize: '0.72rem', color: '#adb5bd' }}>{s.name} · {s.driverName}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card header="Drivers online">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.drivers.filter((d) => d.status !== 'offline').map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontFamily: "'Open Sans', sans-serif" }}>
                <Avatar name={d.name} size="sm" status={d.status} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#344767' }}>{d.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#adb5bd' }}>{d.brand} {d.model} · {d.plate}</div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: d.status === 'online' ? '#82d616' : '#fbcf33', textTransform: 'capitalize' }}>{d.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.DashboardView = DashboardView;
