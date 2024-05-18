import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(file.fieldname === 'identification' || file.fieldname === 'address' || file.fieldname === 'accountStatus'){
            cb(null, 'public/documents') 
        } else if (file.fieldname === 'img-product'){
            cb(null, 'public/products') 
        } else if(file.fieldname === 'img-profile'){
            cb(null, 'public/profiles') 
        } else {
            cb(new Error('Invalid fieldname'), null)
        }
    }, 
    filename: (req, file, cb)=>{
        const userId = req.session.user._id
        console.log(userId + file.fieldname)
        cb(null, userId + '-' + file.fieldname + '.' + file.originalname.split('.')[1])
    }
})

export const uploader = multer({storage})