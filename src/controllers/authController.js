const User = require('../models/userModel');
const authUtils = require('../utils/authUtils');

const authController = {
    // Inscription d'un nouvel utilisateur
    async register(req, res) {
        try {
            const { username, email, password, role } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }

            // Hacher le mot de passe
            const hashedPassword = await authUtils.hashPassword(password);

            // Créer l'utilisateur
            const newUser = await User.create(username, email, hashedPassword, role || 'USER');

            // Générer un token JWT pour l'utilisateur nouvellement créé
            const token = authUtils.generateToken(newUser);

            return res.status(201).json({
                message: 'Utilisateur créé avec succès.',
                token,
                user: newUser
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
        }
    },

    // Connexion d'un utilisateur
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }

            // Vérifier le mot de passe
            const isMatch = await authUtils.comparePasswords(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }

            // Générer un token JWT
            const token = authUtils.generateToken(user);

            return res.status(200).json({
                message: 'Connexion réussie.',
                token,
                user
            });
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
        }
    }
};

module.exports = authController;