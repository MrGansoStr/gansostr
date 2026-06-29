import { ContextCompMainPage } from "./Context/ContextMainPage";
import { lazy } from 'react';

const ModalShow = lazy(() => import('./components/Modal/ModalShow.tsx'));
const MainTree = lazy(() => import('./components/Tree/MainTree.tsx'));
const Legend = lazy(() => import('./components/Legend/Legend.tsx'));

const MainPage = () => {
  return (
    <>
      <ContextCompMainPage>
          <h1 id="main_title">Data Science</h1>
        <MainTree />
        <ModalShow/>
        <Legend/>
      </ContextCompMainPage>
    </>
  );
};

export default MainPage;
