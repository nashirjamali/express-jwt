const jwt = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');

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
        const refreshToken = req.body.refresh_token;
        const email = req.body.email;

        if (!refreshToken || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid token',
            })
        }


        await api.get('/refresh-token', {
            params: {
                refresh_token: refreshToken
            },
        });
        
        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: err.message,
                })
            }
            console.log(decoded.data);
            if (email != decoded.data.email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'email is not valid'
                })
            }

            const token = jwt.sign({data: decoded.data}, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED});
            return res.json({
                token
            })
        })

    } catch (error) {
        // const { status, data } = error.response
        return res.status(400).json(error);
    }
}