import React, { useState } from 'react';

// Define the valid instructions and their parameters
const VALID_INSTRUCTIONS = {
  SHUFFLE: { pile: 'string' },
  DEAL: { numCards: 'number', fromPile: 'string', toPile: 'string' },
  WINNER: { player: 'string' },
  // Add more instructions as needed
};

// Placeholder for different deck names, pile names, player names
const deckNames = ['main deck', 'player 1 deck', 'player 2 deck'];
const playerNames = ['Player 1', 'Player 2', 'Player 3'];
const piles = ['deck', 'board', 'discard pile'];

// Helper to render inputs based on parameter type
const renderParamInput = (paramType, paramValue, onChange) => {
  if (paramType === 'string') {
    return (
      <select className="dropdown" value={paramValue} onChange={(e) => onChange(e.target.value)}>
        {/* Dynamically populate based on the type of string parameter */}
        {paramValue === 'player' && playerNames.map((player) => (
          <option key={player} value={player}>{player}</option>
        ))}
        {paramValue === 'pile' && piles.map((pile) => (
          <option key={pile} value={pile}>{pile}</option>
        ))}
        {paramValue === 'deck' && deckNames.map((deck) => (
          <option key={deck} value={deck}>{deck}</option>
        ))}
      </select>
    );
  }

  if (paramType === 'number') {
    return (
      <input
        className="input-number"
        type="number"
        value={paramValue}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  return null;
};

const Test = () => {
  // List of instructions entered by the user
  const [instructionList, setInstructionList] = useState([]);

  // Function to add a new instruction
  const addInstruction = (instructionName) => {
    const params = Object.keys(VALID_INSTRUCTIONS[instructionName]).map((param) => {
      // Set default value for parameters based on their type
      if (VALID_INSTRUCTIONS[instructionName][param] === 'number') {
        return 0; // Default number is 0
      }
      return ''; // Default string is empty
    });

    setInstructionList([
      ...instructionList,
      { i: instructionName, params },
    ]);
  };

  // Function to update parameter for a specific instruction
  const handleParamChange = (index, paramIndex, newValue) => {
    const updatedInstructionList = [...instructionList];
    updatedInstructionList[index].params[paramIndex] = newValue;
    setInstructionList(updatedInstructionList);
  };

  // Function to delete an instruction
  const deleteInstruction = (index) => {
    const updatedInstructionList = instructionList.filter((_, i) => i !== index);
    setInstructionList(updatedInstructionList);
  };

  // Function to handle key press in the input box
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const [instructionName] = e.target.value.split(' ')[0];
      if (VALID_INSTRUCTIONS[instructionName]) {
        addInstruction(instructionName);
        e.target.value = ''; // Clear the input after adding the instruction
      }
    }
  };

  // Function to render instructions
  const renderInstruction = (instruction, index) => {
    const { i, params } = instruction;
    const paramNames = Object.keys(VALID_INSTRUCTIONS[i]);

    return (
      <div key={index} className="instruction-container">
        <div className="instruction-header">
          {i}
          <button className="delete-button" onClick={() => deleteInstruction(index)}>Delete</button>
        </div>
        <div className="instruction-params">
          {paramNames.map((paramName, paramIndex) => (
            <div key={paramIndex} className="param-container">
              <label className="param-label">{paramName}:</label>
              {renderParamInput(
                VALID_INSTRUCTIONS[i][paramName],
                params[paramIndex],
                (newValue) => handleParamChange(index, paramIndex, newValue)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <h2 className="title">Instructions</h2>

      {/* Render each instruction in the list */}
      {instructionList.map((instruction, index) => renderInstruction(instruction, index))}

      {/* Add new instruction */}
      <div className="button-container">
        <button className="add-button" onClick={() => addInstruction('SHUFFLE')}>Add SHUFFLE Instruction</button>
        <button className="add-button" onClick={() => addInstruction('DEAL')}>Add DEAL Instruction</button>
        <button className="add-button" onClick={() => addInstruction('WINNER')}>Add WINNER Instruction</button>
      </div>

      {/* Text input to add instructions dynamically */}
      <div className="input-container">
        <input
          className="instruction-input"
          type="text"
          placeholder="Enter instruction (e.g., SHUFFLE main deck)"
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Test;

// CSS (in the same file for simplicity)

const styles = `
  .app-container {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f9f9f9;
    max-width: 600px;
    margin: auto;
    border-radius: 10px;
  }

  .title {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }

  .instruction-container {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .instruction-header {
    font-weight: bold;
    color: #444;
    margin-bottom: 5px;
    text-align: left;
    flex-grow: 1;
  }

  .instruction-params {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .param-container {
    margin: 5px 0;
  }

  .param-label {
    font-size: 1rem;
    margin-right: 10px;
  }

  .dropdown, .input-number {
    padding: 8px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-left: 10px;
  }

  .button-container {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .add-button {
    padding: 10px 15px;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 10px;
  }

  .add-button:hover {
    background-color: #0056b3;
  }

  .delete-button {
    padding: 5px 10px;
    font-size: 0.875rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .delete-button:hover {
    background-color: #c82333;
  }

  .input-container {
    margin-top: 20px;
  }

  .instruction-input {
    padding: 10px;
    width: 100%;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-top: 5px;
  }

  .instruction-input:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
