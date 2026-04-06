const db = require('./backend/config/db');

async function updateDatabase() {
  try {
    console.log('🔧 Mise à jour de la base de données...');
    
    // Ajouter la colonne bio
    await db.query('ALTER TABLE guides ADD COLUMN `bio` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `cv`');
    console.log('✅ Colonne bio ajoutée');
    
    // Ajouter les autres colonnes manquantes
    await db.query('ALTER TABLE guides ADD COLUMN `diplome` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `cv`');
    console.log('✅ Colonne diplome ajoutée');
    
    await db.query('ALTER TABLE guides ADD COLUMN `cv_approved` tinyint(1) DEFAULT 0 AFTER `diplome`');
    console.log('✅ Colonne cv_approved ajoutée');
    
    await db.query('ALTER TABLE guides ADD COLUMN `diplome_approved` tinyint(1) DEFAULT 0 AFTER `cv_approved`');
    console.log('✅ Colonne diplome_approved ajoutée');
    
    await db.query('ALTER TABLE guides ADD COLUMN `date_soumission` datetime DEFAULT NULL AFTER `diplome_approved`');
    console.log('✅ Colonne date_soumission ajoutée');
    
    await db.query('ALTER TABLE guides ADD COLUMN `abonnement_actif` tinyint(1) DEFAULT 0 AFTER `date_soumission`');
    console.log('✅ Colonne abonnement_actif ajoutée');
    
    await db.query('ALTER TABLE guides ADD COLUMN `abonnement_fin` date DEFAULT NULL AFTER `abonnement_actif`');
    console.log('✅ Colonne abonnement_fin ajoutée');
    
    // Mettre à jour la colonne statut
    await db.query('ALTER TABLE guides MODIFY COLUMN `statut` enum(\'ACTIF\',\'BLOQUE\',\'ATTENTE\') COLLATE utf8mb4_unicode_ci DEFAULT \'ATTENTE\'');
    console.log('✅ Colonne statut mise à jour');
    
    console.log('🎉 Base de données mise à jour avec succès!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ Les colonnes existent déjà');
    } else {
      console.error('❌ Erreur lors de la mise à jour:', error);
    }
    process.exit(1);
  }
}

updateDatabase();
