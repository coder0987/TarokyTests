import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


/*
    TODO: 
        Make steps draggable between lists
        Communicate with socketio server on changes - do this in Rules.tsx components
        Add socketio verifications - rules component
        Add 'edit' button on each step that brings client to the edit page for that step (Also. add step edit pages.)
        Make the default a choice rather than a set-in-stone taroky default (should come from socketio server)
*/

const GamePhases = () => {
  const [phases, setPhases] = useState([
    {
      id: uuidv4(),
      name: 'Pre-Bid',
      steps: [
        { id: uuidv4(), name: 'Shuffle' },
        { id: uuidv4(), name: 'Cut' },
        { id: uuidv4(), name: 'Deal' }
      ]
    },
    {
      id: uuidv4(),
      name: 'Bid',
      steps: [
        { id: uuidv4(), name: 'Bid' },
        { id: uuidv4(), name: 'Draw' },
        { id: uuidv4(), name: 'Point Cards' },
        { id: uuidv4(), name: 'Valat' },
        { id: uuidv4(), name: 'Contra' },
        { id: uuidv4(), name: 'Birds' }
      ]
    },
    {
      id: uuidv4(),
      name: 'Play',
      steps: [
        { id: uuidv4(), name: 'Lead' },
        { id: uuidv4(), name: 'Follow' },
        { id: uuidv4(), name: 'Win' }
      ]
    },
    {
      id: uuidv4(),
      name: 'End',
      steps: [
        { id: uuidv4(), name: 'Count Points' },
        { id: uuidv4(), name: 'Pay' },
        { id: uuidv4(), name: 'Reset Board' }
      ]
    }
  ]);

  // Handle drag and drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside

    const updatedPhases = [...phases];

    // Handle reordering steps within the same phase
    if (source.droppableId === destination.droppableId) {
      const phaseIndex = updatedPhases.findIndex((phase) => phase.id === source.droppableId);
      const phase = updatedPhases[phaseIndex];
      const [movedStep] = phase.steps.splice(source.index, 1);
      phase.steps.splice(destination.index, 0, movedStep);
    } else {
      // Handle dragging between phases
      const sourcePhaseIndex = updatedPhases.findIndex((phase) => phase.id === source.droppableId);
      const destinationPhaseIndex = updatedPhases.findIndex((phase) => phase.id === destination.droppableId);

      const sourcePhase = updatedPhases[sourcePhaseIndex];
      const destinationPhase = updatedPhases[destinationPhaseIndex];

      const [movedStep] = sourcePhase.steps.splice(source.index, 1);
      destinationPhase.steps.splice(destination.index, 0, movedStep);
    }

    setPhases(updatedPhases);
  };

  // Add new step
  const addStep = (phaseId) => {
    const stepName = prompt('Enter new step name:');
    if (stepName) {
      const updatedPhases = [...phases];
      const phaseIndex = updatedPhases.findIndex((phase) => phase.id === phaseId);
      updatedPhases[phaseIndex].steps.push({ id: uuidv4(), name: stepName });
      setPhases(updatedPhases);
    }
  };

  // Delete step
  const deleteStep = (phaseId, stepIndex) => {
    const updatedPhases = [...phases];
    const phaseIndex = updatedPhases.findIndex((phase) => phase.id === phaseId);
    updatedPhases[phaseIndex].steps.splice(stepIndex, 1);
    setPhases(updatedPhases);
  };

  return (
    <div className="tab-content container-fluid w-full bg-white shadow-lg rounded-lg p-4" id="order">
      <div className="row space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((phase) => (
          <div key={phase.id} className="col flex flex-col bg-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">{phase.name}</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={phase.id}>
                {(provided) => (
                  <ul
                    className="list-group space-y-2"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {phase.steps.map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided) => (
                          <li
                            className="list-group-item bg-white hover:bg-gray-50 border rounded-lg p-2 flex items-center justify-between"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <span className="text-gray-800">{step.name}</span>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => deleteStep(phase.id, index)}
                            >
                              &times;
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <li
                      className="list-group-item cursor-pointer bg-green-100 hover:bg-green-200 text-center text-green-600 rounded-lg py-2"
                      onClick={() => addStep(phase.id)}
                    >
                      + Add
                    </li>
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePhases;
