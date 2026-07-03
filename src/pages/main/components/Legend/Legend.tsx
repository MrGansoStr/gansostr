import { useMemo } from "react";

import "./StylesLegend.css";

import {
  BulbOutlined,
  FieldTimeOutlined,
  PythonOutlined,
  RobotOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import NodesJson from "../../../../infoToShow/Nodes.json";

interface LegendItem {
  name: string;
  color: string;
  icon: ReactNode;
  colorTypes: string[];
}

const colorsNode = NodesJson.DataScience.colors_node as Record<
  string,
  { color: string }
>;

const resolveColor = (colorTypes: string[]): string => {
  for (const ct of colorTypes) {
    if (colorsNode[ct]?.color) return colorsNode[ct].color;
  }
  return "#ffffff";
};

const legendMeta: Omit<LegendItem, "color">[] = [
  { name: "Yo", icon: <UserOutlined />, colorTypes: ["me"] },
  { name: "Experiencia", icon: <FieldTimeOutlined />, colorTypes: ["exp"] },
  { name: "Tecnologias", icon: <PythonOutlined />, colorTypes: ["tech", "Tech"] },
  { name: "Proyectos", icon: <BulbOutlined />, colorTypes: ["proy"] },
  { name: "Modelos", icon: <RobotOutlined />, colorTypes: ["model"] },
  { name: "Habilidades", icon: <ToolOutlined />, colorTypes: ["skill"] },
];

const data_legend: LegendItem[] = legendMeta.map((item) => ({
  ...item,
  color: resolveColor(item.colorTypes),
}));

const Legend = () => {
  const counts = useMemo(() => {
    const nodes = NodesJson.DataScience.nodes;
    const map: Record<string, number> = {};
    for (const item of data_legend) {
      map[item.name] = nodes.filter((n) =>
        item.colorTypes.includes(n.colorType ?? "")
      ).length;
    }
    return map;
  }, []);

  return (
    <div id="legend_sidebar">
      <h2 className="legend_header">Portafolio</h2>

      <div className="legend_list">
        {data_legend.map((item) => (
          <div className="legend_item" key={item.name}>
            <span
              className="legend_accent"
              style={{ background: item.color }}
            />
            <span
              className="legend_icon-badge"
              style={{
                color: item.color,
                boxShadow: `0 0 12px ${item.color}40`,
              }}
            >
              {item.icon}
            </span>
            <span className="legend_name">{item.name}</span>
            <span className="legend_count">{counts[item.name] ?? 0}</span>
          </div>
        ))}
      </div>

      <div className="legend_footer">
        <span>Hover sobre los nodos para ver detalles</span>
      </div>
    </div>
  );
};

export default Legend;
