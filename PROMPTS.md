# Prompts assets graphiques — Jeu de tri (style Magic Sort)
Style cible : **casual mobile 3D soft** (rendu 3D arrondi, couleurs vives, ombres douces)

---

## REGLES A SUIVRE AVANT DE COMMENCER

1. **Genere les objets par planches (grilles), pas un par un.** C'est LA cle de la coherence de style. Un objet seul genere a part aura une lumiere et une echelle differentes.
2. **Garde ta premiere image reussie comme reference.** Pour tout nouveau prompt, attache-la et ajoute : `Match the exact art style, lighting and color treatment of the attached reference image.`
3. **Fond magenta #FF00FF** : c'est une couleur qui n'existe jamais dans les objets, donc facile a detourer automatiquement ensuite. (Alternative : `pure white background`.)
4. **Jamais de texte dans les images.** Les libelles des boutons se mettent dans le moteur de jeu, sinon tu ne peux pas traduire ton jeu.
5. **Format carre 1:1** pour tout sauf les fonds (9:16 vertical).
6. Si Gemini te sort une ombre portee collee a l'objet, ajoute : `no drop shadow, no ground shadow, floating isolated object`.

---

## 1. OBJETS A TRIER — planche principale (le coeur du jeu)
> Dossier : `assets/items/`

```
A 4x4 grid sprite sheet of 16 cute household objects for a casual mobile sorting puzzle game.
Soft 3D rendered style, glossy rounded shapes, vibrant saturated colors, smooth soft ambient
occlusion, clean studio lighting from the top-left, chunky friendly proportions.
Each object centered in its own cell, all objects at the same visual scale, isolated,
three-quarter front view.
Objects: teapot, cupcake, teddy bear, alarm clock, potted cactus, perfume bottle, red book,
yellow rubber duck, blue mug, green apple, pink hairbrush, orange juice carton, white candle,
purple gift box, silver scissors, lemon.
Pure flat #FF00FF magenta background, no drop shadow, no ground shadow, no text, no labels,
no borders or grid lines between cells. Square 1:1, high detail.
```

## 2. OBJETS A TRIER — planche 2 (variete de niveaux)
> Dossier : `assets/items/`
> Attache la planche 1 en reference.

```
Match the exact art style, lighting, scale and color treatment of the attached reference image.
A 4x4 grid sprite sheet of 16 more cute objects in the same soft 3D casual mobile game style.
Objects: cactus in blue pot, watermelon slice, pink headphones, teal sneaker, croissant,
wooden hairbrush, yellow watering can, strawberry, blue toy car, green frog plush,
purple nail polish, bread loaf, red thermos, white daisy in vase, orange pumpkin, pink macaron.
Each object centered in its own cell, same visual scale, isolated, three-quarter front view.
Pure flat #FF00FF magenta background, no drop shadow, no text, no grid lines. Square 1:1.
```

## 3. ETAGERES / CONTENEURS
> Dossier : `assets/containers/`

```
A set of 4 empty wooden shelf units for a casual mobile sorting puzzle game, soft 3D rendered
style, warm light oak wood with soft rounded edges, glossy clean finish, soft ambient occlusion,
studio lighting from top-left. Front-facing orthographic view, each shelf has 3 visible empty
slots side by side. Variations: light oak, white painted wood, mint green painted wood,
dark walnut. Arranged in a 2x2 grid, each centered in its own cell, same scale.
Pure flat #FF00FF magenta background, no drop shadow, no objects on the shelves, no text.
Square 1:1.
```

## 4. BOUTONS UI
> Dossier : `assets/ui/`

```
A 3x3 grid sprite sheet of glossy 3D casual mobile game buttons, soft rounded rectangle and
circle shapes, thick soft bevel, candy-like plastic finish, bright saturated colors, subtle
inner glow, soft ambient occlusion, lit from the top.
Row 1: large green play button, large blue button, large orange button (rounded rectangles).
Row 2: small circular red close button with a white X, small circular grey pause button with
two white bars, small circular yellow button with a white gear icon.
Row 3: small circular purple button with a white speaker icon, small circular teal button with
a white question mark, small circular pink button with a white heart icon.
Each button centered in its own cell, same scale per row.
Pure flat #FF00FF magenta background, no text labels on the large buttons, no drop shadow,
no grid lines. Square 1:1.
```

## 5. PANNEAU / POPUP
> Dossier : `assets/ui/`

```
An empty UI popup panel for a casual mobile puzzle game, soft 3D style, rounded thick cream
white panel with a glossy blue rounded header bar at the top, soft chunky bevelled border,
subtle inner shadow, candy-like plastic finish, soft ambient occlusion.
Completely empty inside, no text, no icons, no buttons, no decoration inside the panel.
Vertical portrait proportions, centered.
Pure flat #FF00FF magenta background, no drop shadow outside the panel. Square 1:1.
```

## 6. BOOSTERS / POWER-UPS
> Dossier : `assets/ui/`

