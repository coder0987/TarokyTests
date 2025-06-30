import { TRUMP_VALUE, VALUE_REVERSE_ACE_HIGH, VALUE_REVERSE } from "../enums";
import { table } from "../types";

function highestUnplayedTrump(booleanArray: boolean[]) {
    for (let i=53; i>=32; i--) {
        if (!booleanArray[i]) {
            //This trump has not been played
            return {suit:'Trump', value:TRUMP_VALUE[i - 32]};
        }
    }
    return {suit:'Trump', value:'I'};
}
function whoIsWinning(table: table[], aceHigh: boolean) {
    let trickLeadCard = table[0]?.card;
    let trickLeadSuit = trickLeadCard?.suit;
    let highestTrump = -1;
    let currentWinner = 0;//LeadPlayer is assumed to be winning

    let reverseEnum = aceHigh ? VALUE_REVERSE_ACE_HIGH : VALUE_REVERSE;

    for (let i=0; i<table.length; i++) {
        if (table[i]?.card.suit == 'Trump' && (reverseEnum[table[i]?.card.value as number] as number) > highestTrump) {
            highestTrump = reverseEnum[table[i]?.card.value as number] as number;
            currentWinner = i;
        }
    }
    if (highestTrump != -1) {
        //If a trump was played, then the highest trump wins
        return table[currentWinner];
    }
    let highestOfLeadSuit = reverseEnum[trickLeadCard?.value as number];
    for (let i=1; i<table.length; i++) {
        if (table[i]?.card.suit == trickLeadSuit && (reverseEnum[table[i]?.card.value as number] as number) > (highestOfLeadSuit as number)) {
            highestOfLeadSuit = reverseEnum[table[i]?.card.value as number];
            currentWinner = i;
        }
    }
    return table[currentWinner];
}

module.exports = {
    highestUnplayedTrump,
    whoIsWinning
}