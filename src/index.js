import $ from 'jquery'; // import jquery

// DECLARATIONS hors dom ****
// Décor
let decorPosY = 0,
  cloudPosY = 0;
// Météorites
let meteorX,
  meteorY,
  meteorSpeed;
// Tir laser
let shot = false,
  shotId = 0;
// Clavier
let touche = [];

$(document).ready(() => {
  // CIBLAGES dom ****
  let clientX = document.body.clientWidth,
    clientY = document.body.clientHeight;
  // Vaisseau
  let shipVX = parseInt($('#vaisseau').css('left')),
    shipVY = parseInt($('#vaisseau').css('bottom'));

  // FONCTIONS ****
  const initGame = () => {
    // EVENEMENT ****
    document.addEventListener('keydown', (event) => {
      touche[event.keyCode] = true;
    });
    document.addEventListener('keyup', (event) => {
      touche[event.keyCode] = false;
    });

    // Génération des météorites
    for (let i = 0; i < 10; i++) {
      $('#vaisseau').after('<div class="meteor" data-speed="" data-etat=""></div>');
    }
    $('.meteor').each(function () {
      meteorX = Math.round(Math.random()*(clientX - 260)); // Positionnement X
      meteorX < 200 && (meteorX += 200);
      meteorY = 0;
      // Affichage
      $(this).css('left', `${meteorX}px`);
    });
    // Démarrage
    gameLoop();
  };

  const gameLoop = () => {

    // GESTION DU DECOR ***
    (decorPosY >= 112) ? decorPosY = 0 : decorPosY += 1; // Reset position quand supérieur à sa taille
    document.getElementById('decor').style.backgroundPositionY = `${decorPosY}px`; // Déplacement
    // Nuages
    (cloudPosY >= 1280) ? cloudPosY = 0 : cloudPosY += 2; // Reset position quand superieur à sa taille
    $('#decor div').css('background-position-y', cloudPosY); // Déplacement (jquery)

    // GESTION VAISSEAU ***
    if (touche[37]) { // Gauche
      shipVX >= 200 && (shipVX -= 5); // limite 200px du bord
      $('#vaisseau').css('left', shipVX).addClass('gauche');
    }
    if (touche[39]) {  // Droite
      shipVX <= clientX - 200 && (shipVX += 5); // limite 200px du bord
      $('#vaisseau').css('left', shipVX).addClass('droite');
    }
    if (touche[38]) { // Haut
      shipVY <= clientY * 0.7 && (shipVY += 5); // limite 30% du bord
      $('#vaisseau').css('bottom', shipVY);
    }
    if (touche[40]) { // Bas
      shipVY >= 50 && (shipVY -= 5); // limite 50px du bord
      $('#vaisseau').css('bottom', shipVY);
    }
    !touche[37] && ($('#vaisseau').removeClass('gauche'));
    !touche[39] && ($('#vaisseau').removeClass('droite'));
    // Gestion du TIR
    if (touche[32] && !shot) {
      $('#vaisseau').after(`<div class="laser" id="${shotId}"></div>`);
      $(`.laser#${shotId}`).css('left', shipVX).css('bottom', `${shipVY + 25}px`);
      shot = true;
      shotId ++;
      for (let i = 0; i < 20; i++) {
        $(`.laser#${i}`).css('bottom', `${$(`.laser#${i}`).css('bottom') + 10}`);
      }
      setTimeout(() => { shot = false; }, 500);
    }

    setTimeout(gameLoop, 10);
  };

  initGame();
});
