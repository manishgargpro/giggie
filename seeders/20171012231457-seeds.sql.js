'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('users', [
      {
        name: 'something@name.com',
        firebaseId: 'QtCeP8TBIsdcVixAhenUDjNUmEi1'
      },
      {
        name: 'name@name.com',
        firebaseId: 'mzablrS6KTQOltTKXAfyJQuBWls1'
      },
      {
        name: 'ccmar@class.com',
        firebaseId: 'q66w3ApfrAg55Dz1sRrqdn3ZLhS2'
      },
      {
        name: 'nic@class.com',
        firebaseId: 'KEGLi003A6SDxZ49oex5nEzBAsQ2'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users', [
      {
        name: 'something@name.com',
        firebaseId: 'QtCeP8TBIsdcVixAhenUDjNUmEi1'
      },
      {
        name: 'name@name.com',
        firebaseId: 'mzablrS6KTQOltTKXAfyJQuBWls1'
      },
      {
        name: 'ccmar@class.com',
        firebaseId: 'q66w3ApfrAg55Dz1sRrqdn3ZLhS2'
      },
      {
        name: 'nic@class.com',
        firebaseId: 'KEGLi003A6SDxZ49oex5nEzBAsQ2'
      }
    ], {});
  }
};
