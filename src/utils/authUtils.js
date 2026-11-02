const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

const authUtils = {
    // Hacher un mot de passe
    async hashPassword(password) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    // Vérifier un mot de passe
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    },

    // Générer un token JWT
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    }
};

module.exports = authUtils;