```
A 2x3 grid sprite sheet of 6 booster power-up icons for a casual mobile sorting puzzle game,
soft 3D rendered style, glossy vibrant colors, chunky friendly shapes, soft ambient occlusion,
lit from top-left.
Icons: a golden magic wand with sparkles, a blue hourglass, a red bomb with a lit fuse,
a green plus sign in a circle, a purple magnet, a rainbow star.
Each icon centered in its own cell, same visual scale, isolated.
Pure flat #FF00FF magenta background, no drop shadow, no text, no grid lines. Square 1:1.
```

## 7. MONNAIES (pieces, gemmes, etoiles)
> Dossier : `assets/ui/`

```
A 2x2 grid sprite sheet of casual mobile game currency icons, soft 3D rendered style, glossy
metallic and crystal finish, vibrant saturated colors, soft ambient occlusion, lit from top-left.
Items: a stack of three shiny gold coins, a single large faceted purple gem, a glossy yellow
five-pointed star, a small red heart (life icon).
Each item centered in its own cell, same visual scale, isolated.
Pure flat #FF00FF magenta background, no drop shadow, no text, no grid lines. Square 1:1.
```

## 8. BARRE DE PROGRESSION
> Dossier : `assets/ui/`

```
A progress bar UI element for a casual mobile puzzle game, soft 3D style, horizontal rounded
capsule shape. Two separate versions stacked vertically: the top one is an empty dark grey
glossy track, the bottom one is a full bright green glossy fill with a subtle highlight on top.
Both the same width and height, chunky soft bevelled edges, candy plastic finish.
Pure flat #FF00FF magenta background, no text, no numbers, no drop shadow. Square 1:1.
```

## 9. FOND DE JEU
> Dossier : `assets/backgrounds/`

```
A vertical mobile game background for a casual sorting puzzle game, soft 3D rendered style,
a cozy bright living room interior seen from the front, soft pastel mint and cream color
palette, warm diffused daylight, blurred shallow depth of field, very soft and low contrast
so that colorful game objects stay readable on top.
Completely empty center area with no furniture and no objects in the middle of the frame,
decoration only along the top and bottom edges.
No text, no UI elements, no characters. Vertical 9:16 aspect ratio.
```

## 10. FOND DE MENU PRINCIPAL
> Dossier : `assets/backgrounds/`

```
A vertical mobile game main menu background for a casual sorting puzzle game, soft 3D rendered
style, a warm cozy shop interior with soft wooden shelves along the left and right edges,
pastel pink and cream color palette, warm golden diffused light, soft bokeh, gentle vignette.
Large completely empty space in the center and upper third for the game logo and buttons.
No text, no logo, no UI elements, no characters. Vertical 9:16 aspect ratio.
```

## 11. EFFETS / PARTICULES
> Dossier : `assets/fx/`

```
A 2x3 grid sprite sheet of game VFX elements on a pure black background, glowing additive
style for a casual mobile puzzle game.
Elements: a white four-pointed sparkle star, a soft round white glow orb, a small burst of
yellow confetti pieces, a white circular shockwave ring, a cluster of tiny white twinkle dots,
a soft white radial light flare.
Each element centered in its own cell, bright glowing white and pale yellow only, soft edges
fading to pure black.
Pure flat black background, no text, no grid lines. Square 1:1.
```

## 12. ICONE DE L'APPLICATION
> Dossier : `assets/icon/`

```
A mobile game app icon for a casual sorting puzzle game, soft 3D rendered style, glossy and
vibrant. A cheerful wooden shelf seen from the front holding three colorful glossy objects
(a pink cupcake, a yellow rubber duck, a blue teapot), arranged in a tight centered composition
that fills the frame. Bright warm gradient background from peach to pink, soft rim light,
soft ambient occlusion, high contrast and highly readable at very small size.
No text, no logo, no border, no rounded corner mask. Square 1:1.
```

## 13. MASCOTTE (optionnel — fort impact sur la retention)
> Dossier : `assets/ui/`

```
A 2x2 grid sprite sheet of a cute mascot character for a casual mobile puzzle game, soft 3D
rendered style like a vinyl toy, a small round friendly orange cat with big expressive eyes,
chunky simple shapes, glossy soft finish, soft ambient occlusion, lit from top-left.
Four expressions, same character, same scale, three-quarter front view, full body:
happy and waving, surprised with wide eyes, sad and disappointed, cheering with both arms up.
Each pose centered in its own cell.
Pure flat #FF00FF magenta background, no drop shadow, no text, no grid lines. Square 1:1.
```

---

## APRES LA GENERATION

1. Mets chaque image telechargee dans le bon sous-dossier de `assets/`.
2. Nomme les fichiers simplement : `items-01.png`, `shelves.png`, `buttons.png`, `icon.png`...
3. Pas besoin de decouper les planches toi-meme ni de detourer le magenta : dis-le moi, je le fais par script.
4. Quand c'est pret, dis-moi et je mets tout sur GitHub.

## RESOLUTIONS CIBLES (pour info)
- Objets a trier : 256x256 px par objet
- Boutons : 128x128 px (petits), 512x192 px (grands)
- Fonds : 1080x1920 px
- Icone app : 1024x1024 px
