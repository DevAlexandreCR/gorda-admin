// Metrics view — annual service volume, cancellation trend, top-plate leaderboard.
// Charts are hand-built inline SVG (no external chart lib) so they inherit theme tokens 1:1.
function MetricsView() {
  const { Card, StatCard } = window.GordaDesignSystem_019e24;
  const { monthly, topPlates } = window.GordaData.metrics;
  const [period, setPeriod] = React.useState('diario');

  const months = monthly.map(r => r.m);
  const rates = monthly.map(r => Math.round((r.canceled / r.total) * 1000) / 10);

  // ── month-over-month KPI deltas (last complete month vs prior) ──
  const last = monthly[monthly.length - 2];   // Jun — last full month (Jul is in progress)
  const prev = monthly[monthly.length - 3];   // May
  const lastRate = Math.round((last.canceled / last.total) * 1000) / 10;
  const prevRate = Math.round((prev.canceled / prev.total) * 1000) / 10;
  const lastFin = Math.round((last.completed / last.total) * 1000) / 10;
  const prevFin = Math.round((prev.completed / prev.total) * 1000) / 10;
  const totalDelta = Math.round(((last.total - prev.total) / prev.total) * 1000) / 10;
  const leader = topPlates.mensual[0];

  /* ── shared micro-styles ── */
  const cardHeader = (icon, grad, title, right) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
      <span style={{
        width: 34, height: 34, flex: 'none', borderRadius: '0.6rem',
        background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '0.9rem', boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
      }}>
        <em className={icon} />
      </span>
      <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', flex: 1 }}>{title}</h6>
      {right}
    </div>
  );

  const Legend = ({ items }) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
      {items.map(it => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: 10, height: 10, borderRadius: it.dash ? 2 : '50%', flex: 'none',
            background: it.color,
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{it.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── KPI strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatCard label="Servicios · jun" value={last.total.toLocaleString('es-CO')} icon="fas fa-route" color="info"
          delta={`${Math.abs(totalDelta)}%`} deltaUp={totalDelta >= 0} />
        <StatCard label="Tasa de finalización" value={`${lastFin}%`} icon="fas fa-circle-check" color="success"
          delta={`${Math.abs(Math.round((lastFin - prevFin) * 10) / 10)} pp`} deltaUp={lastFin >= prevFin} />
        <StatCard label="Tasa de cancelación" value={`${lastRate}%`} icon="fas fa-ban" color="danger"
          delta={`${Math.abs(Math.round((lastRate - prevRate) * 10) / 10)} pp`} deltaUp={lastRate >= prevRate} />
        <StatCard label="Conductor líder · mes" value={leader.plate} icon="fas fa-trophy" color="warning"
          delta={`${leader.value} servicios`} deltaUp={true} />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>

        {/* Progreso de servicios anual */}
        <Card>
          {cardHeader('fas fa-chart-line', 'linear-gradient(310deg,#2152ff,#21d4fd)', 'Progreso de servicios anual')}
          <Legend items={[
            { label: 'Total', color: 'var(--text-secondary)', dash: true },
            { label: 'Completado', color: 'var(--status-completed)' },
            { label: 'Cancelado', color: 'var(--status-canceled)' },
          ]} />
          <LineChart
            labels={months}
            series={[
              { data: monthly.map(r => r.total), color: 'var(--text-secondary)', dashed: true },
              { data: monthly.map(r => r.completed), color: 'var(--status-completed)' },
              { data: monthly.map(r => r.canceled), color: 'var(--status-canceled)' },
            ]}
          />
        </Card>

        {/* Índice de cancelación */}
        <Card>
          {cardHeader('fas fa-chart-column', 'linear-gradient(310deg,#d60808,#ff6690)', 'Índice de cancelación')}
          <Legend items={[{ label: 'Índice de cancelación', color: 'var(--status-canceled)' }]} />
          <BarChart labels={months} values={rates} suffix="%" color="var(--status-canceled)" niceMax={30} tickStep={10} />
        </Card>

        {/* Top 5 */}
        <Card>
          {cardHeader('fas fa-ranking-star', 'linear-gradient(310deg,#7928ca,#ff0080)', 'Top 5', (
            <div style={{ display: 'flex', gap: 2, background: 'var(--surface-input)', borderRadius: '0.5rem', padding: 2 }}>
              {[['diario', 'Día'], ['semanal', 'Sem.'], ['mensual', 'Mes']].map(([id, label]) => {
                const on = period === id;
                return (
                  <button key={id} onClick={() => setPeriod(id)} style={{
                    border: 'none', borderRadius: '0.4rem', cursor: 'pointer',
                    padding: '0.32rem 0.6rem', fontSize: '0.68rem', fontWeight: 700,
                    fontFamily: "'Open Sans', sans-serif",
                    background: on ? 'var(--surface-card)' : 'transparent',
                    color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
                    boxShadow: on ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s',
                  }}>{label}</button>
                );
              })}
            </div>
          ))}
          <TopList items={topPlates[period]} />
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────────── chart primitives ───────────────────────── */

function niceCeil(n, step) { return Math.max(step, Math.ceil(n / step) * step); }

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

function LineChart({ labels, series, height = 220 }) {
  const W = 600, H = height, padL = 44, padR = 8, padT = 8, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const maxVal = niceCeil(Math.max(...series.flatMap(s => s.data)) * 1.08, 10000);
  const step = innerW / (labels.length - 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f));

  const scaleY = v => padT + innerH - (v / maxVal) * innerH;
  const linesData = series.map(s => s.data.map((v, i) => [padL + i * step, scaleY(v)]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Open Sans', sans-serif" }}>
      {/* gridlines + y labels */}
      {ticks.map((t, i) => {
        const y = scaleY(t);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="var(--border-subtle)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-secondary)">
              {t >= 1000 ? `${Math.round(t / 1000)}k` : t}
            </text>
          </g>
        );
      })}
      {/* x labels */}
      {labels.map((l, i) => (
        <text key={l} x={padL + i * step} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-secondary)">{l}</text>
      ))}
      {/* series lines */}
      {linesData.map((pts, si) => (
        <g key={si}>
          <path d={smoothPath(pts)} fill="none" stroke={series[si].color} strokeWidth="2.25"
            strokeDasharray={series[si].dashed ? '5 4' : 'none'} strokeLinecap="round" />
          {pts.map(([x, y], pi) => (
            <circle key={pi} cx={x} cy={y} r="3" fill={series[si].color}>
              <title>{`${labels[pi]}: ${series[si].data[pi].toLocaleString('es-CO')}`}</title>
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}

function topRoundedRectPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, Math.max(h, 0.001));
  return `M ${x},${y + h} L ${x},${y + r} Q ${x},${y} ${x + r},${y} L ${x + w - r},${y} Q ${x + w},${y} ${x + w},${y + r} L ${x + w},${y + h} Z`;
}

function BarChart({ labels, values, height = 220, color = 'var(--primary)', suffix = '', niceMax, tickStep }) {
  const W = 600, H = height, padL = 34, padR = 8, padT = 8, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const maxVal = niceMax || niceCeil(Math.max(...values) * 1.15, 5);
  const ts = tickStep || Math.round(maxVal / 3);
  const ticks = [];
  for (let t = 0; t <= maxVal; t += ts) ticks.push(t);

  const gap = 0.42;
  const slot = innerW / values.length;
  const barW = slot * (1 - gap);
  const scaleY = v => (v / maxVal) * innerH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Open Sans', sans-serif" }}>
      {ticks.map((t, i) => {
        const y = padT + innerH - scaleY(t);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="var(--border-subtle)" strokeWidth="1" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-secondary)">{t}{suffix}</text>
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={l} x={padL + i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-secondary)">{l}</text>
      ))}
      {values.map((v, i) => {
        const h = scaleY(v);
        const x = padL + i * slot + (slot - barW) / 2;
        const y = padT + innerH - h;
        return (
          <path key={i} d={topRoundedRectPath(x, y, barW, h, 4)} fill={color}>
            <title>{`${labels[i]}: ${v}${suffix}`}</title>
          </path>
        );
      })}
    </svg>
  );
}

function TopList({ items }) {
  const max = Math.max(...items.map(it => it.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {items.map((it, i) => (
        <div key={it.plate} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span style={{
            width: 22, height: 22, flex: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700,
            background: i === 0 ? 'linear-gradient(310deg,#7928ca,#ff0080)' : 'var(--surface-input)',
            color: i === 0 ? '#fff' : 'var(--text-secondary)',
          }}>{i + 1}</span>
          <span style={{ width: 62, flex: 'none', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
            {it.plate}
          </span>
          <div style={{ flex: 1, height: 8, borderRadius: '50rem', background: 'var(--surface-input)', overflow: 'hidden' }}>
            <div style={{
              width: `${(it.value / max) * 100}%`, height: '100%', borderRadius: '50rem',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)',
              opacity: 1 - i * 0.15,
            }} />
          </div>
          <span style={{ width: 30, flex: 'none', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}

window.MetricsView = MetricsView;
