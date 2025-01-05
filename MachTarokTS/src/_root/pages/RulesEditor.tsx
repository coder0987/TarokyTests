import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RulesNav from '@/components/shared/RulesNav';
import { General, GamePhases, RulesPhases, TemplateSelect } from './';
import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';

/*
    TODO:
        The page should open to a template page. Ex:
            Start from a Template
            Taroky - Canasta - Blank //Retrieved from the socketio server
            Star from Your Game
            Custom 1 - Custom 2 - Custom 3 //Retrieved from the socketio server
            Import from a Code
            textInputBox //Sent to and decoded by the socketio server. could be a reference to a player save, or a complete rules code
        
        Once a template has been chosen, that should be sent to the socketio server
        Socketio server responds with 3 things:
        1. General - the basic info about the game. Player count, deck type, custom names
        2. Phases list - What the steps and phases are
        3. Step details - (technically part of step 2, but presented to the user separately) what each step consists of

        Adding a phase should add a tab
        Adding a step adds a list inside the tab
        Template steps and instructions (e.g. 'Deal the deck', 'Pay chips', etc.) should be made available
        Certain instructions (Each step must have a 'Next' instruction) are required and should be validated

        Every edit should be sent to the socketio server
        State should be regained on reload
        A restart button should be added. Clicking the restart button should NOT send a restart signal to the server
            Instead, it should go back to the template select screen. When a new template is selected, then overwrite the old logic

        Custom Names
            Custom Pile names (Hand, Talon, etc.)
            Custom counter names (Points, chips)
            Custom player indicator names (Povinnost, Prever)
            Custom player collections (teams)
            Custom flags (Valat, contra, etc.)
            These should all be kept in 'General' and referenceable throughout the instructions

        Initial state
            Game board should have piles, counters, etc.
                Deck (pile 0)
                Talon (pile 1)
                Prever talon (pile 2)
                Povinnost (indicator 0)
                Prever (indicator 1)
                Povinnost-team (collection 0)
                Against-povinnost-team (collection 1)

            All Players
                Hand (pile 0)
                Discard (pile 1)
                Chips (counter 0)
                Valat (flag 0)
                Contra (flag 1)
                etc.
        
            These must be added to BOTH the Rules object in the socketio server AND this rules page (In the General tab)
*/

const Rules = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('general');

    const [currentStep, setCurrentStep] = useState(0); // 0 = template, 1 = rules

    //Step 1: Choose a template
    const [templates, setTemplates] = useState(null);
    const [customTemplates, setCustomTemplates] = useState(null);
    const [currentRules, setCurrentRules] = useState(null);

    const handleTemplateSelect = (template: string) => {
        setCurrentStep(1);
        if (template === 'blank') {

        } else if (template === 'continue') {
            socket.emit('getPhases', (response : string[]) => {
                setPhases(response);
            })
        } else {
            socket.emit('useTemplate', template, (response : string[]) => {
                setPhases(response);
            });
        }
        
    }

    //Step 2: Customize rules
    const [phases, setPhases] = useState(null);
    const [steps, setSteps] = useState(null);
    const [basic, setBasic] = useState(null);

    const handleTabClick = (tabId : string) => {
        setActiveTab(tabId);
    };
    
    //Socket
    const { socket } = useSocket();

    const SocketHandler = {
        updatePhaseList: (phases) => {
            setPhases(phases);
            if (socket) {
                socket.emit('rules', 'set', phases);
            }
        },
        updatePhaseSteps: (steps) => {

        }
    }

    useEffect(() => {
        if (socket) {
          socket.emit('getTemplates', (response : string[]) => {
            if (typeof response === 'undefined' || !response) {
                return;
            }
            setTemplates(response);
          });
          socket.emit('getCustomTemplates', (response : string[]) => {
            if (typeof response === 'undefined' || !response) {
                return;
            }
            setCustomTemplates(response);
          });
          socket.on('rules', (type, data) => {

          });
        }
      }, [socket]);

    if (currentStep === 0) {
        return (
            <TemplateSelect templates={templates} saves={customTemplates} handleTemplateSelect={handleTemplateSelect} />
        )
    }
    
    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <RulesNav activeTab={activeTab} onTabClick={handleTabClick} dynamicTabs={phases} />
            </div>
            {activeTab === 'general' && <General basic={basic} />}
            {activeTab === 'order' && <GamePhases />}
            {phases && phases.map((value : string, key : string) => {
                if (activeTab === value) {
                    return (
                        <RulesPhases key={key} steps={steps ? steps[value] : []} />
                    );
                }
                return (
                    <></>
                );
            })}
        </div>
    )
}

export default Rules