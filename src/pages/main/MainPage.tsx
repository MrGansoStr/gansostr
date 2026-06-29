import { ContextCompMainPage } from "./Context/ContextMainPage";
import { Layout } from "antd";
import { lazy, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import DotField from "../../components/DotField";

const ModalShow = lazy(() => import('./components/Modal/ModalShow.tsx'));
const MainTree = lazy(() => import('./components/Tree/MainTree.tsx'));
const Legend = lazy(() => import('./components/Legend/Legend.tsx'));

const { Sider, Content } = Layout;

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ContextCompMainPage>
      <Layout id="main_layout">
        <Sider
          id="main_sider"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          collapsedWidth={0}
          theme="dark"
          trigger={null}
        >
          <Legend />
        </Sider>
        <Layout id="main_content-layout">
          <button
            id="sider_toggle"
            className={collapsed ? "collapsed" : ""}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <Content id="main_content">
            <div id="dotfield_bg">
              <DotField
                dotRadius={1.5}
                dotSpacing={14}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={false}
                waveAmplitude={0}
                cursorRadius={500}
                cursorForce={0.1}
                bulgeOnly
                gradientFrom="#A855F7"
                gradientTo="#B497CF"
                glowColor="#120F17"
              />
            </div>
            <h1 id="main_title">Data Science</h1>
            <MainTree />
          </Content>
        </Layout>
      </Layout>
      <ModalShow />
    </ContextCompMainPage>
  );
};

export default MainPage;
