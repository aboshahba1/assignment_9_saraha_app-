

export const Validation = (Schema)=>{
    return (req,res, next)=>{
        const errReslt= []
        for (const key of Object.keys(Schema)) {
            const {error} =Schema[key].validate(req[key], { abortEarly:false })
            if(error){
                error.details.forEach((err) => {
                    errReslt.push({
                        message: err.message,
                        path: err.path[0],
                        key
                    })
                });
                
            }
        }
        if(errReslt.length){
        return res.status(400).json({message: "validation error",error:errReslt})
        }
    next()
}
}