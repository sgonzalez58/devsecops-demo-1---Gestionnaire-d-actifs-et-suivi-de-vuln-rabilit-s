const { pool } = require('../config/db');

const User = {
    
    // Créer un nouvel utilisateur
    async create(username, email, password, role = 'USER') {
        const query = `
            INSERT INTO users (username, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, role, created_at;
        `;
        const values = [username, email, password, role];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
        }
    },

    // Rechercher un utilisateur par son email
    async findByEmail(email) {
        const query = `
            SELECT id, username, email, password, role, created_at
            FROM users
            WHERE email = $1;
        `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // Rechercher un utilisateur par son ID
    async findById(id) {
        const query = `
            SELECT id, username, email, role, created_at
            FROM users
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = User;