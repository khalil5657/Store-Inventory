// import { getAllCategoryItems } from "../db/queries"
// import { getAllGenre } from "../db/queries"
// import { getAllGenre } from "../db/queries"
const {getAllDevlopers} = require("../db/queries")
const {getAllCategoryItems} = require("../db/queries")
const {getAllGenre}  = require("../db/queries")
exports.showGame = async(req, res)=>{
    const tableName = req.params.id.replace(/\s/g, "").toLocaleLowerCase()
    const table = await getAllCategoryItems(tableName)
    const genre = await getAllGenre()
    const devlopers = await getAllDevlopers()
    res.render("showitems", {title:req.params.id, table:table, genres:genre, devlopers:devlopers})
}