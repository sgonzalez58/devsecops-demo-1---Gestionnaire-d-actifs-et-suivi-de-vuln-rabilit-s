require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Pool } = require('pg');

async function runMigrations() {

	const targetDbName = process.env.DB_NAME || 'vuln_manager_db';

	const client = new Client({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: 'postgres' // Connexion à la base de données par défaut pour vérifier l'existence de la base cible
	});

	try {
		await client.connect();

		const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDbName]);

		if (res.rowCount === 0) {
			console.log(`La base de données "${targetDbName}" n'existe pas. Création en cours...`);
			await client.query(`CREATE DATABASE ${targetDbName}`);
			console.log(`Base de données "${targetDbName}" créée avec succès.`);
		} else {
			console.log(`La base de données "${targetDbName}" existe déjà.`);
		}
	} catch (err) {
		console.error('Erreur lors de la vérification ou de la création de la base de données :', err);
		throw err; // Propagation de l'erreur pour arrêter le processus si nécessaire
	} finally {
		await client.end();
	}

	const pool = new Pool({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: targetDbName
	});	

	try {
		console.log('Lecture du fichier schema.sql...');

		const schemaPath = path.join(__dirname, '../../schema.sql');
		const schema = fs.readFileSync(schemaPath, 'utf8');

		console.log('Exécution des requêtes SQL...');
		await pool.query(schema);

		console.log('Migrations terminées avec succès !');
	} catch (err) {
		console.error('Erreur lors de l\'exécution des migrations :', err);
	} finally {
		await pool.end();
	}
}

runMigrations()
	.then(() => process.exit(0))
	.catch(err => {
		console.error('Erreur critique :', err);
		process.exit(1);
	});