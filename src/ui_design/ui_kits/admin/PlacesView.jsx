// Places (Lugares) view — saved points of interest on a map, with a create form
// and a searchable/deletable list. Map is a styled placeholder (chrome only),
// matching the treatment used on the Mapa tab.
const PLACE_CATEGORIES = {
  edificio:    { icon: 'fas fa-building',           color: '#8392ab' },
  foto:        { icon: 'fas fa-camera',             color: '#8b5cf6' },
  comercio:    { icon: 'fas fa-store',               color: '#fd7e14' },
  salud:       { icon: 'fas fa-briefcase-medical',   color: '#ea0606' },
  deporte:     { icon: 'fas fa-dumbbell',            color: '#fbcf33' },
  restaurante: { icon: 'fas fa-utensils',            color: '#fd7e14' },
  seguridad:   { icon: 'fas fa-lock',                color: '#17c1e8' },
  hotel:       { icon: 'fas fa-bed',                 color: '#cb0c9f' },
  finca:       { icon: 'fas fa-tree',                color: '#82d616' },
  educacion:   { icon: 'fas fa-graduation-cap',      color: '#344767' },
  otro:        { icon: 'fas fa-location-dot',        color: '#8392ab' },
};

// Deterministic pseudo-position (8%–92%) derived from a string, so pins are
// stable across renders without needing real map projection.
function hashPos(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const top = 10 + (h % 8000) / 100;         // 10–90
  const left = 8 + ((h >>> 8) % 8400) / 100; // 8–92
  return [top, left];
}

