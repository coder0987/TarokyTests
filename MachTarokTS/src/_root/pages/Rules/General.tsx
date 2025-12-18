//import { BasicRules, DeckType } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { AOESelector, CountersCreator, FlagsCreator, PilesCreator } from "@/components/shared";

//*
export enum DeckType {
  Standard = "Standard",
  Tarok = "Tarok",
}
export type BasicRules = {
  deck: DeckType;
  numDecks: number;
  deckScaling: number;
  playerMin: number;
  playerMax: number;
  type: number;
  start: string;
};
//*/

interface GeneralProps {
  basic: BasicRules;
  changeBasic: (basic: BasicRules) => void;
  restart: () => void;
  save: () => void;
}

const General: React.FC<GeneralProps> = ({ basic, changeBasic, restart, save }) => {
  if (basic === null) { return; }
  const [deckType, setDeckType] = useState<DeckType>(basic.deck || DeckType.Standard);
  const [numDecks, setNumDecks] = useState<number>(basic.numDecks || 1);
  const [deckScaling, setDeckScaling] = useState<number>(basic.deckScaling || 0);
  const [minimumPlayers, setMinimumPlayers] = useState<number>(basic.playerMin || 2);
  const [maximumPlayers, setMaximumPlayers] = useState<number>(basic.playerMax || -1);

  const handleNumberInputChange = (value: string, min: number, max: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    // Remove any non-digit characters
    let updatedValue: any = value;
    const cleanValue = value.replace(/[^\d-]/g, '');

    // Convert to number, handling empty string case
    const numValue = cleanValue === '' ? 1 : Number(cleanValue);

    if (isNaN(numValue) || numValue <= min) {
      setter(min);
      updatedValue = min;
    } else if (numValue >= max) {
      setter(max);
      updatedValue = max;
    } else {
      // Ensure we're setting a whole number by removing any decimals
      setter(Math.floor(numValue));
      updatedValue = Math.floor(numValue);
    }
    return updatedValue;
  };

  const handleDeckTypeChange = (type: DeckType) => {
    setDeckType(type);
    let newBasic = basic
    newBasic.deck = type;
    changeBasic(newBasic);
  };

  const handleDeckNumChange = (value: string) => {
    let newBasic = basic;
    newBasic.numDecks = handleNumberInputChange(value, 1, 50, setNumDecks);;
    changeBasic(newBasic);
  };

  const handleDeckScalingChange = (value: string) => {
    let newBasic = basic;
    newBasic.deckScaling = handleNumberInputChange(value, 0, 16, setDeckScaling);;
    changeBasic(newBasic);
  };

  const handleMinPlayerChange = (value: string) => {
    let newBasic = basic;
    newBasic.playerMin = handleNumberInputChange(value, 1, 50, setMinimumPlayers);;
    changeBasic(newBasic);
  };

  const handleMaxPlayerChange = (value: string) => {
    const cleanValue = value.replace(/[^\d-]/g, '');
    const numValue = cleanValue === '' ? 1 : Number(cleanValue);
    let updatedValue: any = value;
    if (isNaN(numValue) || numValue <= -1) {
      setMaximumPlayers(-1);
      updatedValue = -1;
    } else if (numValue === 0) {
      if (maximumPlayers === -1) {
        setMaximumPlayers(1);
        updatedValue = 1;
      } else {
        setMaximumPlayers(-1);
        updatedValue = -1;
      }
    }
    else {
      setMaximumPlayers(Math.floor(numValue));
      updatedValue = Math.floor(numValue);
    }
    let newBasic = basic;
    newBasic.playerMax = updatedValue;
    changeBasic(newBasic);
  };

  const handleRestartClick = () => {
    restart();
  }

  const handleSaveClick = () => {
    save();
  }

  useEffect(() => {
  }, [basic]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex gap-3 flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row justify-center gap-3">
          <div className="flex flex-col gap-2 bg-white shadow-lg rounded-lg p-4 min-w-[320px] items-center" id="general-deck-and-players">
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Deck: </div>
              <div>
                <AOESelector<DeckType> currentSelected={deckType} options={[DeckType.Standard, DeckType.Tarok]} onSelectionChange={(value) => handleDeckTypeChange(value)} />
              </div>
            </div>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Number of Decks: </div>
              <div>
                <Input
                  className="w-[75px]"
                  type="number"
                  value={numDecks}
                  onChange={(e) => handleDeckNumChange(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Deck Scaling: </div>
              <div>
                <Input
                  className="w-[75px]"
                  type="number"
                  value={deckScaling}
                  onChange={(e) => handleDeckScalingChange(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Minimum Players: </div>
              <div>
                <Input
                  className="w-[75px]"
                  type="number"
                  value={minimumPlayers}
                  onChange={(e) => handleMinPlayerChange(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Maximum Players: </div>
              <div>
                <Input
                  className="w-[75px]"
                  type="number"
                  value={maximumPlayers}
                  onChange={(e) => handleMaxPlayerChange(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            {/* <div className="flex flex-row gap-1 w-full items-center justify-between">
            <div>Progression Type: </div>
          </div> */}
          </div>
          <div className="flex flex-col gap-2 bg-white shadow-lg rounded-lg p-4 min-w-[320px] items-center" id="general-game-def">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Player</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-0">
                    <div className="flex flex-col">
                      <div>Piles: </div>
                      <PilesCreator initialPiles={[]} />
                    </div>
                    <div className="flex flex-col">
                      <div>Counters: </div>
                      <CountersCreator initialCounters={[]} />
                    </div>
                    <div className="flex flex-col">
                      <div>Flags: </div>
                      <FlagsCreator initialFlags={[]} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-2">
                <AccordionTrigger>Board</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-0">
                    <div className="flex flex-col">
                      <div>Piles: </div>
                      <PilesCreator initialPiles={[]} />
                    </div>
                    <div className="flex flex-col">
                      <div>Counters: </div>
                      <CountersCreator initialCounters={[]} />
                    </div>
                    <div className="flex flex-col">
                      <div>Flags: </div>
                      <FlagsCreator initialFlags={[]} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Pointers: </div>
            </div>
            <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Initial: </div>
            </div>
            {/* <div className="flex flex-row gap-1 w-full items-center justify-between">
              <div>Start: </div>
            </div> */}
          </div>
        </div>
        <div className="flex flex-row w-full gap-2 items-center">
          <div className="flex flex-1 cursor-pointer justify-center items-center bg-red p-4 rounded-lg" onClick={handleRestartClick}><span className="text-white">Restart</span></div>
          <div className="flex flex-1 cursor-pointer justify-center items-center bg-navy p-4 rounded-lg" onClick={handleSaveClick}>  <span className="text-white">Save</span></div>
        </div>
      </div>
    </div>
  );
};

export default General;
