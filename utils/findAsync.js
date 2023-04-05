function myFindAsync (array,predicate){
    return new Promise((resolve,reject)=>{
        const result = array.find(predicate);
        if(result){
            resolve(result);
        }
        else{
            reject(new Error('Not found'));
        }
    })

}
module.exports = myFindAsync;