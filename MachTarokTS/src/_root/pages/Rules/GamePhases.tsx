import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { StepsList } from "@/types";


/*
    TODO: 
        Make steps draggable between lists
        Communicate with socketio server on changes - do this in Rules.tsx components
        Add socketio verifications - rules component
        Add 'edit' button on each step that brings client to the edit page for that step (Also. add step edit pages.)
        Make the default a choice rather than a set-in-stone taroky default (should come from socketio server)
*/
interface GamePhasesProps {
  steps: StepsList;
  phases: string[];
  changePhases: (newPhases : string[]) => void;
  changeSteps: (newSteps : StepsList) => void;
  changeStepsAndPhases: (newSteps : StepsList, newPhases : string[]) => void;
}

const GamePhases: React.FC<GamePhasesProps> = ({ steps, phases, changeSteps, changePhases, changeStepsAndPhases }) => {
  const [dragDropList, setDragDropList] = useState(null);

  useEffect(() => {
    let list = [];
    for (let i in steps) {
      let obj = {
        id: uuidv4(),
        name: i,
        steps: []
      };

      for (let step of steps[i]) {
        obj.steps.push({ id: uuidv4(), name: step });
      }
  
      list.push(obj);
    }
    console.log(JSON.stringify(list));
    setDragDropList(list);
  }, [steps, phases]);


  const updateDragDropList = (updatedList) => {
    let newSteps = {};
    let newPhases = [];
    for (let i in updatedList) {
      newPhases.push(updatedList[i].name);
      let thisPhase = [];
      for (let j in updatedList[i].steps) {
        thisPhase.push(updatedList[i].steps[j].name);
      }
      newSteps[updatedList[i].name] = thisPhase;
    }
    changeStepsAndPhases(newSteps, newPhases);
  }

  const updateSteps = (updatedList) => {
    let newSteps = {};
    for (let i in updatedList) {
      let thisPhase = [];
      for (let j in updatedList[i].steps) {
        thisPhase.push(updatedList[i].steps[j].name);
      }
      newSteps[updatedList[i].name] = thisPhase;
    }
    changeSteps(newSteps);
  }
  

  // Handle drag and drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside

    const updatedDragDropList = [...dragDropList];

    // Handle reordering steps within the same phase
    if (source.droppableId === destination.droppableId) {
      const phaseIndex = updatedDragDropList.findIndex((phase) => phase.id === source.droppableId);
      const phase = updatedDragDropList[phaseIndex];
      const [movedStep] = phase.steps.splice(source.index, 1);
      phase.steps.splice(destination.index, 0, movedStep);
    } else {
      // Handle dragging between phases
      const sourcePhaseIndex = updatedDragDropList.findIndex((phase) => phase.id === source.droppableId);
      const destinationPhaseIndex = updatedDragDropList.findIndex((phase) => phase.id === destination.droppableId);

      const sourcePhase = updatedDragDropList[sourcePhaseIndex];
      const destinationPhase = updatedDragDropList[destinationPhaseIndex];

      const [movedStep] = sourcePhase.steps.splice(source.index, 1);
      destinationPhase.steps.splice(destination.index, 0, movedStep);
    }

    updateDragDropList(updatedDragDropList);
  };

  const addStep = (phaseId) => {
    const stepName = prompt('Enter new step name:');
    if (stepName) {
      const updatedDragDropList = [...dragDropList];
      const phaseIndex = updatedDragDropList.findIndex((phase) => phase.id === phaseId);
      updatedDragDropList[phaseIndex].steps.push({ id: uuidv4(), name: stepName });
      updateSteps(updatedDragDropList);
    }
  };

  const deleteStep = (phaseId, stepIndex) => {
    const updatedDragDropList = [...dragDropList];
    const phaseIndex = updatedDragDropList.findIndex((phase) => phase.id === phaseId);
    updatedDragDropList[phaseIndex].steps.splice(stepIndex, 1);
    updateSteps(updatedDragDropList);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4" id="order">
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dragDropList && dragDropList.map((phase) => (
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
