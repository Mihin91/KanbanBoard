import React, { useState } from 'react';
import Header from './components/Header';
import Center from './components/Center';

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);

  return (
    <div className="bg-gray-100 dark:bg-[#20212c] min-h-screen">
      <Header 
        boardModalOpen={boardModalOpen} 
        setBoardModalOpen={setBoardModalOpen} 
      />
      <Center />
    </div>
  );
}

export default App;
