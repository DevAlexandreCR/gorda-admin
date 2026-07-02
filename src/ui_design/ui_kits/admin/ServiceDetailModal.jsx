// Service detail modal — shown from the Historial table. Read-only recap of a
// completed/canceled service: route map placeholder, timeline, and the two
// info panels (service data / route+driver data). All fields required by the
// product are preserved — this only restyles the presentation.
function ServiceDetailModal({ service, onClose }) {
  const { StatusBadge } = window.GordaDesignSystem_019e24;
  if (!service) return null;

  const isCanceled = service.status === 'canceled';
  const statusLabel = isCanceled ? 'Cancelado' : 'Completado';

  // Turn "HH:MM:SS" pairs into a human duration like "14m:56s"; "—" when either side is missing.
  function gap(a, b) {
    if (!a || !b) return '—';
    const toSec = (t) => t.split(':').reduce((acc, v) => acc * 60 + Number(v), 0);
    let d = toSec(b) - toSec(a);
    if (d < 0) d += 24 * 3600;
    const m = Math.floor(d / 60), s = d % 60;
    return m > 0 ? `${m}m:${s}s` : `${s}s`;
  }

  const stops = [
    { label: 'Hora', time: service.timeline.hora },
    { label: 'Llegada', time: service.timeline.llegada },
    { label: 'Inicio del viaje', time: service.timeline.inicio },
    { label: 'Fin del viaje', time: service.timeline.fin },
  ];

  const svcInfo = [
    { k: 'Origen', v: service.originLabel, icon: 'fas fa-briefcase' },
    { k: 'Dir inicial', v: service.start },
    { k: 'Dir final', v: service.end || 'N/A' },
    { k: 'Hora', v: service.timeline.hora },
    { k: 'Estado', v: statusLabel },
    { k: 'Nombre', v: service.name },
    { k: 'Teléfono', v: service.phone },
    { k: 'Comentario', v: service.comment || 'N/A' },
  ];

  const routeInfo = [
    { k: 'Nombre Conductor', v: service.driverName },
    { k: 'Placa', v: service.plate },
    { k: 'Tiempo', v: service.time },
    { k: 'Distancia', v: service.distance },
    { k: 'Valor', v: service.value },
    { k: 'Descontado', v: service.discounted },
    { k: 'Multiplicador de tarifa', v: service.multiplier },
    { k: 'assigned by', v: service.assignedBy },
    { k: 'created by', v: service.createdBy },
  ];

  const row = { display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem' };
  const rowKey = { color: 'var(--text-secondary)' };
  const rowVal = { color: 'var(--text-heading)', fontWeight: 600, textAlign: 'right' };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(8,11,20,0.6)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 980, maxHeight: '92vh', overflowY: 'auto',
        background: 'var(--surface-card)', borderRadius: '1rem', boxShadow: 'var(--shadow-card)',
        fontFamily: "'Open Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.9rem',
          padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0, background: 'var(--surface-card)', zIndex: 2,
        }}>
          <StatusBadge status={service.status} label={statusLabel} />
          <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
            {service.start} <em className="fas fa-arrow-right" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0 0.3rem' }} /> {service.end && service.end !== 'N/A' ? service.end : 'Sin destino'}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{service.date}</div>
          <button onClick={onClose} aria-label="Cerrar" style={{
            width: 32, height: 32, borderRadius: '0.5rem', border: 'none', flex: 'none',
            background: 'var(--surface-input)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem',
          }}>
            <em className="fas fa-xmark" />
          </button>
        </div>

        <div style={{ padding: '1.4rem' }}>
          {/* Map placeholder */}
          <div style={{
            height: 260, borderRadius: '0.75rem', overflow: 'hidden', position: 'relative',
            border: '1px solid var(--border-subtle)',
            backgroundImage: 'repeating-linear-gradient(135deg, var(--body-bg) 0 12px, var(--surface-input) 12px 24px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <em className="fas fa-route" style={{ fontSize: '1.6rem', opacity: 0.4, display: 'block', marginBottom: '0.5rem' }} />
              <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                mapa de ruta · {service.start} → {service.end && service.end !== 'N/A' ? service.end : 'sin destino'}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
              <em className="fas fa-timeline" style={{ color: '#cb0c9f' }} />
              <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>Línea de tiempo</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {stops.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', minWidth: 90 }}>
                    <span style={{
                      width: 12, height: 12, borderRadius: '50%', flex: 'none',
                      background: s.time ? '#82d616' : 'var(--border-color)',
                      boxShadow: s.time ? '0 0 0 4px rgba(130,214,22,0.18)' : 'none',
                    }} />
                    <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-heading)', textAlign: 'center' }}>{s.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{s.time || '—'}</div>
                  </div>
                  {i < stops.length - 1 && (
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)', position: 'relative', margin: '0 0.25rem -1.9rem' }}>
                      <span style={{
                        position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                        fontSize: '0.68rem', fontStyle: 'italic', color: 'var(--text-secondary)', whiteSpace: 'nowrap',
                      }}>{gap(stops[i].time, stops[i + 1].time)}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Info panels */}
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1rem 1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <em className="fas fa-circle-info" style={{ color: '#17c1e8' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Información del servicio</span>
              </div>
              {svcInfo.map((f) => (
                <div key={f.k} style={row}>
                  <span style={rowKey}>{f.k}</span>
                  <span style={rowVal}>{f.v}</span>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1rem 1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <em className="fas fa-route" style={{ color: '#cb0c9f' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Información de la ruta y conductor</span>
              </div>
              {routeInfo.map((f) => (
                <div key={f.k} style={row}>
                  <span style={rowKey}>{f.k}</span>
                  <span style={rowVal}>{f.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button onClick={onClose} style={{
              padding: '0.6rem 1.6rem', borderRadius: '0.5rem', border: 'none',
              background: 'var(--border-subtle)', color: 'var(--text-heading)',
              fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem',
              letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ServiceDetailModal = ServiceDetailModal;
