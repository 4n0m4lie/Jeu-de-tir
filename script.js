let container = document.querySelector('.container');
let btn = document.querySelector('.start_btn');
let scoreContainer = document.querySelector('.score');
let timeContainer = document.querySelector('.time');

btn.onclick = function(){
    let score = 0;
    let time = 20;
    container.innerHTML = "";

    let interval = setInterval(function showTarget(){
        // Suppression des anciennes cibles
        container.innerHTML = "";

        // Nombre aléatoire de cibles (entre 1 et 6)
        let numTargets = Math.floor(Math.random() * 6) + 1;

        for (let i = 0; i < numTargets; i++) {
            // Création de la cible
            let target = document.createElement('img');
            target.className = "target";
            target.src = "cat.png";
            container.appendChild(target);

            // Réduire la taille de la cible
            target.style.width = '50px'; // Définir la largeur de la cible
            target.style.height = '50px'; // Définir la hauteur de la cible


            target.style.position = 'absolute'; // Assurez-vous que l'image est positionnée absolument

            // Fonction pour déplacer la cible de façon aléatoire
            function moveTarget() {
                target.style.top = Math.random() * (container.offsetHeight - target.offsetHeight) + 'px';
                target.style.left = Math.random() * (container.offsetWidth - target.offsetWidth) + 'px';
            }

            // Déplacer la cible toutes les 1 seconde
            let moveInterval = setInterval(moveTarget, 1000);

            // Faire disparaître la cible après 3 secondes
            setTimeout(function(){
                clearInterval(moveInterval);
                target.remove();
            }, 3000);

            // Quand on clique sur le target
            target.onclick = function(){
                score += 1;
                target.style.display = 'none';
            }
        }

        time -= 1;

        // Afficher les infos
        scoreContainer.innerHTML = `Score : ${score}`;
        timeContainer.innerHTML = `Temps : ${time}`;

        // Fin du jeu quand le temps est écoulé
        if (time == 0) {
            clearInterval(interval);
            container.innerHTML = "GAME OVER";
        }
    }, 2000);
}