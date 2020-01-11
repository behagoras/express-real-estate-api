# API Routes

This api consists in 2 main endpoints

- /api/properties/ : Crud of properties
- /api/images/ : A POST endpoint for creating images in Google Cloud

## Create Image

Endpoint: /api/images/ Method:Post Body:multipart form data
Returns the image id

## Properties CRUD

- Create: Endpoint: /api/properties/ Method:Post
- List Properties: Endpoint: /api/properties/ Method:Get
- List Specific Property: Endpoint: /api/properties/{{propertyId}} Method:Get
- Update Specific Property: Endpoint: /api/properties/{{propertyId}} Method:Put
- Delete Specific Property: Endpoint: /api/properties/{{propertyId}} Method:Delete

Each Endpoint resolves an acceptance message.