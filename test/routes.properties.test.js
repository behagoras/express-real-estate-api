const assert = require('assert');
const proxyquire = require('proxyquire');

const { propertiesMock, filteredPropertiesMock } = require('../utils/mocks/properties');
const { MongoLibMock } = require('../utils/mocks/mongoLib');

describe('routes - properties', function () {
  const PropertiesService = proxyquire('../services/properties', {
    '../lib/mongo': MongoLibMock
  });

  const propertiesService = new PropertiesService();

  describe('when getProperties is called', function () {
    it('should return a list of properties', async function () {
      const result = await propertiesService.getProperties({});
      const expected = propertiesMock;
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('when getProperties is called with tags', function () {
    it('should return filtered properties', async function () {
      const result = await propertiesService.getProperties({ tags: ['Drama'] });
      const expected = filteredPropertiesMock('Drama');
      assert.deepStrictEqual(result, expected);
    });
  });

  describe('when createProperty is called', function () {
    it('should return the created property id', async function () {
      const result = await propertiesService.createProperty({ property: {} });
      const expected = propertiesMock[0].id;
      assert.strictEqual(result, expected);
    });
  });
});
