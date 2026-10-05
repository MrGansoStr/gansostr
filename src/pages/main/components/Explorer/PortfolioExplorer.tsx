import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowUpRight, BriefcaseBusiness, ChevronRight, Code2, Download, Layers3, List, Maximize2, Minus, Network, Plus, Sparkles, X } from 'lucide-react';
import { GithubOutlined } from '@ant-design/icons';
import { UseContextMainPage } from '../../Context/ContextMainPage';
import { categories, edges, graphPosition, neighbors, nodeById, nodeColor, nodes, overviewIds, type Category } from './portfolioGraph';
import './PortfolioExplorer.css';

const icons = { exp: BriefcaseBusiness, proy: Layers3, tech: Code2, skill: Network, model: Sparkles };
const accent = (color: string) => ({ '--node-color': color }) as CSSProperties;
const dateLabel = (date: string) => new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' }).format(new Date(Number(date.slice(6)), Number(date.slice(3, 5)) - 1, Number(date.slice(0, 2))));

export default function PortfolioExplorer() {
  const { setModalOpen, setIdComponent } = UseContextMainPage();
  const [selectedId, setSelectedId] = useState('me1');
  const [detailOpen, setDetailOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 350, height: 465 });
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const selected = nodeById.get(selectedId)!;
  const related = neighbors(selectedId);
  const focusId = hoveredId ?? selectedId;
  const focusNeighbors = neighbors(focusId);
  const overview = category === 'all' && overviewIds.has(selectedId);
  const matches = nodes.filter(node => category === 'all' ? overviewIds.has(node.id) : node.category === category);
  const matchingIds = new Set(matches.map(node => node.id));
  const visible = nodes.filter(node => overview ? overviewIds.has(node.id) || (selectedId !== 'me1' && (node.id === selectedId || related.has(node.id))) : category === 'all' || matchingIds.has(node.id) || node.id === selectedId || related.has(node.id));
  const visibleIds = new Set(visible.map(node => node.id));
  const visibleEdges = edges.filter(edge => visibleIds.has(edge.from) && visibleIds.has(edge.to));
  const baseScale = Math.min(size.width / 1050, size.height / 890);
  const scale = baseScale * zoom;

  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [view]);

  function choose(id: string) {
    setSelectedId(id);
    setHoveredId(null);
    setDetailOpen(true);
  }
  function filter(next: Category | 'all') {
    setCategory(next);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    if (next === 'all') choose('me1');
    else choose(nodes.find(node => node.category === next)!.id);
  }
  function openMore() {
    setIdComponent(selectedId);
    setModalOpen(true);
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('button') || event.button !== 0) return;
    event.preventDefault();
    drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current) setPan({ x: drag.current.panX + event.clientX - drag.current.x, y: drag.current.panY + event.clientY - drag.current.y });
  }

  return (
    <div className={`portfolio fullscreen ${detailOpen ? 'detail-open' : ''}`}>
      <header className="portfolio-header">
        <a className="wordmark" href="#inicio">Carlos Huanca<span className="wordmark-dot">.</span></a>
        <div className="header-links"><a href="/CV_DEV_A.pdf" target="_blank" rel="noreferrer"><Download size={15} /> CV</a><a href="https://github.com/MrGansoStr/" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubOutlined /></a><a href="https://www.linkedin.com/in/carlos-huanca-newstr/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div>
      </header>
      <main id="inicio">
        <section className="explorer" aria-label="Experiencias, proyectos y tecnologías conectadas">
          <div className="map-section">

            <div className="map-toolbar"><div className="map-view-switch" aria-label="Forma de explorar"><button aria-label="Vista de mapa" aria-pressed={view === 'map'} className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Network size={15} /> Mapa</button><button aria-label="Vista de lista" aria-pressed={view === 'list'} className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={15} /> Lista</button></div></div>
            {view === 'map' ? <div className="graph-viewport" ref={viewport} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
              <div className="graph-stage" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}>
                <svg className="graph-edges" viewBox="0 0 1050 890" aria-hidden="true"><defs><radialGradient id="universe-glow"><stop stopColor="#9480dd" stopOpacity=".12" /><stop offset="1" stopColor="#9480dd" stopOpacity="0" /></radialGradient></defs><circle cx="525" cy="365" r="320" fill="url(#universe-glow)" /><circle className="orbit-ring" cx="525" cy="365" r="125" /><circle className="orbit-ring" cx="525" cy="365" r="265" /><circle className="orbit-ring" cx="525" cy="365" r="390" />
                  {visibleEdges.map(edge => { const from = nodeById.get(edge.from)!; const to = nodeById.get(edge.to)!; const [x1, y1] = graphPosition(from, overview); const [x2, y2] = graphPosition(to, overview); const focused = edge.from === focusId || edge.to === focusId; return <path key={`${edge.from}-${edge.to}`} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + (y2 - y1) * .08} ${(y1 + y2) / 2 - (x2 - x1) * .08} ${x2} ${y2}`} className={focused ? 'edge focused' : 'edge'} stroke={focused ? nodeColor(from.category === 'me' ? to.category : from.category) : '#555768'} strokeDasharray={edge.membership ? '5 7' : undefined} />; })}
                </svg>
                {visible.map(node => { const [x, y] = graphPosition(node, overview); const Icon = node.category === 'me' ? Network : icons[node.category]; const isMatch = category === 'all' || matchingIds.has(node.id); const isRelated = focusNeighbors.has(node.id) || node.id === focusId; return <button key={node.id} className={`graph-node ${node.category === 'me' ? 'profile-node' : ''} ${node.id === selectedId ? 'selected' : ''} ${isRelated ? 'related' : ''} ${isMatch ? '' : 'context-node'}`} style={{ ...accent(nodeColor(node.category)), left: x, top: y }} onClick={() => choose(node.id)} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)} onFocus={() => setHoveredId(node.id)} onBlur={() => setHoveredId(null)} aria-pressed={selectedId === node.id} aria-label={`Explorar ${node.name}`}><span className="node-orb">{node.category === 'me' ? <img src="/yodx1.jpg" alt="" /> : <Icon size={node.category === 'exp' || node.category === 'proy' ? 18 : 14} />}</span><span className="node-label">{node.name}</span>{node.category === 'me' && <span className="node-subtitle">FULL STACK · MACHINE LEARNING</span>}</button>; })}
              </div>
              <div className="map-controls"><button onClick={() => setZoom(value => Math.min(3, value + .25))} disabled={zoom >= 3} aria-label="Acercar mapa"><Plus size={17} /></button><button onClick={() => setZoom(value => Math.max(.75, value - .25))} disabled={zoom <= .75} aria-label="Alejar mapa"><Minus size={17} /></button><button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="Centrar mapa"><Maximize2 size={16} /></button></div>
              
            </div> : <div className="node-list">{matches.length ? matches.map(node => { const Icon = node.category === 'me' ? Network : icons[node.category]; return <button key={node.id} onClick={() => choose(node.id)} className={selectedId === node.id ? 'selected' : ''} style={accent(nodeColor(node.category))}><Icon size={19} /><span><strong>{node.name}</strong><small>{node.description}</small></span><ChevronRight size={17} /></button>; }) : <p className="list-empty">No hay coincidencias. Prueba con otro nombre o categoría.</p>}</div>}

            <div className="map-footer category-list" aria-label="Filtrar portafolio"><button className={category === 'all' ? 'active' : ''} onClick={() => filter('all')} aria-pressed={category === 'all'}>Todo</button>{categories.filter(item => ['exp', 'proy', 'tech'].includes(item.id)).map(item => <button key={item.id} style={accent(item.color)} className={category === item.id ? 'active' : ''} onClick={() => filter(item.id)} aria-pressed={category === item.id}>{item.label}</button>)}</div>
          </div>

          <aside className="detail-panel" hidden={!detailOpen} aria-label="Detalle del nodo seleccionado" aria-live="polite">
            <button className="detail-close" onClick={() => setDetailOpen(false)} aria-label="Cerrar detalles"><X size={16} /></button>
            <div className={`detail-visual ${selected.category === 'me' ? 'is-profile' : ''}`} style={accent(nodeColor(selected.category))}>{selected.category === 'me' ? <img src="/yodx1.jpg" alt="Carlos Huanca" /> : (() => { const Icon = icons[selected.category]; return <Icon size={40} strokeWidth={1.3} />; })()}<span className="detail-visual-ring" /></div>
            <span className="detail-category" style={accent(nodeColor(selected.category))}><i />{categories.find(item => item.id === selected.category)?.label ?? 'Sobre mí'}</span>
            <h2>{selected.name}</h2>
            {selected.start && selected.finish && <p className="detail-date">{dateLabel(selected.start)} — {dateLabel(selected.finish)}</p>}
            <p className="detail-description">{selected.description}</p>
            {selected.moreInfo && <button className="detail-more" onClick={openMore}>{selected.category === 'me' ? 'Ver perfil' : selected.category === 'proy' ? 'Ver proyecto' : 'Ver detalles'}<ArrowUpRight size={17} /></button>}
            <div className="connections-heading"><h3>Conecta con</h3><span>{related.size}</span></div>
            <div className="related-nodes">{nodes.filter(node => related.has(node.id)).map(node => <button key={node.id} onClick={() => choose(node.id)} style={accent(nodeColor(node.category))}><i /><span>{node.name}</span><ChevronRight size={14} /></button>)}</div>
            {related.size === 0 && <p className="detail-description">Explora otra categoría para descubrir más de mi recorrido.</p>}
            
          </aside>
        </section>
        
      </main>
    </div>
  );
}
