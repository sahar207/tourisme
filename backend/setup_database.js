const db = require('./config/db');

console.log('Vérification des colonnes de la base de données...');

// Vérifier si la colonne verification_code existe
db.query('SHOW COLUMNS FROM utilisateurs LIKE ?', ['verification_code'], (err, results) => {
  if (err) {
    console.error('Erreur vérification colonne verification_code:', err);
    process.exit(1);
  }
  
  if (results.length === 0) {
    console.log('Ajout de la colonne verification_code...');
    db.query('ALTER TABLE utilisateurs ADD COLUMN verification_code VARCHAR(6) NULL', (err) => {
      if (err) {
        console.error('Erreur ajout colonne verification_code:', err);
        process.exit(1);
      }
      console.log('✅ Colonne verification_code ajoutée avec succès');
      checkVerifiedColumn();
    });
  } else {
    console.log('✅ Colonne verification_code existe déjà');
    checkVerifiedColumn();
  }
});

function checkVerifiedColumn() {
  // Vérifier si la colonne verified existe
  db.query('SHOW COLUMNS FROM utilisateurs LIKE ?', ['verified'], (err, results) => {
    if (err) {
      console.error('Erreur vérification colonne verified:', err);
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log('Ajout de la colonne verified...');
      db.query('ALTER TABLE utilisateurs ADD COLUMN verified TINYINT(1) DEFAULT 0', (err) => {
        if (err) {
          console.error('Erreur ajout colonne verified:', err);
          process.exit(1);
        }
        console.log('✅ Colonne verified ajoutée avec succès');
        finishSetup();
      });
    } else {
      console.log('✅ Colonne verified existe déjà');
      finishSetup();
    }
  });
}

function finishSetup() {
  console.log('🎉 Configuration de la base de données terminée!');
  process.exit(0);
}
