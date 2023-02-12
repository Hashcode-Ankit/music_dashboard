var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var userSchema = new Schema({
    "contact": String,
    "password": String,
    "email": String,
    "accountNumber": String,
    "ifsc": String,
    "swift": String,
    "upi": String,
    "imageURL": String,
    "firstName": String,
    "lastName": String,
    "address": String,
});
var adminSchema = new Schema({
    "password": String,
    "email": String,
});
let User
let Admin
async function initialize() {
    let db = mongoose.createConnection(`mongodb+srv://hashcode-ankit:pepcoder@cluster0.my9kvko.mongodb.net/?retryWrites=true&w=majority`);
    return new Promise((resolve, reject) => {
        db.on('error', (err) => {
            reject(Error("Db not Connected"));
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            Admin = db.model("admin", adminSchema)
            resolve("db1 success!");
        });
    })
}

async function registerUser(userData) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10).then((hash) => {
            userData.password = hash;
            let newUser = new User(userData);
            newUser.save((err) => {
                if (err) {
                    reject(userData.email + " already exist" + err)
                }
                else {
                    resolve();
                }
            })
        }).catch((err) => {
            reject("not able to decrypt pass") // Show any errors that occurred during the process
        });

    })
}
async function userExist(userData) {
    return new Promise((resolve, reject) => {
        User.find({ email: userData.email })
            .exec().then((data) => {
                if (data.length == 0) {
                    resolve("Unable to Find user" + userData.email)
                } else {
                    reject()
                }
            }).catch(() => {
                reject()
            })
    })
}

async function loginUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({ email: userData.email })
            .exec().then((data) => {
                if (data.length == 0) {
                    reject("Unable to Find user" + userData.email)
                }
                bcrypt.compare(userData.password, data[0].password).then((result) => {
                    if (!result) {
                        reject("Incorrect Password for user : " + userData.email);
                    }
                    else {
                        resolve(data[0])
                    }
                })

            }).catch(function (error) {
                reject("unable to find the user : " + userData.email + error)
            });
    })
}
function loginAdmin(adminData) {
    return new Promise((resolve, reject) => {
        console.log("finding", adminData)
        Admin.find({ email: adminData.email }).exec().then((admin) => {
            if (admin.length == 0) {
                reject("no admin exist")
            }
            bcrypt.compare(adminData.password, admin[0].password).then((result) => {
                if (!result) {
                    reject("Incorrect Password for admin : " + adminData.email);
                }
                else {
                    resolve(admin[0])
                }
            })
        }).catch(function (error) {
            reject("unable to find the user : " + adminData.email + error)
        });
    })

}
function registerAdmin(adminData) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(adminData.password, 10).then((hash) => {
            adminData.password = hash;
            let admin = new Admin(adminData);
            admin.save((err) => {
                if (err) {
                    reject(adminData.email + " already exist" + err)
                }
                else {
                    resolve("registered");
                }
            })
        }).catch((err) => {
            reject("not able to decrypt pass") // Show any errors that occurred during the process
        });

    })
}
function updateUser(userID, userData) {
    return User.findByIdAndUpdate(userID, userData)
}
function getUser(userID) {
    return User.findById(userID).exec();
}
module.exports = { updateUser, registerAdmin, loginAdmin, getUser, initialize, registerUser, loginUser, userExist }