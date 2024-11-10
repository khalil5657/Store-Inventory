const express = require("express")
const app = express()
const path = require("node:path");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'css')))

const db = require("./db/queries");
const { table } = require("node:console");
const { isNull } = require("node:util");
async function getIt(req, res) {
    const all = await db.getAllGames()
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    res.render("showgames", {games:all, genres:genre, devlopers:devlopers})
}
async function getAllGenre(req, res) {
    const allgenre = await db.getAllGenre()
    return allgenre
}
async function getAllDevlopers(req, res) {
    const allgenre = await db.getAllDevlopers()
    return allgenre
}
// async function getGenreItems(tableName) {
//     const items = await db.getAllGenreItems(tableName)
//     return items
// }
async function getCategoryItems(tableName) {
    const items = await db.getAllCategoryItems(tableName)
    return items
}
async function getRecomendedGames(){
    const games = await db.getAllGames()
    let listOfGames = []
    
    while (listOfGames.length < 4){
        const random= Math.floor(Math.random() * games.length);
        if (!listOfGames.includes(games[random])){
            listOfGames.push(games[random])
        }
        
    }
    return listOfGames
}
app.get("/", async(req, res)=>{
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    const recomendedGames = await getRecomendedGames()
    res.render("home", {genres:genre, devlopers:devlopers, recomendedgames:recomendedGames})
})
// app.post("/new", (req, res)=>{
//     const name = req.body.name
//     db.addGame(name, req.body.devlopers, req.body.genre)
//     const devlopers = req.body.devlopers.split(', ')
//     const genre = req.body.genre.split(', ')
//     res.redirect("/showgames")

// })
const showGameController = require("./controllers/showGameController");

