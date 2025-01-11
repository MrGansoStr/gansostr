// import { Button, Tooltip } from "antd";
// import MainTree from "./components/Tree/MainTree";
import { ContextCompMainPage } from "./Context/ContextMainPage";
// import ModalShow from "./components/Modal/ModalShow";
// import Legend from "./components/Legend/Legend";
import { lazy } from 'react';

const ModalShow = lazy(() => import('./components/Modal/ModalShow.tsx'));
const MainTree = lazy(() => import('./components/Tree/MainTree.tsx'));
const Legend = lazy(() => import('./components/Legend/Legend.tsx'));

const MainPage = () => {
  return (
    <>
      <ContextCompMainPage>
        {/* <Tooltip
          title={() => (
            <>
              Esto es una prueba <Button size="small">Ver mas</Button>
            </>
          )}
        >
        </Tooltip> */}
          <h1 id="main_title">Data Science</h1>
        <MainTree />
        <ModalShow/>
        <Legend/>
      </ContextCompMainPage>
    </>
  );
};

export default MainPage;
