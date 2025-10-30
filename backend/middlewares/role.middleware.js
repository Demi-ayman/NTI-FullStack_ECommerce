exports.authorize = (...allowedRules)=>{
  return (req,res,next)=>{
    const userRole = req.user.role
    if(!allowedRules.includes(userRole)){
      return res.status(403).json({message:'access denied'})
    }
    return next();
  }
}