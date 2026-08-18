/**
 * Auth Controller for SAPA Inklusi
 */
const db = require('../config/database');

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

    if (!user) {
        // Fallback for custom emails
        const newUser = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            email: email,
            name: email.split('@')[0],
            role: 'GPK_KOORDINATOR',
            schoolName: 'Unit Layanan Inklusi',
            phone: '0812-0000-0000'
        };
        db.data.users.push(newUser);
        db.saveData();
        return res.json({ success: true, user: newUser, token: 'sapa-token-' + newUser.id });
    }

    return res.json({
        success: true,
        user: user,
        token: 'sapa-token-' + user.id
    });
};

exports.getMe = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({ success: true, user: db.data.users[0] });
    }
    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('sapa-token-', '');
    const user = db.data.users.find(u => u.id === userId) || db.data.users[0];
    return res.json({ success: true, user });
};

exports.switchRole = (req, res) => {
    const { role, userId } = req.body;
    const user = db.data.users.find(u => u.id === userId) || db.data.users[0];
    if (user) {
        user.role = role;
        db.saveData();
    }
    return res.json({ success: true, role, user });
};
