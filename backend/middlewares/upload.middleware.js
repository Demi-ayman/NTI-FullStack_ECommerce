const {File}=require('buffer');
const {error} = require('console');
const multer = require('multer');
const path =  require('path');

const fileFilter =(req,file,cb)=>{
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed=['.jpg','.png','.jpeg','.webp'];
  if(!allowed.includes(ext)){
    return cb(new Error('only images are allowed (png, jpg, jpeg'),false);
  }
  return cb(null,true);
}
const storage =multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./uploads');
  },
  filename:(req,file,cb)=>{
    cb(null, Date.now().toString()+'_'+file.originalname);
  }
})
const MG =1024*1024
const upload =multer(
  {
    storage,
    fileFilter,
    limits:{fileSize:2*MG}
  }
)
module.exports = upload;