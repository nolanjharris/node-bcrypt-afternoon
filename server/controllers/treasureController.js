const dragonTreasure = async (req, res) => {
    const db = req.app.get('db');
    const treasure = await db.get_dragon_treasure([1]);
    res.status(200).json(treasure);
}

const getUserTreasure = async (req, res) => {
    const db = req.app.get('db');
    const treasure = await db.get_user_treasure([req.session.user.id]);
    res.status(200).json(treasure);
}

const addMyTreasure = async (req, res) => {
    const { treasureUrl } = req.body;
    const { id } = req.session.user;
    const db = req.app.get('db');
    const userTreasure = await db.add_user_treasure([treasureUrl, id]);
    return res.status(200).json(userTreasure);
}

const getAllTreasure = async (req, res) => {
    const db = req.app.get('db');
    const allTreasure = await db.get_all_treasure();
    res.status(200).json(allTreasure);
}

module.exports = {
    dragonTreasure,
    getUserTreasure,
    addMyTreasure,
    getAllTreasure
}