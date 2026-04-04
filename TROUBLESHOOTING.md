# Guide de dépannage Node.js - Résoudre les erreurs courantes

## 1. Erreur "EADDRINUSE" (Port déjà utilisé)
**Symptôme:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Voir quel processus utilise le port
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F

# Ou changer le port dans app.js
const PORT = process.env.PORT || 3001;  // au lieu de 3000
```

## 2. Erreur de syntaxe JavaScript
**Symptôme:** Erreur au démarrage avec numéro de ligne

**Solutions:**
```bash
# Vérifier la syntaxe sans exécuter
node -c app.js

# Si erreur, corriger la syntaxe dans le fichier indiqué
```

## 3. Erreur de connexion base de données
**Symptôme:** `ER_ACCESS_DENIED_ERROR` ou connexion refusée

**Solutions:**
- Vérifier que MySQL/MariaDB est démarré
- Vérifier les credentials dans `config/db.js`
- Vérifier que la base de données existe

## 4. Erreur "Cannot find module"
**Symptôme:** `Error: Cannot find module 'express'`

**Solutions:**
```bash
# Installer les dépendances
npm install

# Si problème de cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 5. Erreur 500 - Erreur interne du serveur
**Symptôme:** Page d'erreur 500 dans le navigateur

**Solutions:**
- Vérifier les logs de la console
- Vérifier la base de données
- Vérifier les permissions des fichiers

## 6. Erreur de template Handlebars
**Symptôme:** Erreur de rendu de vue

**Solutions:**
- Vérifier que les fichiers `.hbs` existent
- Vérifier la syntaxe Handlebars
- Vérifier les chemins dans `res.render()`

## Commandes de diagnostic utiles

```bash
# Vérifier la syntaxe
node -c app.js

# Lister les processus Node
Get-Process -Name node

# Vérifier les ports utilisés
netstat -ano | findstr LISTENING

# Vérifier la connectivité base de données
mysql -u root -p -e "SHOW DATABASES;"

# Redémarrer proprement
taskkill /IM node.exe /F
npm start
```

## Structure de débogage

1. **Lire l'erreur complète** - Ne pas paniquer, lire le message
2. **Identifier le type d'erreur** - Port, syntaxe, module, base de données...
3. **Localiser le problème** - Fichier et ligne mentionnés
4. **Appliquer la solution appropriée**
5. **Tester** - Redémarrer et vérifier

## Prévention

- Toujours vérifier la syntaxe avant de sauvegarder
- Utiliser un linter (ESLint)
- Tester régulièrement les changements
- Garder une sauvegarde des fichiers importants