const apiAdapter = require('../../apiAdapter');

const {
    URL_USER_SERVICE
} = process.env

const api = apiAdapter(URL_USER_SERVICE);

module.exports = async (req, res) => {

    api.post('/users/register', req.body)
        .then(media => {
            return res.json(media.data);
        })
        .catch(error => {
            const {status, data} = error.response
            return res.status(status).json(data);
        })
}