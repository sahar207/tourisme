const db = require('./backend/config/db');

async function fixAvisTable() {
  try {
    console.log('Vérification de la colonne id_plan dans la table avis...');
    
    // Vérifier si la colonne existe déjà
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'tourisme_tn' 
      AND TABLE_NAME = 'avis' 
      AND COLUMN_NAME = 'id_plan'
    `);
    
    if (columns.length === 0) {
      console.log('Ajout de la colonne id_plan...');
      await db.query('ALTER TABLE avis ADD COLUMN id_plan INT(11) DEFAULT NULL');
      console.log('✅ Colonne id_plan ajoutée avec succès!');
    } else {
      console.log('✅ La colonne id_plan existe déjà');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixAvisTable();
