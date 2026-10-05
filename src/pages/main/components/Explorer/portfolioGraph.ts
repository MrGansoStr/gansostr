import source from '../../../../infoToShow/Nodes.json';
import descriptions from '../../../../infoToShow/AllTreev2.json';

export const categories = [
  { id: 'exp', label: 'Experiencia', color: '#b5a0ff', caption: 'El camino recorrido' },
  { id: 'proy', label: 'Proyectos', color: '#f0bc78', caption: 'Ideas que se hicieron realidad' },
  { id: 'tech', label: 'Tecnologías', color: '#79ccb5', caption: 'Herramientas para construir' },
  { id: 'skill', label: 'Habilidades', color: '#8dbbea', caption: 'Mi forma de resolver problemas' },
  { id: 'model', label: 'Inteligencia artificial', color: '#e6a5cc', caption: 'Aprender de los datos' },
] as const;

export type Category = typeof categories[number]['id'] | 'me';
export type PortfolioNode = {
  id: string; name: string; category: Category; description: string;
  moreInfo: boolean; start?: string; finish?: string; x: number; y: number;
};
type Description = { summary: string; all_info: string; more_info?: boolean; DateStart?: string; DateFinish?: string };
const info: Record<string, Description> = descriptions.NodesDescription;
const overviewPositions: Record<string, [number, number]> = {
  me1: [525, 365], exp1: [175, 200], exp2: [315, 115], exp3: [110, 350],
  exp4: [180, 490], exp5: [350, 475], exp6: [335, 290],
  proy1: [825, 165], proy2: [920, 330], proy3: [795, 455],
  tech1: [455, 150], tech4: [615, 180], model1: [665, 70],
  tech5: [670, 490], tech8: [525, 555], tech2: [865, 590],
  tech3: [940, 710], tech6: [655, 665], tech7: [775, 740],
  tech9: [405, 680], tech10: [260, 730], tech11: [125, 645],
  tech12: [150, 790], skill1: [530, 805],
};
export const overviewIds = new Set(Object.keys(overviewPositions));
const counters: Record<string, number> = {};
const origins: Record<Category, [number, number]> = {
  exp: [100, 165], proy: [745, 165], tech: [640, 435],
  skill: [90, 435], model: [590, 90], me: [525, 355],
};

export const nodes: PortfolioNode[] = source.DataScience.nodes.map(node => {
  const category: Category = node.colorType === 'Tech' ? 'tech' :
    categories.some(item => item.id === node.colorType) || node.colorType === 'me'
      ? node.colorType as Category : 'skill';
  const index = counters[category] ?? 0;
  counters[category] = index + 1;
  const origin = origins[category];
  const columns = category === 'exp' || category === 'proy' ? 2 : 3;
  return {
    id: node.id,
    name: node.id === 'ds3' ? info[node.id].summary : node.name,
    category, description: info[node.id]?.all_info ?? '', moreInfo: info[node.id]?.more_info ?? false,
    start: info[node.id]?.DateStart, finish: info[node.id]?.DateFinish,
    x: category === 'me' ? 525 : origin[0] + (index % columns) * 135,
    y: category === 'me' ? 355 : origin[1] + Math.floor(index / columns) * 90,
  };
});
export const nodeById = new Map(nodes.map(node => [node.id, node]));
export const edges = source.DataScience.connections.map(edge => ({ ...edge, membership: false }));
const edgeKeys = new Set(edges.map(edge => [edge.from, edge.to].sort().join(':')));
function addEdge(from: string, to: string, membership: boolean) {
  const key = [from, to].sort().join(':');
  if (!edgeKeys.has(key)) {
    edges.push({ from, to, type: membership ? 'portfolio' : 'category', membership });
    edgeKeys.add(key);
  }
}
for (const node of source.DataScience.nodes) {
  if ('parent' in node && node.parent) addEdge(node.parent, node.id, false);
  if (node.colorType === 'exp') addEdge('me1', node.id, true);
}
export function neighbors(id: string) {
  return new Set(edges.flatMap(edge => edge.from === id ? [edge.to] : edge.to === id ? [edge.from] : []));
}
export function nodeColor(category: Category) {
  return categories.find(item => item.id === category)?.color ?? '#ded4ff';
}
export function graphPosition(node: PortfolioNode, overview: boolean): [number, number] {
  return overview ? overviewPositions[node.id] ?? [node.x, node.y] : [node.x, node.y];
}
