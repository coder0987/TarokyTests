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