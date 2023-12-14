const order= require('../models/order.m');

module.exports = {
    All: async (req,res,next) =>{
        try {
            const page = req.query.page;
            const perpage = req.query.perpage;
            list =  await order.All(page,perpage);
            res.send(list);
        }
        catch(error){
            next(error);
        }
    } ,
    Add: async (req,res,next) =>{
        try {
            const od = req.body ;
            await order.Add(od);
            res.send(od) ;
        } catch(error){
            next(error);
        }
    },
    GetOne: async(req,res,next) =>{
        try {
            const id = req.params.id;
            const od =  await order.Get(id);
            res.send(od);
        }
        catch(error){
            next(error);
        }
    }
}