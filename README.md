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

Remplacer `index.html` sur GitHub, et changer `bi-v3` en `bi-v4` dans `sw.js`
pour forcer le rafraîchissement du cache sur les appareils.

## Numérotation

`AAAAMMJJ-INITIALES-NNN` (NNN aléatoire, unicité vérifiée sur l'appareil).

## Plusieurs techniciens

- **config.json** : valeurs communes à tous (destinataire, Cc, entreprise par défaut, liste des
  entreprises prestataires). Modifiable directement sur GitHub (icône crayon), pris en compte au
  prochain lancement de l'appli. Ces valeurs ne servent que si le technicien n'a rien saisi lui-même.
- **admin.html** (`…/bons-intervention/admin.html`) : le responsable remplit l'identité d'un technicien
  et obtient un lien personnalisé (+ QR code) à envoyer par SMS ou e-mail. À l'ouverture, l'appli
  affiche la configuration reçue et le technicien l'applique en un geste.
  Le contenu du lien reste dans le navigateur (partie après #, jamais envoyée à GitHub).
- iPhone : une appli installée sur l'écran d'accueil a son propre stockage, séparé de Safari.
  Si le technicien a installé l'appli avant d'ouvrir le lien, il colle le lien dans
  Réglages > Lien de configuration.
