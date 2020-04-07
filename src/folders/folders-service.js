const FoldersService = {
    getAllFolders(knex){
        return knex('folders').select('*');
    },
    getFolderById(knex, id) {
      return knex
        .from('folders')
        .select('*')
        .where('id', id)
        .first();
    },
    insertFolder(knex, newFolder) {
      return knex
        .insert(newFolder)
        .into('folders')
        .returning('*')
        .then(rows => rows[0]);
    },
    deleteFolder(knex, id) {
      return knex('folders')
        .where({ id })
        .delete()
    }
}

module.export = FoldersService;

