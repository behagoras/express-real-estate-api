const sinon = require('sinon');

const { propertiesMock, filteredPropertiesMock } = require('./properties');

const getAllStub = sinon.stub();
getAllStub.withArgs('properties').resolves(propertiesMock);

const tagQuery = { tags: { $in: ['Drama'] } };
getAllStub.withArgs('properties', tagQuery).resolves(filteredPropertiesMock('Drama'));

const createStub = sinon.stub().resolves(propertiesMock[0].id);

class MongoLibMock {
  getAll(collection, query) {
    return getAllStub(collection, query);
  }

  create(collection, data) {
    return createStub(collection, data);
  }
}

module.exports = {
  getAllStub,
  createStub,
  MongoLibMock
};
