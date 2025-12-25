export function getFormattedTime() {
    const date = new Date(Date.now());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; //convert 0 to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return formattedTime;
}

export function sanitizeInput(text: string): string {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function playerPerspective(originalPlace, viewpoint) {
  //Ex. if player 0 is povinnost and player 1 is AI, then from AI's view player 3 is povinnost
  return (+originalPlace - +viewpoint + 4) % 4;
}

export function romanize(num: number): string {
  //Code copied from https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
  if (isNaN(num)) return '' + num;
  if (num == 4) {
    return "IIII";
  } //Taroky cards have IIII instead of IV, but not for the XIV
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}