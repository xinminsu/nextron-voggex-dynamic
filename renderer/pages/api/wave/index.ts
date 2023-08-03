import {pool} from "../../../config/db";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return await getWaveLength(req, res);
        case "POST":
            return await saveWaveLength(req, res);
        default:
            return res.status(400).send("Method not allowed");
    }
}

const getWaveLength = async (req, res) => {
    try {
        const results = await pool.query("SELECT * FROM wave_length");
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const saveWaveLength = async (req, res) => {
    try {
        const { channelId, index, value } = req.body;

        const result = await pool.query("INSERT INTO wave_length SET ?", {
            channelId,
            index,
            value,
        });

        // @ts-ignore
        return res.status(200).json({ ...req.body, id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
