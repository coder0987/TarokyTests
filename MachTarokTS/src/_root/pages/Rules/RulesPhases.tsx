import React, { useEffect, useState } from 'react';
import RulesNav from '@/components/shared/RulesNav';
import Instruction from './Instruction'
import { useSocket } from '@/context/SocketContext';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface RulesPhasesProps {
  phase : string;
}

const RulesPhases: React.FC<RulesPhasesProps> = ({ phase }) => {
  const [steps, setSteps] = useState<{ order: string[]; steps: any[] } | null>(null);
  /**
   * steps is a phase:
   * { order: [step], steps: {step: [instruction, instruction, instruction]}}
   */

  const [dragDropList, setDragDropList] = useState([]);

  useEffect(() => {
    let list = [];
    if (!steps) {
      setDragDropList(list);
      return;
    }
    for (let i in steps.order) {
      let obj = {
        id: uuidv4(),
        name: steps.order[i],
        instructions: []
      };

      let inst = steps.steps[steps.order[i]];

      for (let j in inst) {
        obj.instructions.push({ 
          id: uuidv4(),
          action:inst[j].action,
          targets:inst[j].targets,
          items:inst[j].items,
          custom:inst[j].custom
        });
      }
  
      list.push(obj);
    }
    console.log(JSON.stringify(steps));
    console.log(JSON.stringify(list));
    setDragDropList(list);
  }, [steps]);

  const { socket } = useSocket();

  useEffect(() => {
    socket.emit('getPhaseInstructions', phase, (instr: { order: string[]; steps: any[] }) => {
      setSteps(instr);
    });
  }, [socket]);

  const onChange = (step : string, stepIndex : number) => {
    if (socket) {
      socket.emit('setStepInstructions', phase, step, dragDropList[stepIndex].instructions, (instr: { order: string[]; steps: any[] }) => {
        setSteps(instr);
      });
    }
  }

  const onChangeSendPhase = () => {
    //Multiple steps were changed
    if (socket) {
      let phaseInstructions = {
        order: steps.order,
        steps: {}
      };
      for (let i in dragDropList) {
        let obj = [];
        let inst = dragDropList[i].instructions;
        for (let j in inst) {
          obj.push({
            action:inst[j].action,
            targets:inst[j].targets,
            items:inst[j].items,
            custom:inst[j].custom
          });
        }
        phaseInstructions[dragDropList[i].name] = obj;
      }
      socket.emit('setPhaseInstructions', phase, phaseInstructions, (instr: { order: string[]; steps: any[] }) => {
        setSteps(instr);
      });
    }
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside

    const updatedDragDropList = [...dragDropList];

    // Handle reordering steps within the same step
    if (source.droppableId === destination.droppableId) {
      const stepIndex = updatedDragDropList.findIndex((step) => step.id === source.droppableId);
      const step = updatedDragDropList[stepIndex];
      const [movedInstruction] = step.instructions.splice(source.index, 1);
      step.instructions.splice(destination.index, 0, movedInstruction);
      setDragDropList(updatedDragDropList);
      onChange(step.name, stepIndex);
    } else {
      // Handle dragging between steps
      const sourceStepIndex = updatedDragDropList.findIndex((step) => step.id === source.droppableId);
      const destinationStepIndex = updatedDragDropList.findIndex((step) => step.id === destination.droppableId);

      const sourceStep = updatedDragDropList[sourceStepIndex];
      const destinationStep = updatedDragDropList[destinationStepIndex];

      const [movedInstruction] = sourceStep.instructions.splice(source.index, 1);
      destinationStep.steps.splice(destination.index, 0, movedInstruction);
      setDragDropList(updatedDragDropList);
      onChangeSendPhase();
    }
  };

  const deleteInstruction = (id, index) => {
      const updatedDragDropList = [...dragDropList];
      const stepIndex = updatedDragDropList.findIndex((step) => step.id === id);
      updatedDragDropList[stepIndex].instructions.splice(index, 1);
      setDragDropList(updatedDragDropList);
      onChange(updatedDragDropList[stepIndex], stepIndex);
  }

  const addInstruction = (phaseId) => {
    //Create instruction of type 'Blank' and insert in
    const updatedDragDropList = [...dragDropList];
    const stepIndex = updatedDragDropList.findIndex((step) => step.id === phaseId);
    updatedDragDropList[stepIndex].instructions.push({
      id: uuidv4(),
      action: 0,
      targets: 0,
      items: 0,
      custom: null
    });
    setDragDropList(updatedDragDropList);
    onChange(updatedDragDropList[stepIndex].name, stepIndex);
  }

  const addStep = () => {
    //Create default step
    const stepName = prompt('Enter new step name:');//todo switch to selector box of default step choices
    if (stepName) {
      const updatedDragDropList = [...dragDropList];
      updatedDragDropList.push({ id: uuidv4(), name: stepName, instructions: [] });//todo add default instructions from socketio server
      setDragDropList(updatedDragDropList);
      onChangeSendPhase();
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full p-4">
        {dragDropList ? (
          // Iterate over the phase order and display the steps and instructions
          dragDropList.map((step, stepIndex) => (
            <div key={step.id} className="flex flex-col rounded-lg w-full bg-white p-4">
              <h3>Step: {step.name}</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={step.id}>
                    {(provided) => (
                      <ul
                        className="list-group space-y-2"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {step.instructions.map((instruction, index) => (
                          <Draggable key={instruction.id} draggableId={instruction.id} index={index}>
                            {(provided) => (
                              <li
                                className="list-group-item bg-white hover:bg-gray-50 border rounded-lg p-2 flex items-center justify-between"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Instruction
                                    key={index}
                                    action={instruction.action}
                                    targets={instruction.targets}
                                    items={instruction.items}
                                    custom={instruction.custom}
                                  />
                                <button
                                  className="ml-2 text-red-500 hover:text-red-700"
                                  onClick={() => deleteInstruction(instruction.id, index)}
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
                          onClick={() => addInstruction(step.id)}
                        >
                          + Add Instruction
                        </li>
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              <div
                      className=" cursor-pointer bg-green-100 hover:bg-green-200 text-center text-green-600 rounded-lg py-2"
                      onClick={() => addStep()}
                    >
                      + Add Step
                    </div>
            </div>
          ))
        ) : (
          <p>Loading steps...</p>
        )}
      </div>
    </div>
  );
};

export default RulesPhases;
