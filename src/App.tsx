import React from 'react';
import VideoTemplate from './components/video/VideoTemplate';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <div className="w-full h-screen bg-[#0D1A0B] overflow-hidden m-0 p-0">
        <VideoTemplate />
      </div>
    </HelmetProvider>
  );
}

export default App;
