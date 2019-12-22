const MongoLib = require('../lib/mongo');

class PropertiesService {
  constructor() {
    this.collection = 'property';
    this.mongoDB = new MongoLib();
  }

  // onBehar this should not work because the tags doesn't belongs to properties
  async getProperties({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const properties = await this.mongoDB.getAll(this.collection, query);
    return properties || [];
  }

  async getProperty({ propertyUid }) {
    const property = await this.mongoDB.get(this.collection, propertyUid);
    return property || {};
  }

  async createProperty({ property }) {
    const createPropertyId = await this.mongoDB.create(this.collection, property);
    return createPropertyId;
  }

  async updateProperty({ propertyUid, property } = {}) {
    const updatedPropertyUid = await this.mongoDB.update(
      this.collection,
      propertyUid,
      property
    );
    return updatedPropertyUid;
  }

  async deleteProperty({ propertyUid }) {
    const deletedPropertyUid = await this.mongoDB.delete(this.collection, propertyUid);
    return deletedPropertyUid;
  }
}

module.exports = PropertiesService;
