var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var userSchema = new Schema({
  "contact":String,
  "password": String,
  "email": String,
});
let User;
async function initialize(){
    let db = mongoose.createConnection(`mongodb+srv://hashcode-ankit:pepcoder@cluster0.my9kvko.mongodb.net/?retryWrites=true&w=majority`);
    return new Promise((resolve,reject)=>{
        db.on('error', (err)=>{
            reject(Error("Db not Connected"));
          });
        db.once('open', ()=>{
        User = db.model("users", userSchema);
        resolve("db1 success!");
        });
    })
}

async function registerUser(userData) {
    return new Promise((resolve,reject)=>{
    bcrypt.hash(userData.password, 10).then((hash)=>{ 
     userData.password=hash;
     console.log("store",userToStore)
     let newUser= new User(userToStore);
     newUser.save((err)=>{
         if(err){
             reject(userData.email+" already exist"+err)
         }
         else{
             resolve();
         }
     })
    }).catch((err)=>{
        reject("not able to decrypt pass") // Show any errors that occurred during the process
    });
   
})
}
async function userExist(userData){
    return new Promise((resolve,reject)=>{
        User.find({email: userData.email})
        .exec().then((data)=>{
            if(data.length==0){
                resolve("Unable to Find user"+userData.email)
            }else{
                reject()
            }
        }).catch(()=>{
            reject()
        })
    })
}

async function loginUser(userData){
    return new Promise((resolve,reject)=>{
        User.find({email: userData.email})
        .exec().then((data)=>{
            if(data.length==0){
                reject("Unable to Find user"+userData.email)
            }
            bcrypt.compare(userData.password, data[0].password).then((result) => {
                if(!result){
                    reject("Incorrect Password for user : "+ userData.email);
                }
                else{
                 resolve(data[0])
                }
            })
           
        }).catch(function(error){
            reject("unable to find the user : "+ userData.email +error)
        });
    })
}

module.exports={initialize,registerUser,loginUser,userExist }