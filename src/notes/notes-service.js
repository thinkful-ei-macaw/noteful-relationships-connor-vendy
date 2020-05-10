 const NotesService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },

  insertnote(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("notes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("notes").select("*").where("id", id).first();
  },

  deletenote(knex, id) {
    return knex("notes").where({ id }).delete();
  },
};

module.exports = NotesService;