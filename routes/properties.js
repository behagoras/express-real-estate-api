const express = require('express');
const passport = require('passport');
const PropertiesService = require('../services/properties');

const {
  propertyUidSchema,
  createPropertySchema,
  updatePropertySchema,
} = require('../utils/schemas/properties');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

function propertiesApi(app) {
  const router = express.Router();
  app.use('/api/properties', router);

  const propertiesService = new PropertiesService();

  router.get(
    '/',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['read:movies']),
    async function(req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;

      try {
        const movies = await propertiesService.getProperties({ tags });

        res.status(200).json({
          data: movies,
          message: 'properties listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/:propertyUid',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['read:movies']),
    validationHandler({ propertyUid: propertyUidSchema }, 'params'),
    async function(req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { propertyUid } = req.params;
      try {
        const properties = await propertiesService.getProperty({ propertyUid });

        res.status(200).json({
          data: properties,
          message: 'property retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['create:movies']),
    validationHandler(createPropertySchema),
    async function(req, res, next) {
      const { body: property } = req;
      try {
        const createdPropertyUid = await propertiesService.createProperty({ property });

        res.status(201).json({
          data: createdPropertyUid,
          message: 'property created'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: propertyUidSchema }, 'params'),
    validationHandler(updatePropertySchema),
    async function(req, res, next) {
      const { propertyUid } = req.params;
      const { body: property } = req;

      try {
        const updatedPropertyUid = await propertiesService.updateProperty({
          propertyUid,
          property
        });

        res.status(200).json({
          data: updatedPropertyUid,
          message: 'property updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['deleted:movies']),
    validationHandler({ movieId: propertyUidSchema }, 'params'),
    async function(req, res, next) {
      const { propertyUid } = req.params;

      try {
        const deletedPropertyUid = await propertiesService.deleteProperty({ propertyUid });

        res.status(200).json({
          data: deletedPropertyUid,
          message: 'property deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = propertiesApi;
