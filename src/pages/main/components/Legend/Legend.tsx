import { List } from "antd";
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

import "./StylesLegend.css";
// import MaletinIcon from "./assets/icons8-maletín.svg";
import {
  BulbOutlined,
  DownOutlined,
  FieldTimeOutlined,
  PythonOutlined,
  RobotOutlined,
  ToolOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

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
    icon: <RobotOutlined style={{color: "#D66AF7"}} />,
    color: "#D66AF7"
  },
  {
    name: "Habiliadades",
    icon: <ToolOutlined style={{color: "#80DDF7"}} />,
    color: "#80DDF7"
  }
];


const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Leyenda',
    children: <List
          dataSource={data_legend}
          size="small"
          renderItem={(item, _index) => (
            <List.Item style={{ color: item.color }}>

              {item.icon} {item.name}
            </List.Item>
          )}
          />,
  }
];

const Legend = () => {
  const [legendOpen, setLegendOpen] = useState(true);

  const handleLegendOpen = (_e:any) => {
    // console.log(e)
    setLegendOpen(!legendOpen)
  }
  
  return (
    <div id="legend_main">
      <Collapse 
      defaultActiveKey={['1']} 
      ghost 
      items={items}
      expandIcon={() => legendOpen ? <DownOutlined /> : <UpOutlined />}
      onChange={handleLegendOpen} 
      >
      {/* <Card title="Legenda"> */}
        {/* <List
          dataSource={data_legend}
          size="small"
          renderItem={(item, index) => (
            <List.Item style={{ color: item.color }}>

              {item.icon} {item.name}
            </List.Item>
          )}
          /> */}
          </Collapse>
      {/* </Card> */}
    </div>
  );
};

export default Legend;
