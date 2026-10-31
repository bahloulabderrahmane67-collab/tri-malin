# Puzzle Box

Jeu de puzzle de tri pour mobile, installable (PWA) et jouable hors ligne.
Range trois objets identiques dans un même bac pour les faire disparaître, et vide le plateau.

**Jouer :** https://bahloulabderrahmane67-collab.github.io/tri-malin/

## Le jeu

- 30 niveaux à difficulté croissante (3 à 6 types d'objets, 5 à 7 bacs)
- Générateur de niveaux **prouvé solvable** : chaque niveau est construit depuis l'état résolu
  puis mélangé par coups légaux inversés, donc le chemin retour existe toujours
- Notation en étoiles selon le nombre de coups, progression sauvegardée en local
- Trois aides : annuler, bac supplémentaire, indice
- Sons synthétisés à la volée (Web Audio), aucun fichier audio
- Plateau adaptatif : le nombre de colonnes est choisi pour maximiser la taille des bacs
  selon la taille de l'écran

## Structure

```
index.html              page unique
css/style.css           styles
js/game.js              logique de jeu
manifest.webmanifest    manifeste PWA
sw.js                   service worker (précache + hors ligne)
icons/                  icônes PWA 192 / 512, dont versions maskable
screenshots/            captures déclarées au manifeste
assets/
  items/                32 objets à trier
  containers/           4 bacs
  ui/                   boutons, boosters, monnaies, mascotte
  fx/                   particules et éclats
  backgrounds/          fond
PROMPTS.md              les prompts ayant servi à générer les assets
```

## Les assets

Générés avec Gemini à partir des prompts de `PROMPTS.md`, en planches (grilles 4x4, 3x3, 2x2)
pour garantir la cohérence de style, puis découpés et détourés par script :
suppression du fond magenta par propagation depuis les bords, perçage des trous fermés
(anses, anneaux), érosion d'un pixel contre la frange, et décontamination de la teinte de fond
sur les pixels de bordure. Convertis en WebP : **16 Mo → 0,9 Mo**.

## Construire l'APK / AAB

1. Aller sur https://www.pwabuilder.com
2. Saisir `https://bahloulabderrahmane67-collab.github.io/tri-malin/`
3. Choisir **Android** → **Generate Package**
4. Le `.aab` sert à publier sur le Play Store, le `.apk` à tester sur un appareil

> Pour que les liens s'ouvrent sans barre d'adresse (TWA vérifié), déposer le fichier
> `assetlinks.json` fourni par PWABuilder dans `/.well-known/` à la racine du site.

## Développement

```bash
python3 -m http.server 8077    # puis http://127.0.0.1:8077
```

Après toute modification d'un fichier précaché, régénérer `sw.js` pour que l'empreinte
de cache change, sinon les navigateurs serviront l'ancienne version.
