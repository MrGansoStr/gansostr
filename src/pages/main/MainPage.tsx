import { lazy, Suspense } from 'react';
import { ContextCompMainPage, UseContextMainPage } from './Context/ContextMainPage';
import PortfolioExplorer from './components/Explorer/PortfolioExplorer';

const ModalShow = lazy(() => import('./components/Modal/ModalShow'));

function PortfolioModal() {
  const { modalOpen } = UseContextMainPage();
  return modalOpen ? <Suspense fallback={null}><ModalShow /></Suspense> : null;
}

export default function MainPage() {
  return (
    <ContextCompMainPage>
      <PortfolioExplorer />
      <PortfolioModal />
    </ContextCompMainPage>
  );
}
