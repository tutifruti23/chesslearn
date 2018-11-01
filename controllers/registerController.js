let registerModel=require('../models/registerModel');
exports.register=function(req,res){
    registerModel.userRegister(req.body,function(isOk,errorMessage){
        res.send({
            status:isOk,
            errorMessage:errorMessage
        });
    });
};