function PlacesView() {
  const { Card, Button, Input } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const isMobile = window.useIsMobile(1100);

  const [places, setPlaces] = React.useState(() => data.places || []);
  const [name, setName] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [mapMode, setMapMode] = React.useState('map');
  const [selected, setSelected] = React.useState(null);

  const filtered = places.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  function handleCreate() {
    if (!name.trim() || !lat.trim() || !lng.trim()) return;
    const p = { id: 'p' + Date.now(), name: name.trim(), lat: parseFloat(lat), lng: parseFloat(lng), category: 'otro' };
    setPlaces(list => [p, ...list]);
    setSelected(p.id);
    setName(''); setLat(''); setLng('');
  }

  function handleDelete(id) {
    setPlaces(list => list.filter(p => p.id !== id));
    if (selected === id) setSelected(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* ── Create form ── */}
      <Card padding="1.1rem 1.25rem">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginRight: '0.25rem' }}>
            <span style={{
              width: 30, height: 30, borderRadius: '0.45rem', flex: 'none',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem',
            }}>
              <em className="fas fa-location-dot" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
              Nuevo lugar
            </h6>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <Input placeholder="Ingrese el nombre" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 120 }}>
            <Input placeholder="Latitud" value={lat} onChange={e => setLat(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 120 }}>
            <Input placeholder="Longitud" value={lng} onChange={e => setLng(e.target.value)} />
          </div>
          <Button color="primary" onClick={handleCreate}>Crear</Button>
        </div>
      </Card>

      {/* ── Map + list ── */}
      <div style={{ display: 'flex', gap: '0.875rem', flexDirection: isMobile ? 'column' : 'row', height: isMobile ? 'auto' : 'calc(100vh - 260px)' }}>

        {/* Map */}
        <Card padding="0" style={{ flex: isMobile ? 'none' : 1, height: isMobile ? 420 : 'auto', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{
            flex: 1, position: 'relative', minHeight: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, var(--body-bg) 0 14px, var(--surface-input) 14px 28px)',
          }}>
            {/* Map / Satellite toggle */}
            <div style={{
              position: 'absolute', top: 14, left: 14, display: 'flex', gap: '0.4rem', zIndex: 2,
              background: 'var(--surface-card)', borderRadius: '0.5rem', padding: '0.3rem', boxShadow: 'var(--shadow-sm)',
            }}>
              {['map', 'satellite'].map(m => (
                <button key={m} onClick={() => setMapMode(m)} style={{
                  padding: '0.3rem 0.7rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer',
                  fontFamily: "'Open Sans', sans-serif", fontSize: '0.72rem', fontWeight: 700,
                  background: mapMode === m ? 'var(--body-bg)' : 'transparent',
                  color: mapMode === m ? 'var(--text-heading)' : 'var(--text-secondary)',
                }}>{m === 'map' ? 'Mapa' : 'Satélite'}</button>
              ))}
            </div>

            {/* Fullscreen chrome, decorative */}
            <div style={{
              position: 'absolute', top: 14, right: 14, zIndex: 2,
              width: 34, height: 34, borderRadius: '0.4rem',
              background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem',
            }}>
              <em className="fas fa-expand" />
            </div>

            {/* Pins */}
            {filtered.map(p => {
              const cat = PLACE_CATEGORIES[p.category] || PLACE_CATEGORIES.otro;
              const [top, left] = hashPos(p.id + p.name);
              const isSel = selected === p.id;
              return (
                <div key={p.id}
                  onClick={() => setSelected(p.id)}
                  title={p.name}
                  style={{
                    position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `translate(-50%, -100%) scale(${isSel ? 1.18 : 1})`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                    cursor: 'pointer', transition: 'transform 0.15s ease', zIndex: isSel ? 3 : 1,
                  }}
                >
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-heading)', background: 'var(--surface-card)',
                    padding: '0.12rem 0.45rem', borderRadius: '0.3rem', whiteSpace: 'nowrap',
                    boxShadow: isSel ? `0 0 0 2px ${cat.color}` : '0 2px 6px rgba(0,0,0,0.2)',
                    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{p.name}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)',
                    background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)', border: '2px solid var(--surface-card)',
                  }}>
                    <em className={cat.icon} style={{ transform: 'rotate(-45deg)', color: '#fff', fontSize: '0.65rem' }} />
                  </span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
              }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <em className="fas fa-map-location-dot" style={{ fontSize: '1.8rem', opacity: 0.35, display: 'block', marginBottom: '0.5rem' }} />
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.03em' }}>sin resultados</div>
                </div>
              </div>
            )}

            {/* Bottom chrome */}
            <div style={{
              position: 'absolute', bottom: 8, left: 12, fontSize: '0.68rem', color: 'var(--text-secondary)', opacity: 0.7,
              fontFamily: 'monospace',
            }}>mapa · vista previa</div>
          </div>
        </Card>

        {/* List */}
        <Card padding="0" style={{ width: isMobile ? '100%' : 320, flex: 'none', display: 'flex', flexDirection: 'column', minHeight: 0 }} bodyStyle={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
          <div style={{ padding: '1rem 1rem 0.75rem', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Lugares</h6>
              <span style={{
                background: 'var(--surface-input)', border: '1px solid var(--border-subtle)',
                borderRadius: '50rem', padding: '0.1rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
              }}>{filtered.length}</span>
            </div>
            <Input placeholder="Buscar" icon="fas fa-magnifying-glass" value={query} onChange={e => setQuery(e.target.value)} />
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 0.5rem 0.5rem' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 1rem', fontSize: '0.8rem' }}>
                <em className="fas fa-location-dot" style={{ fontSize: '1.3rem', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }} />
                Sin lugares
              </div>
            )}
            {filtered.map(p => {
              const cat = PLACE_CATEGORIES[p.category] || PLACE_CATEGORIES.otro;
              const isSel = selected === p.id;
              return (
                <div key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.55rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer',
                    background: isSel ? 'var(--surface-input)' : 'transparent',
                    boxShadow: isSel ? 'var(--shadow-xs)' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--surface-input)'; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '0.5rem', flex: 'none',
                    background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.7rem',
                  }}>
                    <em className={cat.icon} />
                  </span>
                  <span style={{
                    fontSize: '0.82rem', fontWeight: isSel ? 700 : 600, color: 'var(--text-heading)',
                    flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{p.name}</span>
                  <button
                    title="Eliminar"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                    style={{
                      width: 26, height: 26, flex: 'none', borderRadius: '0.4rem', border: 'none',
                      background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(234,6,6,0.1)'; e.currentTarget.style.color = '#ea0606'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <em className="fas fa-trash" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.PlacesView = PlacesView;
