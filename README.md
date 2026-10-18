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

Remplacer `index.html` sur GitHub, et augmenter le numéro de version `bi-vNN` dans `sw.js`
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
  l'écran « Accès réservé ».
- Sans lien de configuration, l'appli affiche « Accès réservé » et ne permet pas de créer de bon.

## Sauvegarde chiffrée de la liste des techniciens (page admin)

La liste est chiffrée dans le navigateur (AES-GCM 256, clé PBKDF2-SHA256 310 000 itérations)
puis écrite dans ce dépôt : `sauvegarde/techniciens.enc`. Le fichier est public mais illisible
sans le mot de passe, qui n'est jamais stocké (oubli = sauvegarde irrécupérable).

Jeton : GitHub > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** :
- Repository access : **Only select repositories** > ce dépôt uniquement ;
- Permissions > Repository > **Contents : Read and write** ;
- Expiration : la plus longue proposée (à renouveler ensuite).
Ce jeton permet de modifier le dépôt : ne l'utiliser que sur le poste du responsable.

## Clients (lieux d'intervention)

- Page admin > carte « Clients » : ajout manuel ou import par copier-coller depuis Excel
  (onglet « Clients » de la Base article, colonnes F à M avec la ligne d'en-tête).
- La liste est chiffrée avec une clé aléatoire et publiée dans `sauvegarde/clients.enc`.
  La clé est incluse dans le lien de configuration des techniciens (et dans la sauvegarde admin).
- Dans le bon, le technicien tape le nom ou le code : la liste propose les clients, et le choix
  remplit code client, département, adresse, contact et e-mail. Un client hors liste reste possible.
- Les techniciens configurés avant cette version doivent recevoir un nouveau lien (pour la clé).

## Verrouillage de la page admin

- À l'ouverture, la page demande le mot de passe administrateur (12 caractères minimum).
- Toutes les données de la page (techniciens, clients, clé clients, dépôt, jeton GitHub) sont chiffrées
  dans le navigateur avec ce mot de passe (AES-GCM 256, PBKDF2-SHA256 600 000 itérations) ;
  rien n'est conservé en clair. Verrouillage automatique après 15 minutes d'inactivité.
- Le même mot de passe chiffre la sauvegarde GitHub. Oubli = données et sauvegarde irrécupérables.
- Nouveau navigateur ou navigation privée : la page retrouve la sauvegarde chiffrée sur GitHub et
  restaure tout (techniciens, clients, clé clients, dépôt et jeton) avec le seul mot de passe.

## Sécurité (lot 1)

- Bibliothèques hébergées dans `lib/` (jsPDF 4.2.1, jspdf-autotable 5.0.8, qrcodejs 1.0.0) et polices dans `fonts/`
  (IBM Plex, licence OFL) : aucune ressource tierce n'est chargée.
- Politique CSP dans chaque page (scripts du site uniquement, empreintes des scripts inline).
  Après toute modification d'un script inline : `python3 outils/csp.py index.html admin.html`.
- Purge sur le téléphone : photos et signature effacées à « Nouveau bon », bons validés > 7 jours et
  brouillons abandonnés > 30 jours supprimés.

## Types d'intervention et en-tête de la fiche

- Page admin > « Paramètres des bons » : liste des types (un par ligne) et en-tête du PDF
  (nom, adresse, téléphone, e-mail, logo), publiés dans `config.json` (non chiffré).
- Le type choisi par le technicien est ajouté au n° du bon : `AAAAMMJJ-INI-NNN-Type`
  (espaces remplacés par des tirets) et à la fin du nom de fichier du devis.

## Historique des bons (techniciens et admin)

Chaque bon validé est archivé **en entier** (PDF avec photos et signature + données .json) dans les
tickets (« Issues ») du dépôt, **chiffré** (AES-GCM 256) avec une clé propre à chaque technicien.
Le titre du ticket ne contient qu'un identifiant opaque : rien n'est lisible publiquement.

Mise en place (une fois) :
1. Dépôt → **Settings → General → Features** : cocher **Issues**.
2. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** →
   *Generate new token* : Repository access = **Only select repositories** → `bons-intervention` ;
   Permissions → Repository permissions → **Issues : Read and write** (rien d'autre).
3. Page admin → carte « Sauvegarde » → **Historique des techniciens : jeton « Issues »** → coller, Enregistrer.
4. Renvoyer à chaque technicien son lien (bouton « Lien ») : l'ancien lien n'active pas l'historique.

- Technicien : bouton **Historique** en haut de l'appli → « Récupérer le bon » → PDF / JSON.
  Si le réseau manque à la validation, l'archivage est refait automatiquement à la prochaine ouverture.
- Admin : carte **Historique des bons** → « Charger l'historique » (tous les techniciens, filtre et recherche).
  Les clés des techniciens supprimés sont conservées : leurs bons restent lisibles.
- Ce jeton ne donne aucun accès aux fichiers de l'appli ; il ne permet pas de supprimer un ticket.
  Un contenu modifié est détecté au déchiffrement (« Archive altérée »).

## Logo de la fiche

Le logo en haut à gauche de la fiche est `logo.png` (repris du modèle d'origine). Pour le changer :
remplacer ce fichier dans le dépôt, ou charger un autre logo dans la page admin (« Paramètres des bons »),
qui est prioritaire. Le nom de l'entreprise de l'intervenant n'apparaît pas sur la fiche PDF.
