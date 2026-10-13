# Bons d'intervention

Application web autonome (PWA) : saisie du bon, temps passé, matériel remplacé, photos,
signature du client, génération du PDF et envoi depuis la messagerie du technicien.
Aucun serveur, aucune base de données : tout reste sur l'appareil.

## Mise en ligne gratuite (GitHub Pages)

1. Créer un compte sur github.com, puis un dépôt public, par exemple `bons-intervention`.
2. « Add file » > « Upload files » : déposer tous les fichiers de ce dossier, puis « Commit ».
3. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
4. Après une minute, l'adresse est : `https://<votre-compte>.github.io/bons-intervention/`

## Installer sur le téléphone

- iPhone (Safari) : Partager > « Sur l'écran d'accueil ».
- Android (Chrome) : menu ⋮ > « Installer l'application ».

Ouvrir une première fois avec du réseau : ensuite l'application fonctionne hors ligne.

## Mise à jour

Remplacer `index.html` sur GitHub, et changer `bi-v1` en `bi-v2` dans `sw.js`
pour forcer le rafraîchissement du cache sur les appareils.

## Numérotation

`AAAAMMJJ-INITIALES-NNN` (NNN aléatoire, unicité vérifiée sur l'appareil).
