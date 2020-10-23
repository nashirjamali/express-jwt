const apiAdapter = require('../../apiAdapter');
const jwt = require('jsonwebtoken');

const {
    URL_USER_SERVICE,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED,
} = process.env

const api = apiAdapter(URL_USER_SERVICE);

module.exports = async (req, res) => {
    try {
        const user = await api.post('/users/login', req.body);

        const data = user.data.data;

        const token = jwt.sign({ data }, JWT_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRED
        });

        const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRED
        });

        await api.post('/refresh-token', { refresh_token: refreshToken, user_id: data.id });

        return res.json({
            status: 'success',
            data: {
                token: token,
                refresh_token: refreshToken
            }
        })

    } catch (error) {
        const { status, data } = error.response
        return res.status(status).json(data);
    }
}