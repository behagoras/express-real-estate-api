# Express & Mongo project installation process

This project extends the mousike project: https://github.com/behagoras/mousike

## 1. Create a database

Create a mongo database and backup the db keys

## 2. Install the project

Duplicate the `.env.bak`, name It `.env` and fill the environment variables with your mongo database information

```bash
cp .env.bak .env
```

Important fields:

- `DB_USER=` Fill It with a mongo database user with high privileges.
- `DB_PASSWORD=` Fill It with the password for the `DB_USER` declarated before
- `DB_HOST=` Fill It with the cluster address, example: `cluster-name.gcp.mongodb.net`
- `DB_NAME=` Enter the database name in the cluster where every data will be filled.
- `DB_PORT=` The mongo database, the default is `27017`
- `AUTH_JWT_SECRET=` Create a JSON Web Token Secret, you can use a online service like mkjwk https://mkjwk.org/
- `AUTH_JWT_SECRET=` Create a 264 bits  based key (You can use a service like [keygen.io](https://keygen.io))

The rest environment variables are not important.

## 3. Populate database

For finishing the setup just run the js scripts:

### Seed api keys

```bash
DEBUG=app:* node scripts/mongo/seedApiKeys.js
```

This bash script creates the api keys needed to authenticate the client and use the passport strategies.

### Seed properties

```bash
DEBUG=app:* node scripts/mongo/seedProperties.js
```

This bash script creates all the needed songs

### Seed users

```bash
DEBUG=app:* node scripts/mongo/seedUsers.js
```

This bash script create an admin user and a not administrative user

# Run the project

```bash
npm install
```

```bash
npm run start
```

