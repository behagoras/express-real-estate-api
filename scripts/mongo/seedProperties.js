// DEBUG=app:* node scripts/mongo/seedProperties.js

const chalk = require('chalk');
const debug = require('debug')('app:scripts:properties');
const MongoLib = require('../../lib/mongo');
const { propertiesMock } = require('../../utils/mocks/properties');

async function seedProperties() {
  try {
    const mongoDB = new MongoLib();

    const promises = propertiesMock.map(async property => {
      await mongoDB.create('property', property);
    });

    await Promise.all(promises);
    debug(chalk.green(`${promises.length} movies have been created successfully`)); // prettier-ignore
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedProperties();
