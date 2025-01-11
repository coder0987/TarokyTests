import { BasicRules, DeckType } from "@/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface GeneralProps {
  basic: BasicRules;
}

const General: React.FC<GeneralProps> = ({ basic }) => {

  const [deckType, setDeckType] = useState<DeckType>(DeckType.Standard);
  const [numDecks, setNumDecks] = useState<number>(1);
  const [deckScaling, setDeckScaling] = useState<number>(0);
  const [minimumPlayers, setMinimumPlayers] = useState<number>(2);
  const [maximumPlayers, setMaximumPlayers] = useState<number>(4);

  const handleNumberInputChange = (value: string, min: number, max: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');

    // Convert to number, handling empty string case
    const numValue = cleanValue === '' ? 1 : Number(cleanValue);

    if (isNaN(numValue) || numValue <= min) {
      setter(min);
    } else if (numValue >= max) {
      setter(max);
    } else {
      // Ensure we're setting a whole number by removing any decimals
      setter(Math.floor(numValue));
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-3">
      <div className="flex flex-col gap-2 bg-white shadow-lg rounded-lg p-4 min-w-[320px] items-center" id="general-deck-and-players">
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Deck: </div>
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={deckType} />
              </SelectTrigger>
              <SelectContent className="selector-content">
                <SelectItem value={DeckType.Standard}>Standard</SelectItem>
                <SelectItem value={DeckType.Tarok}>Tarok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Number of Decks: </div>
          <div>
            <Input
              className="w-[75px]"
              type="number"
              value={numDecks}
              onChange={(e) => handleNumberInputChange(e.target.value, 1, 50, setNumDecks)}
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
              onChange={(e) => handleNumberInputChange(e.target.value, 0, 50, setDeckScaling)}
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
              onChange={(e) => handleNumberInputChange(e.target.value, 1, 16, setMinimumPlayers)}
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
              onChange={(e) => handleNumberInputChange(e.target.value, 2, 16, setMaximumPlayers)}
              autoComplete="off"
            />
          </div>
        </div>
        {/* <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Progression Type: </div>
        </div> */}
      </div>
      <div className="flex flex-col gap-2 bg-white shadow-lg rounded-lg p-4 min-w-[320px] items-center" id="general-game-def">
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Player: </div>
        </div>
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Board: </div>
        </div>
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Pointers: </div>
        </div>
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Initial: </div>
        </div>
        <div className="flex flex-row gap-1 w-full items-center justify-between">
          <div>Start: </div>
        </div>
      </div>
    </div>
  );
};

export default General;
