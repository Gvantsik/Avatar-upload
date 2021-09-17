const knex = require('../knex');
const fs = require('fs');

const USER_TABLE = 'users';

module.exports = {
  async getById(id) {
    const item = await knex(USER_TABLE).select('*').where({ id }).first();

    return item;
  },

  async getList() {
    const item = await knex(USER_TABLE).select('*');

    return item;
  },

  async addItem(item) {
    return knex(USER_TABLE).insert(item);
  },

  async updateItem(id, item) {
    const existingAvatar = await knex(USER_TABLE).select('*').where({ id }).first();

    if (item.avatar) {
      try {
        fs.unlinkSync(existingAvatar.avatar);
      } catch (err) {
        console.error(err);
      }
    }
    const updated = await knex(USER_TABLE)
      .update({
        username: item.username || null,
        email: item.email || null,
        avatar: item.avatar || null,
        age: item.age || null,
        phone: item.phone || null,
      })
      .where({ id });

    return updated;
  },

  async patchItem(id, item) {
    const existingAvatar = await knex(USER_TABLE).select('*').where({ id }).first();

    if (item.avatar) {
      try {
        fs.unlinkSync(existingAvatar.avatar);
      } catch (err) {
        console.error(err);
      }
    }
    const updated = await knex(USER_TABLE).update(item).where({ id });
    return updated;
  },

  async removeItem(id) {
    const item = await knex(USER_TABLE).select('*').where({ id }).first();

    const deleted = knex(USER_TABLE).where({ id }).del();

    if (deleted) {
      try {
        fs.unlinkSync(item.avatar);
      } catch (err) {
        console.error(err);
      }
    }
    return deleted;
  },
};
