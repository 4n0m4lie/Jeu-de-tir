let container = document.querySelector('.container');
let btn = document.querySelector('.start_btn');
let scoreContainer = document.querySelector('.score');
let timeContainer = document.querySelector('.time');
let highscoresContainer = document.querySelector('.highscores');

// Récupérer le highscore depuis localStorage ou initialiser à 0
let highscore = localStorage.getItem('shootingGameHighscore') ? parseInt(localStorage.getItem('shootingGameHighscore')) : 0;

// Afficher le highscore initial
highscoresContainer.innerHTML = "Meilleur score : " + highscore;

// Ajouter après la création du conteneur
container.addEventListener('selectstart', function(e) {
    e.preventDefault(); // Empêcher la sélection de texte
});

container.addEventListener('dragstart', function(e) {
    e.preventDefault(); // Empêcher le glisser-déposer
});

// Calculer les dimensions une seule fois
const targetWidth = 50;
const targetHeight = 50;
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

btn.onclick = function() {
    let score = 0;
    let time = 20;
    container.innerHTML = "";

    let interval = setInterval(function showTarget() {
        // Au lieu de supprimer toutes les cibles, ne supprimer que celles qui ont expiré
        let existingTargets = container.querySelectorAll('.target');
        existingTargets.forEach(target => {
            if (!target.expirationTime || target.expirationTime <= Date.now()) {
                clearInterval(target.moveInterval);
                target.remove();
            }
        });

        // Ajouter de nouvelles cibles seulement si nécessaire
        let numTargets = Math.floor(Math.random() * 3) + 1; // Réduire le nombre max

        for (let i = 0; i < numTargets; i++) {
            // Création de la cible
            let target = document.createElement('img');
            target.className = "target";
            target.src = "cat.png";
            container.appendChild(target);

            // Réduire la taille de la cible
            target.style.width = targetWidth + 'px'; // Définir la largeur de la cible
            target.style.height = targetHeight + 'px'; // Définir la hauteur de la cible

            target.style.position = 'absolute'; // Assurez-vous que l'image est positionnée absolument

            // Position initiale aléatoire de la cible
            target.style.top = Math.random() * (containerHeight - targetHeight) + 'px';
            target.style.left = Math.random() * (containerWidth - targetWidth) + 'px';

            // Fonction pour déplacer la cible de façon fluide (mouvement DVD)
            function moveTarget() {
                let top = parseFloat(target.style.top);
                let left = parseFloat(target.style.left);

                // Si pas de direction définie, initialiser
                if (!target.deltaTop) target.deltaTop = (Math.random() > 0.5 ? 1 : -1) * 0.5;
                if (!target.deltaLeft) target.deltaLeft = (Math.random() > 0.5 ? 1 : -1) * 0.5;

                // Nouvelle position
                let newTop = top + target.deltaTop;
                let newLeft = left + target.deltaLeft;

                // Rebond sur les bords verticaux
                if (newTop <= 0 || newTop >= containerHeight - targetHeight) {
                    target.deltaTop = -target.deltaTop;
                    newTop = Math.max(0, Math.min(containerHeight - targetHeight, newTop));
                }

                // Rebond sur les bords horizontaux
                if (newLeft <= 0 || newLeft >= containerWidth - targetWidth) {
                    target.deltaLeft = -target.deltaLeft;
                    newLeft = Math.max(0, Math.min(containerWidth - targetWidth, newLeft));
                }

                target.style.top = newTop + 'px';
                target.style.left = newLeft + 'px';
            }

            // Déplacer la cible plus fréquemment mais avec des mouvements plus petits
            target.moveInterval = setInterval(moveTarget, 16); // ~60fps au lieu de 10ms

            // Faire disparaître la cible après 3 secondes
            target.expirationTime = Date.now() + 5000;

            // Quand on clique sur le target
            target.onclick = function(event) {
                event.preventDefault(); // Empêcher le comportement par défaut
                event.stopPropagation(); // Empêcher la propagation de l'événement
                score += 1;
                clearInterval(target.moveInterval); // Arrêter le mouvement
                target.remove(); // Supprimer complètement au lieu de cacher
            }
        }

        time -= 1;

        // Afficher les infos
        scoreContainer.innerHTML = `Score : ${score}`;
        timeContainer.innerHTML = `Temps : ${time}`;

        // Fin du jeu quand le temps est écoulé
        if (time == 0) {
            clearInterval(interval);
            // Nettoyer tous les intervalles actifs
            container.querySelectorAll('.target').forEach(target => {
                if (target.moveInterval) clearInterval(target.moveInterval);
            });
            container.innerHTML = `<div style="text-align: center; color: white; font-size: 20px;">Game Over!<br>Score final : ${score}</div>`;
            
            // Mettre à jour et sauvegarder le highscore
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('shootingGameHighscore', highscore.toString());
            }
            
            highscoresContainer.innerHTML = "Meilleur score : " + highscore;
        }
        
    }, 2000); // Augmenter l'intervalle pour moins de spam
}