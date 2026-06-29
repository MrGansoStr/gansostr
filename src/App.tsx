import { Suspense } from 'react'

import MainPage from './pages/main/MainPage';

import { Spin } from 'antd';

const FallbackLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Spin size="large" />
  </div>
);


function App() {

  return (
    <>
    <Suspense fallback={<FallbackLoader/>}>
      <MainPage/>
    </Suspense>
    </>
  )
}

export default App
