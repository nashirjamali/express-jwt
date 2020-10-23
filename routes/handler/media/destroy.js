const apiAdapter = require('../../apiAdapter');

const {
    URL_MEDIA_SERVICE
} = process.env

const api = apiAdapter(URL_MEDIA_SERVICE);

module.exports = async (req, res) => {
    const { id } = req.params;
    api.delete(`/media/${id}`)
        .then(media => {
            return res.json(media.data);
        })
        .catch(error => {
            const { status, data } = error.response
            return res.status(status).json(data);
        })
}