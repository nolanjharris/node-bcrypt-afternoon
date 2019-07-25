const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get('db');
    const result = await db.get_user([username]);
    const existingUser = result[0];
    if (existingUser) {
        res.status(409).json('Username taken');
    } else {
        const hash = await bcrypt.hash(password, 10);
        console.log(hash);
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        res.status(201).json(req.session.user);
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');
    const foundUser = await db.get_user([username]);
    const user = foundUser[0];
    if (!user) {
        return res.status(401).json('User not found. Please register as a new user before logging in.');
    }
    const isAuthenticated = await bcrypt.compare(password, user.hash);
    if (!isAuthenticated) {
        return res.status(403).json('Incorrect Username or Password');
    }
    req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username
    }
    return res.status(200).json(req.session.user);
}

const logout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}