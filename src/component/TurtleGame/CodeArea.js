// Dans CodeArea.js
import React from 'react';

const CodeArea = ({ onDrop, onDragOver, code, onReset, onExecute, onDeleteBlock }) => {
  const lines = code.split('\n');

  return (
    <div className="codeArea" onDrop={onDrop} onDragOver={onDragOver}>
      
      {lines.slice(0, -1).map((line, index) => (
        <div key={index}>
          <span>{line}</span>
          <button className="small-button button-delete" onClick={() => onDeleteBlock(index)}>X</button>
        </div>
      ))}
      <div>
        <button className="button-reset small-button" onClick={onReset}>
          Reset
        </button>
        <button className="button-execute small-button" onClick={onExecute}>
          Exécuter
        </button>
      </div>
    </div>
  );
};

export default CodeArea;
