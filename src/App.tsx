import { Suspense } from 'react'

import './App.css'

import MainPage from './pages/main/MainPage';

import { Spin } from 'antd';
// import TestNeuron from './pages/main/components/TestNeuron';

const FallbackLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      // backgroundColor: '#f0f2f5',
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
      {/* <TestNeuron /> */}
    </Suspense>
    </>
  )
}

export default App
