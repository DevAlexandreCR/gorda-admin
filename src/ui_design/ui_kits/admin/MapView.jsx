// Mapa tab — connected drivers panel + live map placeholder.
// Real integration renders an actual map here; this kit shows the chrome only.
function MapView() {
  const { Card, Input } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const isMobile = window.useIsMobile();
  const [search, setSearch] = React.useState('');

  const STATUS = {
    available: { color: '#82d616', label: 'Disponible' },
    busy:      { color: '#82d616', label: 'Disponible' },
    in_service:{ color: '#ea0606', label: 'En servicio' },
  };

  const drivers = data.mapDrivers.filter((d) =>
    !search || d.plate.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fixed positions so the placeholder pins look intentional, not random per render.
  const pinPositions = [
    [8, 18], [24, 8], [40, 30], [58, 14], [74, 26], [90, 10],
    [14, 55], [32, 68], [50, 50], [66, 62], [82, 72], [12, 84],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', height: 'calc(100vh - 200px)' }}>

      {/* Connected drivers */}
      <Card padding="0" style={{ flex: 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          padding: '1.1rem 1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{
              width: 30, height: 30, borderRadius: '0.45rem', flex: 'none',
              background: 'linear-gradient(310deg,#17ad37,#98ec2d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem',
            }}>
              <em className="fas fa-car-side" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Conductores Conectados</h6>
            <span style={{
              background: 'var(--surface-input)', border: '1px solid var(--border-subtle)',
              borderRadius: '50rem', padding: '0.1rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
            }}>{data.mapDrivers.length}</span>
          </div>
          <div style={{ width: isMobile ? '100%' : 260 }}>
            <Input placeholder="Buscar por placa o nombre" icon="fas fa-magnifying-glass" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Map placeholder — fills remaining vertical space, no scroll */}
      <Card padding="0" style={{ overflow: 'hidden', flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{
          flex: 1, position: 'relative', minHeight: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, var(--body-bg) 0 14px, var(--surface-input) 14px 28px)',
        }}>
          {/* Legend / controls chrome, decorative */}
          <div style={{
            position: 'absolute', top: 14, left: 14, display: 'flex', gap: '0.4rem',
            background: 'var(--surface-card)', borderRadius: '0.5rem', padding: '0.3rem', boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{ padding: '0.3rem 0.7rem', borderRadius: '0.35rem', background: 'var(--body-bg)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-heading)' }}>Mapa</span>
            <span style={{ padding: '0.3rem 0.7rem', borderRadius: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Satélite</span>
          </div>

          {/* Driver pins */}
          {drivers.slice(0, pinPositions.length).map((d, i) => {
            const s = STATUS[d.status];
            const [top, left] = pinPositions[i];
            return (
              <div key={d.plate} title={`${d.plate} · ${s.label}`} style={{
                position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              }}>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700, color: '#fff', background: s.color,
                  padding: '0.12rem 0.4rem', borderRadius: '0.3rem', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                }}>{d.plate}</span>
                <em className="fas fa-car" style={{ color: s.color, fontSize: '1rem', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))' }} />
              </div>
            );
          })}

          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <em className="fas fa-map-location-dot" style={{ fontSize: '1.8rem', opacity: 0.35, display: 'block', marginBottom: '0.5rem' }} />
              <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.03em' }}>mapa en vivo · flota conectada</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
window.MapView = MapView;
