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

const data_legend: LegendItem[] = [
  { name: "Yo", color: "#BB4040", icon: <UserOutlined />, colorTypes: ["me"] },
  { name: "Experiencia", color: "#3AA6D0", icon: <FieldTimeOutlined />, colorTypes: ["exp"] },
  { name: "Tecnologias", color: "#58C46E", icon: <PythonOutlined />, colorTypes: ["tech", "Tech"] },
  { name: "Proyectos", color: "#F1F57C", icon: <BulbOutlined />, colorTypes: ["proy"] },
  { name: "Modelos", color: "#D66AF7", icon: <RobotOutlined />, colorTypes: ["model"] },
  { name: "Habiliadades", color: "#80DDF7", icon: <ToolOutlined />, colorTypes: ["skill"] },
];

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
      <div className="legend_header">
        <div className="legend_header-icon">
          <BulbOutlined />
        </div>
        <div className="legend_header-text">
          <h2>Leyenda</h2>
          <span>Categorías del mapa</span>
        </div>
      </div>

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
