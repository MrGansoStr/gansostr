import { List } from "antd";

import "./StylesLegend.css";

import {
  BulbOutlined,
  FieldTimeOutlined,
  PythonOutlined,
  RobotOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";

const data_legend = [
  {
    name: "Yo",
    icon: <UserOutlined style={{ color: "#BB4040" }} />,
    color: "#BB4040",
  },
  {
    name: "Experiencia",
    icon: <FieldTimeOutlined style={{ color: "#08c" }} />,
    color: "#08c",
  },
  {
    name: "Tecnologias",
    icon: <PythonOutlined style={{ color: "#58C46E" }} />,
    color: "#58C46E",
  },
  {
    name: "Proyectos",
    icon: <BulbOutlined style={{ color: "#F1F57C" }} />,
    color: "#F1F57C",
  },
  {
    name: "Modelos",
    icon: <RobotOutlined style={{ color: "#D66AF7" }} />,
    color: "#D66AF7"
  },
  {
    name: "Habiliadades",
    icon: <ToolOutlined style={{ color: "#80DDF7" }} />,
    color: "#80DDF7"
  }
];

const Legend = () => {
  return (
    <div id="legend_sidebar">
      <h2 className="legend_title">Leyenda</h2>
      <List
        dataSource={data_legend}
        size="small"
        renderItem={(item) => (
          <List.Item style={{ color: item.color }}>
            {item.icon} {item.name}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Legend;
