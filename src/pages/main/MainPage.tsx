import { ContextCompMainPage } from "./Context/ContextMainPage";
import { Layout } from "antd";
import { lazy, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

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
          <Content>
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
