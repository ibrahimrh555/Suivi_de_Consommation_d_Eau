# Design QA — Page d’accueil AquaWatch

## Evidence

- Source visual truth: dashboard AquaWatch rendu dans le navigateur cloud à `http://terminal.local:4173/dashboard`.
- Implementation: page d’accueil rendue dans le navigateur cloud à `http://terminal.local:4173/`.
- Viewport: 1363 × 936 CSS px, device pixel ratio 1.
- Captures: captures navigateur cloud du dashboard et de l’accueil, comparées ensemble dans le même contrôle visuel.
- State: accueil public, haut de page, thème clair.
- Primary interactions tested: navigation douce vers les fonctionnalités, affichage/masquage du mot de passe, champs du formulaire.
- Console: aucune erreur ni aucun avertissement provenant de l’application.

## Findings

- Aucun problème P0, P1 ou P2.
- Typographie: famille, poids, hiérarchie et densité cohérents avec le dashboard.
- Espacement et rythme: sidebar compacte, en-tête, cartes et grille alignés sur le langage du dashboard.
- Couleurs et tokens: fond `#f6f7fb`, panneaux blancs, sidebar `#17181a` et accent bleu `#0869f7` cohérents.
- Images et assets: logo existant et illustration AquaWatch nette, correctement dimensionnée et intégrée.
- Copy: contenu français concis et adapté au suivi de consommation d’eau.
- Accessibilité: titres hiérarchisés, libellés visibles, boutons nommés et états de focus disponibles.
- Responsive: les grilles passent en colonne et la navigation devient un menu mobile aux points de rupture existants.

## Full-view comparison

Le dashboard et l’accueil partagent les mêmes proportions visuelles, couleurs, rayons, ombres légères, icônes et densité. La page publique conserve une hiérarchie de landing page sans rompre le système visuel du produit.

## Focused region comparison

Un recadrage supplémentaire n’était pas nécessaire : la navigation, les cartes principales, les libellés et les boutons étaient lisibles dans les deux captures à densité 1.

## Comparison history

- Passage 1: aucun écart P0/P1/P2 détecté ; aucune correction visuelle supplémentaire requise.

## Follow-up polish

- P3 possible: ajouter ultérieurement une capture mobile automatisée dédiée.

## Final result

final result: passed
