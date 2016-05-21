module.exports = {
    'get /rest/hh/:id': function(req, res) {
        res.json({"id":req.params.id, "hello":"ws"})
    },
    'post /rest/user': function(req, res) {
        if(req.body.username.length > 0 && req.body.password.length > 0) {
            res.json({"code":200, "message":"success"});
        } else {
            res.json({"code":400, "message":"参数错误"});
        }
    },
    'post /api/contact/import/ file': function(req, res) {
        console.log(req.file);
        console.log('upload over!');
        res.json({
            code: 200,
            msg: 'success',
            result: {
                id: 'as6s121'
            }
        });
    }
}