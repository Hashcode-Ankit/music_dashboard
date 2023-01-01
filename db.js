// DB Interactions CRUD returns promises only and file exposed to api only 

const { info } = require('console');
const Sequelize = require('sequelize');


var sq = new Sequelize("lgvgdkwm","lgvgdkwm","xYf3IfZ9q1ibCxxU4jaesoLg0mIJV_tv",{
    host: "rosie.db.elephantsql.com",
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});



//Db Connection
const connectDb = async ()=>{
    return await sq.authenticate()
}


// Album model
var Album = sq.define('Album', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true,
    },
    userID:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    releaseTitle:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    draft:{
        type:Sequelize.BOOLEAN,
    },
    approved:{
        type:Sequelize.BOOLEAN,
    },
    imageUrl:{
        type:Sequelize.STRING,
    },
    primaryArtistName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    actor:{
        type:Sequelize.STRING,
    },
    genre:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    subgenre:{
        type:Sequelize.STRING,
    },
    labelName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    format:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    originalReleaseDate:{
        type:Sequelize.DATEONLY,
        allowNull:false,
    },
    publisherCopyright:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    copyright:{
        type:Sequelize.STRING,
        required:true,
    },
    productionYear:{
        type:Sequelize.INTEGER,
        required:true,
    },
    producerCatalogueNumber:{
        type:Sequelize.STRING,
        required:true,
    },
    songs:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[],
    },
    stores:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[],
    }
})
//Label model
var Label = sq.define('Label',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    title:{
        type:Sequelize.STRING,
        unique:true,
    },
    userID:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    youtubeLink:{
        type:Sequelize.STRING,
    },
    approved:{
        type:Sequelize.BOOLEAN,
    },
    noObjectionFile:{
        type:Sequelize.STRING
    } 
})

// After connecting  and defining models initialize the db 

async function initialize(){
    return new Promise((resolve,reject)=>{
     setTimeout(()=>{
         sq.sync({ force: true }).then(()=> {
            resolve("Postgres Database Successfully initialized");
         }).catch((err)=> {
             reject("Unable to initialize Postgres Database check schema of tables",err)
         });   
     },3000)
     
 })
 }

// get all Albums 
async function getAllAlbums(){
    return await Album.findAll()
    .catch((err)=>{
       return Error("unable to get songs from postgres",err)
    })
}

//get an Album
async function getAlbum(albumId){
    return await Album.findAll(
        {
            where:{
                id:albumId
            }
        }
    ).catch((err)=>{
        console.log("Unable to get a album",err)
    })
}


// create an album
async function addAlbum(album){
    return await Album.create(album).then(()=>{
        console.log("album added successfully")
    }).catch((err)=>{
        console.log("Unable to add album ",err)
    })    
}

//update an Album
async function updateAlbum(albumId, updateInfo ){
    return await Album.update({updateInfo},
        {
        where: { id: albumId }
        }
    ).then((data)=>{
        console.log(`album Successfully updated with ${albumId}`)
    }).catch((err)=>{
        console.log("Unable to update album id :",err,albumId)
    })
}

//delete an Album
async function deleteAlbum(albumId){
    return await Album.destroy({
        where:{
            id:albumId,
        }
    }).then((album)=>{
        console.log(`album deleted successfully ${albumId}`)
    }).catch((err)=>{
        console.log("Unable to delete the album id :",err,albumId)
    })    
}

//create a label
async function addLabelForUser(labelData){
    return Label.create(labelData)
}


//get all labels
async function getAllLabels(userdID){
    return Label.findAll({ 
        where:{
            userID:userdID,
        }
    })
}

//get a label
const getLabel = async (req,res)=>{
    const label  = await Label.find({
        where:{
            title:req.body.title,
        }
    })
    res.status(200).json({label})
    .catch((err)=>{
        console.log("Unable to get a label",err)
    })
}

//update a label
const updateLabel = async (req,res)=>{
    const label = await Label.update({
        where:{
            title:req.body.title
        }
    }, req.body)
    if(!label){
        res.status(404).json({msg:`No label found with title ${req.body.title}`})
    }
    res.status(200).json({" updatedLabel ":label})
    .then((data)=>{
        console.log("label Successfully updated ")
    }).catch((err)=>{
        console.log("Unable to update label:",err)
    })
}

//delete a label
const deleteLabel = async (req,res)=>{
    const label = await Label.destroy({
        where:{
            title:req.body.title,
        }
    })
    if(!label){
        res.status(404).json({msg:`No label found with title ${req.body.title}`})
    }
    res.status(200).json({msg:"Label deleted successfully"})
    .then((label)=>{
        console.log(`label deleted successfully with title ${req.body.title}`)
    }).catch((err)=>{
        console.log("Unable to delete the label :",err)
    })  
}





module.exports = {connectDb,initialize,addAlbum,getAllAlbums,deleteAlbum,updateAlbum,getAlbum,addLabelForUser,getAllLabels,getLabel,updateLabel,deleteLabel}
