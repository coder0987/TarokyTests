const k = 40;
const sigma = 30;
const avg = 100;

function calculateElo(startElo, actualScores) {
    
    // Step 1: Find actual performance, adjusted nonlinearly
    const performance = [];
    let pTot = 0;

    for (let i=0; i<4; i++) {
        performance[i] = Math.tanh( (actualScores[i] - avg) / sigma);
        pTot += performance[i];
    }

    for (let i=0; i<4; i++) {
        performance[i] -= pTot / 4;
    }

    // Step 2: Find expected performance
    const expected = [0,0,0,0];
    let eTot = 0;
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            if (i==j) continue;
            const diff = startElo[i] - startElo[j];
            const normalizedDiff = diff / 400;
            const pairWiseOutcome = 1 / (1 + Math.pow(10, normalizedDiff));
            expected[i] += pairWiseOutcome;
            eTot += pairWiseOutcome;
        }
    }

    for (let i=0; i<4; i++) {
        expected[i] -= eTot / 4;
    }


    // Step 3: Adjust ELO scores to match actual performance more closely
    const finalElo = [];
    for (let i=0; i<4; i++) {
        finalElo[i] = startElo[i] + k * (performance[i] - expected[i]);
    }

    return finalElo;
}

function expectedChips(elos) {
    const expected = [0,0,0,0];
    let eTot = 0;
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            if (i==j) continue;
            const diff = elos[j] - elos[i];
            const normalizedDiff = diff / 400;
            const pairWiseOutcome = 1 / (1 + Math.pow(10, normalizedDiff));
            expected[i] += pairWiseOutcome;
            eTot += pairWiseOutcome;
        }
    }

    for (let i=0; i<4; i++) {
        expected[i] -= eTot / 4;
        expected[i] /= 3;
    }

    const expectedChipOutcome = [];
    for (let i=0; i<4; i++) {
        expectedChipOutcome[i] = avg + sigma * 0.5 * Math.log( (1 + expected[i]) / (1 - expected[i])); //inverse tanh
    }

    return expectedChipOutcome;
}

// Tests
function p(v) {
    console.log(JSON.stringify(v));
}

p(expectedChips([1000,1200,800,500]));
p(expectedChips([2000,1200,800,500]));
p(expectedChips([400,1200,800,500]));

p(calculateElo([1000,1200,800,1000],[100,120,80,100]));