const Category = require('../models/category.m');



module.exports = {
    all: async(req,res,next) =>{
        try {
            var page = req.query.page;
            var perpage=  req.query.perpage;
            list =await Category.All(page,perpage);
            console.log(list);
            res.send(list);
        } catch(error){
            next(error);
        }
    },
    add: async(req,res,next) =>{
        try {
            const cat = req.body; 
            console.log("abcd");
            console.log(cat);
            rs = await Category.Add(cat);
            console.log(rs);
            res.send(rs);
        }
        catch(error){
            next(error);
        }
    },
    delete: async(req,res,next)=>{
        try{
            const id = req.params.id;
           res.send(Category.Del(id));

        }
        catch(error){
            next(error);
        }
    },
    edit: async(req,res,next)=>{
        try{
            const id = req.params.id;
            const cat = req.body;
            res.send(Category.Update(id,cat));
        }catch(error){
            next(error);
        }
    }

}