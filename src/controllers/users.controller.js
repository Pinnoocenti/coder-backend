
import userDAO from "../dao/Manager/userDAO.js"

export const changeRole = async (req,res)=>{
    try {
        const {uid} =req.params
        const user = await userDAO.getUserById(uid)
        console.log(user)
        
        if(user.role === 'user'){
            const identification = user.documents.find(d => d.name === 'identification')
            const address = user.documents.find(d => d.name === 'address')
            const accountStatus = user.documents.find(d => d.name === 'accountStatus')

            if(!identification || !address || !accountStatus){
                return res.status(400).send({message: 'Error - some document is missing'})
            }
            const userUpdate = await userDAO.update(uid, {role: 'premium'})
            return res.send(userUpdate)
        } 
        if(user.role === 'premium'){
            const userUpdate = await userDAO.update(uid, {role: 'user'})
            return res.send(userUpdate)
        }         
    } catch (error) {
        return res.status(500).json({message: 'error'})
    }
}
export const getUserByEmail = async (req,res)=>{
    try {
        const {uEmail} =req.params
        const user = await userDAO.getUserByEmail(uEmail)

        return res.send(user) 
    } catch (error) {
        return res.status(500).json({message: 'error'})
    }
}
export const uploadDocument = async(req,res)=>{
    if(!req.files){
        return res.status(400).send({message: 'Error - the document could not be saved'})
    }
    console.log(req.files)
    const {user} = req.session
    try {
        const searchedUser = await userDAO.getUserById(user._id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let documents = [...searchedUser.documents]
        const files = req.files
        pushDocument(files['identification'], documents)
        console.log(documents)
        pushDocument(files['address'], documents)
        console.log(documents   )
        pushDocument(files['accountStatus'], documents)
        await userDAO.update(user._id, {documents: documents}) 
        return res.status(200).json({message: 'Documents uploaded successfully'})
    } catch (error) {
        console.log(error)
    }
}

export const pushDocument = (file,documents)=>{
    if (!file) {
        return;
    }
    const i = documents.findIndex(d => d.name === file[0].fieldname)
    console.log(i, file[0].fieldname)
    if (i > -1)
        {documents.splice(i,1)}
    const newfile = {
        name: file[0].fieldname,
        reference: file[0].path
    }
    documents.push(newfile)
}