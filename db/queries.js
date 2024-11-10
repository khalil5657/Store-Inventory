const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM allgames");
  return rows;
}
async function addGame(name, devs, genre) {
    await pool.query(`insert into allgames (name, devlopers, genre) values ('${name}', '${devs}', '${genre}')`)
}
// async function insertUsername(username) {
//   await pool.query(`INSERT INTO testusernames (username) VALUES ('${username}')`);
// }

async function getAllGenre() {
    const {rows} = await pool.query("select * from genre")
    return rows
}
async function getAllDevlopers() {
    const {rows} = await pool.query("select * from devlopers")
    return rows
}
// async function getAllGenreItems(name) {
//     const {rows} = await pool.query(`select * from ${name}`)
//     return rows
// }
async function getAllCategoryItems(name) {
    const {rows} = await pool.query(`select ${name}.id, ${name}.name, allgames.devlopers, allgames.genre from ${name} join allgames on ${name}.id = allgames.id`)
    return rows
}
async function getId(name) {
  const id = await pool.query(`select id from allgames where name='${name}'`)
  return id.rows[0].id
}
async function addToTable(tablename, id, name) {
    await pool.query(`insert into ${tablename} (id, name) values (${id}, '${name}')`)
    // await pool.query(`insert into allgames (name, devlopers, genre) values ('${name}', '${devs}', '${genre}')`)

}
async function editTable(tablename, name, oldname) {
  await pool.query(`update ${tablename} set name='${name}' where name='${oldname}'`)

}
async function editGame(name, devs, genre, oldname) {
  await pool.query(`update allgames set name='${name}', devlopers='${devs}', genre='${genre}' where name='${oldname}'`)

}
async function getGameDetails(name) {
  const row = await pool.query(`select * from allgames where name='${name}'`)
  return row
}
async function  deleteGame(name) {
  await pool.query(`delete from allgames where name='${name}'`)
}
async function deleteFromTable(tablename, gamename) {
  await pool.query(`delete from ${tablename} where name='${gamename}' `)
}
async function addToType(type, name) {
  await pool.query(`insert into ${type} (name) values ('${name}')`)
}
async function createNewTable(name) {
  await pool.query(`create table ${name} (id int, name varchar(250), primary key(id), foreign key(id) references allgames(id) on delete cascade)`)
}
async function deleteTable(name) {
  pool.query(`drop table ${name}`)
}
async function editDeletedTable(gameName, category, newValue) {
  pool.query(`update allgames set ${category} = '${newValue}' where name='${gameName}'`)
}
async function changeTableName(oldName, newName) {
  await pool.query(`alter table ${oldName} RENAME TO ${newName}`)
}
module.exports = {
  getAllGames,
  addGame,
  getAllGenre,
  getAllDevlopers,
  getAllCategoryItems,
  getId,
  addToTable,
  getGameDetails,
  deleteGame,
  editGame,
  editTable,
  deleteFromTable,
  addToType,
  createNewTable,
  deleteTable,
  editDeletedTable,
  changeTableName
};