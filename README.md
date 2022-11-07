# getzorba-test

# INSTALLATION

Before the installation please create empty DB's: getzorba & getzorba-test

```
npm i
cp .env.local .env
npm run dev
```

# CODE STANDARD

Please use the following command to check code standard using https://standardjs.com/

```
npm run check
```

# JSDOC

I've added JSDOC comments samples into /common/middleware folder.

# TESTS

You can run e2e test for success scenario using the following command:

```
npm run test
```

# FRAMEWORK

I used Express.js in this demo because this is a framework of your choice
but usually I prefer to use TypeScript/Nest.JS for things like this.

# API DOCUMENTATION

```
POST /user
User signup

POST /auth
User login

DELETE /auth
User logout

POST /listing
Seller can create a listing

GET /listing
Get all listings (admin can see the information about the seller)

GET /listing/:id
Get one listing (admin can see the information about the seller)

POST /listing/:id/photo
Seller can add a photo to the listing

DELETE /listing/:id/photo
Seller can delete a photo from the listing

POST /match
Buyer can create a match with a listing

GET /match/:slug
Get all matches for the listing

POST /match/:id/offer
Buyer can make an offer

GET /match/:id/offer
Get all offers user (buyer) made for the match
```