app.get("/category/:id", showGameController.showGame)
app.get("/addgame", async(req, res)=>{
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    const game = ''
    res.render("form", {game:game, genres:genre, devlopers:devlopers})
})
// app.get("/devloper/:id", async(req, res)=>{
//     const tableName = req.params.id.replace(/\s/g, "").toLocaleLowerCase()
//     const table = await getDevlopersItems(tableName)
//     const genre = await getAllGenre()
//     const devlopers = await getAllDevlopers()
//     res.render("showitems", {table:table, genres:genre, devlopers:devlopers})
// })
// app.get("/genres", getAllGenre)
app.post("/test", async(req, res)=>{
    let genreArr = (req.body.genre)
    let devsArr = (req.body.dev)
    let newdevsArr = devsArr
    let newgenreArr = genreArr
    if (devsArr.constructor === Array){
        newdevsArr = (req.body.dev).join(", ")
    }
    if (genreArr.constructor === Array){
        newgenreArr = (req.body.genre).join(", ")
    }
    
    await db.addGame(req.body.name, newdevsArr, newgenreArr)
    const id = await db.getId(req.body.name)
    if (devsArr.constructor !== Array){
        const tableName = devsArr.replace(/\s/g, "").toLocaleLowerCase()
        await db.addToTable(tableName, id, req.body.name)
    }else{
        for (let name of devsArr){
            const tableName = name.replace(/\s/g, "").toLocaleLowerCase()
            console.log(tableName)
            await db.addToTable(tableName, id, req.body.name)
        }
    }
    if (genreArr.constructor !== Array){
        const tableName = genreArr.replace(/\s/g, "").toLocaleLowerCase()
        await db.addToTable(tableName, id, req.body.name)
    }else{
        for (let name of genreArr){
            const tableName = name.replace(/\s/g, "").toLocaleLowerCase()
            console.log(tableName)
            await db.addToTable(tableName, id, req.body.name)
        }
    }

    // console.log(devs)
    res.redirect("/")
})
app.post("/editgame/:id", async(req, res)=>{
    const gamek = await db.getGameDetails(req.params.id)
    let oldDevlopers = gamek.rows[0].devlopers
    let oldGenre = gamek.rows[0].genre
    if (oldDevlopers.includes(",")){
        oldDevlopers = oldDevlopers.split(", ")
    }
    if (oldGenre.includes(",")){
        oldGenre = oldGenre.split(", ")
    }
    let genreArr = (req.body.genre)
    let devsArr = (req.body.dev)
    let newdevsArr = devsArr
    let newgenreArr = genreArr
    
    if (devsArr.constructor === Array){
        newdevsArr = (req.body.dev).join(", ")
    }
    if (genreArr.constructor === Array){
        newgenreArr = (req.body.genre).join(", ")
    }
    
    await db.editGame(req.body.name, newdevsArr, newgenreArr, req.params.id)
    const id = await db.getId(req.body.name)
    if (devsArr.constructor !== Array){
        const tableName = devsArr.replace(/\s/g, "").toLocaleLowerCase()
        if (oldDevlopers.includes(devsArr)){
            await db.editTable(tableName, req.body.name, req.params.id)
        }else{
            await db.addToTable(tableName, id, req.body.name)
        }
    }else{
        for (let name of devsArr){
            const tableName = name.replace(/\s/g, "").toLocaleLowerCase()
            console.log(tableName)
            if (oldDevlopers.includes(name)){
                await db.editTable(tableName, req.body.name, req.params.id)
            }else{
                console.log(tableName, id, req.body.name)
                await db.addToTable(tableName, id, req.body.name)
            }
        }
        
    }
    let deletedDev = ''
    
    if (oldDevlopers.constructor === Array){
        deletedDev = oldDevlopers.filter((item)=>!devsArr.includes(item))
    }else{
        if (devsArr.includes(oldDevlopers)){
            deletedDev = ''
        }else{
            deletedDev = oldDevlopers
        }
    }
    if (deletedDev){
        if(deletedDev.constructor ===Array){
            for (let dev of deletedDev){
                let devname = dev.replace(/\s/g, "").toLocaleLowerCase()
                db.deleteFromTable(devname, req.params.id)
            }
        }else{
            let devname = deletedDev.replace(/\s/g, "").toLocaleLowerCase()
            db.deleteFromTable(devname, req.params.id)
        }
    }
    if (genreArr.constructor !== Array){
        const tableName = genreArr.replace(/\s/g, "").toLocaleLowerCase()
        if(oldGenre.includes(genreArr)){
            await db.editTable(tableName, req.body.name, req.params.id)
        }else{
            await db.addToTable(tableName, id, req.body.name)
        }
    }else{
        for (let name of genreArr){
            const tableName = name.replace(/\s/g, "").toLocaleLowerCase()
            console.log(tableName)
            if (oldGenre.includes(name)){
                await db.editTable(tableName, req.body.name, req.params.id)
            }else{
                await db.addToTable(tableName, id, req.body.name)
            }
        }
        
    }
    let deletedGenre = ''
    if (oldGenre.constructor === Array){
        deletedGenre = oldGenre.filter((item)=>!genreArr.includes(item))
    }else{
        if (genreArr.includes(oldGenre)){
            deletedGenre = ''
        }else{
            deletedGenre = oldGenre
        }
    }
    if (deletedGenre){
        if(deletedGenre.constructor ===Array){
            for (let genre of deletedGenre){
                let genrename = genre.replace(/\s/g, "").toLocaleLowerCase()
                db.deleteFromTable(genrename, req.params.id)
            }
        }else{
            let genrename = deletedGenre.replace(/\s/g, "").toLocaleLowerCase()
            db.deleteFromTable(genrename, req.params.id)
        }
    }
    res.redirect("/")
})
app.get("/showgame/:id", async(req, res)=>{
    const gameName = req.params.id
    // console.log(gameName)
    const game = await db.getGameDetails(gameName)
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    res.render("showgame", {game:game, devlopers:devlopers, genres:genre})
})
app.get("/deletegame/:id", async(req, res)=>{
    await db.deleteGame(req.params.id)
    res.redirect("/")
})
app.get("/editgame/:id", async(req, res)=>{
    
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    const game = await db.getGameDetails(req.params.id)
    let DEV = game.rows[0].devlopers
    let GENRE = game.rows[0].genre
    let news = {name:game.rows[0].name, devlopers:DEV, genre:GENRE, oldname:req.params.id}
    res.render("form", {game:news, devlopers:devlopers, genres:genre})
})
app.get("/add/:type", async(req, res)=>{
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    res.render("typeform", {type:req.params.type, devlopers:devlopers, genres:genre})
})
app.post("/add/:type", async(req, res)=>{
    let type = req.params.type
    let name= req.body.name.replace(/\s/g, "").toLocaleLowerCase()
    await db.addToType(type, name)
    await db.createNewTable(name)
    res.redirect("/")
})
app.get("/delete/:category/:name", async(req, res)=>{
    console.log("hh")
    let name = req.params.name
    let category = req.params.category
    await db.deleteFromTable(category, name)
    await db.deleteTable(name)
    let allgames = await db.getAllGames()
    for (game of allgames){
        if (game[category].includes(name)){
            let newOne = ''
            if (game[category].includes(",")){
                let old = game[category].split(", ")
                let index = old.indexOf(name)
                newOne = old.splice(index, 1).join(", ")
            }else{
                let old = ''
                newOne = old
            }
            
            console.log(newOne)
            console.log(game.name, category, newOne)
            await db.editDeletedTable(game.name, category, newOne)
        }
    }
    res.redirect("/")
})
app.get("/edit/:category/:name", async(req, res)=>{
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()

    res.render("edittypeform", {category:req.params.category,name:req.params.name, devlopers:devlopers, genres:genre})
})
app.post("/edit/:category/:name", async(req, res)=>{
    let category = req.params.category
    let name = req.params.name
    await db.editTable(category, req.body.name, name)
    await db.changeTableName(name, req.body.name)
    let allgames = await db.getAllGames()
    for (game of allgames){
        if (game[category].includes(name)){
            let newValue = game[category].replace(name, req.body.name)
            await db.editDeletedTable(game.name, category, newValue)
        }
    }
    res.redirect("/")
})

app.get("/showgames", getIt)
app.listen(8000)