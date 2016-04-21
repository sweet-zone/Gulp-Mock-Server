
module.exports = {
    'get /rest/other': function(req, res) {
        res.json({"id":req.query.id, "hello":"23333"})
    }
}