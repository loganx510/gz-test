const express = require('express')
const slugify = require('slugify')
const { ok, error } = require('../common/response')
const required = require('../common/middleware/required.middleware')
const validator = require('../common/middleware/validator.middleware')
const {
  ListingModel,
  addressValidator,
  priceValidator,
  coverPhotoValidator,
  photoUrlValidator
} = require('../model/listing.model')

const listingRoute = express.Router()

listingRoute.post(
  '/listing',
  required(['address', 'price', 'coverPhoto']),
  validator({
    address: addressValidator,
    price: priceValidator,
    coverPhoto: coverPhotoValidator
  }),
  async (req, res, next) => {
    if (!req.user || req.user.type !== 'seller') {
      error(res, 'NonAuthorized')
      return next()
    }

    const price =
      typeof req.body.price === 'string'
        ? parseFloat(req.body.price)
        : req.body.price
    let fee = price * 0.04
    if (fee < 5000) fee = 5000

    const newListing = new ListingModel({
      address: req.body.address,
      slug: slugify(req.body.address),
      price,
      fee,
      coverPhoto: req.body.coverPhoto,
      user: req.user.userId
    })
    try {
      await newListing.save()
      ok(res, {
        id: newListing._id,
        slug: newListing.slug,
        fee: newListing.fee
      })
    } catch (e) {
      e.code === 11001 || e.code === 11000
        ? error(res, 'ListingExists')
        : next(e)
    }
  }
)

listingRoute.get('/listing/:id', async (req, res, next) => {
  if (!req.user) {
    error(res, 'NonAuthorized')
    return next()
  }
  const listing = await ListingModel.findOne({
    _id: req.params.id
  })
    .populate('user')
    .exec()
  if (!listing) {
    error(res, 'NotFound')
    return next()
  }
  ok(res, {
    id: listing._id,
    slug: listing.slug,
    address: listing.address,
    price: listing.price,
    fee: listing.fee,
    coverPhoto: listing.coverPhoto,
    photos: listing.photos,
    seller:
      req.user.type === 'admin'
        ? {
            id: listing.user._id,
            email: listing.user.email,
            phone: listing.user.phone
          }
        : undefined
  })
})

listingRoute.get('/listing', async (req, res, next) => {
  if (!req.user) {
    error(res, 'NonAuthorized')
    return next()
  }
  const listings = await ListingModel.find()
    .populate('user')
    .exec()
  ok(
    res,
    listings.map(listing => {
      return {
        id: listing._id,
        slug: listing.slug,
        address: listing.address,
        price: listing.price,
        fee: listing.fee,
        coverPhoto: listing.coverPhoto,
        photos: listing.photos,
        seller:
          req.user.type === 'admin'
            ? {
                id: listing.user._id,
                email: listing.user.email,
                phone: listing.user.phone
              }
            : undefined
      }
    })
  )
})

listingRoute.post(
  '/listing/:id/photo',
  required(['photoUrl']),
  validator({
    photoUrl: photoUrlValidator
  }),
  async (req, res, next) => {
    if (!req.user || req.user.type !== 'seller') {
      error(res, 'NonAuthorized')
      return next()
    }
    const listing = await ListingModel.findOne({
      _id: req.params.id,
      user: req.user.userId
    })
    if (!listing) {
      error(res, 'NotFound')
      return next()
    }
    try {
      if (!Array.isArray(listing.photos)) listing.photos = []
      if (!listing.photos.includes(req.body.photoUrl)) {
        listing.photos.push(req.body.photoUrl)
        await listing.save()
        ok(res)
      } else {
        error(res, 'PhotoAlreadyExists')
      }
    } catch (e) {
      next(e)
    }
  }
)

listingRoute.delete(
  '/listing/:id/photo',
  required(['photoUrl']),
  validator({
    photoUrl: photoUrlValidator
  }),
  async (req, res, next) => {
    if (!req.user || req.user.type !== 'seller') {
      error(res, 'NonAuthorized')
      return next()
    }
    const listing = await ListingModel.findOne({
      _id: req.params.id,
      user: req.user.userId
    })
    if (!listing) {
      error(res, 'NotFound')
      return next()
    }
    try {
      if (!Array.isArray(listing.photos)) listing.photos = []
      const newPhotos = []
      for (const photoUrl of listing.photos) {
        if (req.body.photoUrl !== photoUrl) newPhotos.push(photoUrl)
      }
      listing.photos = newPhotos
      await listing.save()
      ok(res)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = listingRoute
