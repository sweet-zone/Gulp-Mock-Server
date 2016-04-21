
module.exports = {
    'get /rest/com': function(req, res) {
        res.json({"id":req.query.id, "hello":"23333"})
    }
}