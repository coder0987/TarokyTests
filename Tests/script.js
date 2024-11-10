function openTab(evt, tab) {
  const tabContent = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none';
  }

  const tabLinks = document.getElementsByClassName('tab-link');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('active');
  }

  document.getElementById(tab).style.display = 'block';
  evt.currentTarget.classList.add('active');
}

$(document).ready(function() {
    document.getElementById('general-tab').addEventListener('click',(e) => openTab(e,'general'));
    document.getElementById('order-tab').addEventListener('click',(e) => openTab(e,'order'));
    document.getElementById('pre-bid-tab').addEventListener('click',(e) => openTab(e,'pre-bid'));
    document.getElementById('bid-tab').addEventListener('click',(e) => openTab(e,'bid'));
    document.getElementById('play-tab').addEventListener('click',(e) => openTab(e,'play'));
    document.getElementById('end-tab').addEventListener('click',(e) => openTab(e,'end'));

    document.getElementById('general-tab').click();
});