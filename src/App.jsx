import React, { useState } from 'react';
import Header from './components/Header';
import Center from './components/Center';
import AddEditBoardModal from './modals/AddEditBoardModal'; 

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);

  return (
    <div>
      <Header 
        boardModalOpen={boardModalOpen} 
        setBoardModalOpen={setBoardModalOpen} 
      />
      <Center />

      {/* Render the modal OUTSIDE the header so it overlays the entire screen */}
      {boardModalOpen && (
        <AddEditBoardModal 
          setBoardModalOpen={setBoardModalOpen} 
          type="add"
        />
      )}
    </div>
  );
}

export default App;
