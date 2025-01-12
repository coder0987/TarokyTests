import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RulesNav from '@/components/shared/RulesNav';
import { General, GamePhases, RulesPhases, TemplateSelect } from './';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

import { BasicRules, StepsList } from "@/types";

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

    const [currentStep, setCurrentStep] = useState(0); // 0 = template, 1 = rules
    const { showToast } = useToast();

    //Step 1: Choose a template
    const [templates, setTemplates] = useState(null);
    const [customTemplates, setCustomTemplates] = useState(null);
    const [currentRules, setCurrentRules] = useState(null);

    const { account, isAuthenticated } = useUserContext();

    const handleTemplateSelect = (template: string) => {
        setCurrentStep(1);
        if (template === 'blank') {

        } else if (template === 'continue') {
            socket && socket.emit('getPhases', (phasesList: string[], stepsList: StepsList) => {
                setPhases(phasesList);
                setSteps(stepsList);
            });
            socket && socket.emit('getBasic', (basic: BasicRules) => {
                setBasic(basic);
            });
        } else {
            setPhases(null);
            setSteps(null);
            socket && socket.emit('useTemplate', template, (phasesList: string[], stepsList: StepsList, basic: BasicRules) => {
                setPhases(phasesList);
                setSteps(stepsList);
                setBasic(basic);
            });
        }
    }

    const handleCustomTemplateSelect = (template: string) => {
        setCurrentStep(1);
        setPhases(null);
        setSteps(null);
        socket && socket.emit('useCustomTemplate', template, (phasesList: string[], stepsList: StepsList, basic: BasicRules) => {
            setPhases(phasesList);
            setSteps(stepsList);
            setBasic(basic);
        });
    }

    //Step 2: Customize rules
    const [phases, setPhases] = useState(null);
    const [steps, setSteps] = useState<StepsList | null>(null);
    const [basic, setBasic] = useState<BasicRules | null>(null);

    //Socket
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit('getTemplates', (response: string[]) => {
                if (typeof response === 'undefined' || !response) {
                    return;
                }
                setTemplates(response);
            });
            socket.emit('getCustomTemplates', (response: string[]) => {
                if (typeof response === 'undefined' || !response) {
                    return;
                }
                setCustomTemplates(response);
            });
        }
    }, [socket]);

    const changePhases = (newPhases: string[]) => {
        //Send phases to socketio
        if (socket) {
            socket.emit('setPhases', newPhases, (returnPhases: string[]) => {
                setPhases(returnPhases);
            })
        }
    }

    const changeSteps = (newSteps: StepsList) => {
        //Send phases to socketio
        if (socket) {
            socket.emit('setSteps', newSteps, (returnSteps: StepsList) => {
                setSteps(returnSteps);
            })
        }
    }

    const changeStepsAndPhases = (newSteps: StepsList, newPhases: string[]) => {
        if (socket) {
            socket.emit('setStepsAndPhases', newSteps, newPhases, (returnSteps: StepsList, returnPhases: string[]) => {
                setSteps(returnSteps);
                setPhases(returnPhases);
            })
        }
    }

    const changeBasic = (basic: BasicRules) => {
        if (socket) {
            socket.emit('setBasicRules', basic, (returnBasic: BasicRules) => {
                setBasic(returnBasic);
            })
        }
    }


    const sendSignInMessage = () => {
        showToast('You need to sign in to access this feature.', 'error');
    };

    const save = () => {
        if (!isAuthenticated) {
            //Prompt user to sign in
            sendSignInMessage();
            return;
        }
        //Prompt for template name
        let templateName = prompt('Please give your template a name');
        if (socket) {
            socket.emit('saveTemplate', templateName, (success) => {
                success ? showToast('Success!', 'success') : showToast('Oops! Try again', 'error');
                socket.emit('getCustomTemplates', (response: string[]) => {
                    if (typeof response === 'undefined' || !response) {
                        return;
                    }
                    setCustomTemplates(response);
                });
            });
        }
    }

    const restart = () => {
        setCurrentStep(0);
    }

    if (currentStep === 0) {
        return (
            <div className='w-full h-full flex flex-col items-center'>
                <div className='w-full flex flex-row items-start'>
                    <Button
                        className='back-button m-2'
                        onClick={() => {
                            // any other handling when leaving Template Select
                            navigate("/play");
                        }}>➤</Button>
                </div>
                <TemplateSelect templates={templates} saves={customTemplates} handleTemplateSelect={handleTemplateSelect} handleCustomTemplateSelect={handleCustomTemplateSelect} />
            </div>
        )
    }

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <Button
                    className='back-button m-2'
                    onClick={() => {
                        // any other handling when leaving Rules Editor
                        if (currentStep == 1) {
                            setCurrentStep(0)
                        } else {
                            navigate("/play");
                        }
                    }}>➤</Button>
            </div>
            <Tabs defaultValue="general" className='w-full'>
                <TabsList className="w-full" key="tabs-list">
                    <TabsTrigger className="text-lg font-semibold" value="general" key="general-trigger">General</TabsTrigger>
                    <TabsTrigger className="text-lg font-semibold" value="order" key="order-trigger">Order</TabsTrigger>
                    {phases && phases.map((value: string, key: string) => {
                        return <TabsTrigger className="text-lg" value={value} key={value + "-trigger"}>{value.charAt(0).toUpperCase() + value.slice(1)}</TabsTrigger>;
                    })}
                </TabsList>
                <TabsContent value="general" key="general-content">
                    <General basic={basic} changeBasic={changeBasic} save={save} restart={restart} />
                </TabsContent>
                <TabsContent value="order" key="order-content">
                    <GamePhases phases={phases} changePhases={changePhases} steps={steps} changeSteps={changeSteps} changeStepsAndPhases={changeStepsAndPhases} />
                </TabsContent>
                {phases && phases.map((value: string, key: string) => {
                    return (
                        <TabsContent value={value} key={value + "-content"}>
                            <RulesPhases key={key} phase={value} />
                        </TabsContent>
                    );
                })}
            </Tabs>

        </div>
    )
}

export default Rules;