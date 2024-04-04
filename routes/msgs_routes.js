const express=require("express");
const Message=require("../models/messagesSchema");
const router=express.Router();
router.post('/',async (req,res)=>{
    const data=req.body;
    // res.status(200).json({message: msg});
    try{
        const msg=await Message.create(data);
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json({message: err.message});    
    
    }
});
module.exports=router;