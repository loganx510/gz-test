const express = require('express')
const { ok, error } = require('../common/response')
const required = require('../common/middleware/required.middleware')
const validator = require('../common/middleware/validator.middleware')
const { MatchModel } = require('../model/match.model')
const { ListingModel, slugValidator } = require('../model/listing.model')
const {
  OfferModel,
  offerPriceValidator,
  paymentTypeValidator,
  expirationDateValidator
} = require('../model/offer.model')

const matchRoute = express.Router()

matchRoute.post(
  '/match',
  required(['listingSlug']),
  validator({
    listingSlug: slugValidator
  }),
  async (req, res, next) => {
    if (!req.user || req.user.type !== 'buyer') {
      error(res, 'NonAuthorized')
      return next()
    }
    const listing = await ListingModel.findOne({
      slug: req.body.listingSlug
    })

    if (!listing) {
      error(res, 'ListingNotFound')
      return next()
    }

    const newMatch = new MatchModel({
      listing: listing._id,
      user: req.user.userId
    })

    try {
      await newMatch.save()
      ok(res, {
        id: newMatch._id
      })
    } catch (e) {
      e.code === 11001 || e.code === 11000 ? error(res, 'MatchExists') : next(e)
    }
  }
)

matchRoute.get('/match/:slug', async (req, res, next) => {
  if (!req.user) {
    error(res, 'NonAuthorized')
    return next()
  }

  const matches = await MatchModel.find()
    .populate('user')
    .populate({
      path: 'listing',
      match: {
        slug: req.params.slug
      }
    })
    .exec()

  ok(
    res,
    matches
      .filter(match => match.listing !== null)
      .map(match => {
        return {
          id: match.listing._id,
          slug: match.listing.slug,
          address: match.listing.address,
          price: match.listing.price,
          fee: match.listing.fee,
          coverPhoto: match.listing.coverPhoto,
          photos: match.listing.photos
        }
      })
  )
})

matchRoute.post(
  '/match/:id/offer',
  required(['offerPrice', 'paymentType', 'expirationDate']),
  validator({
    offerPrice: offerPriceValidator,
    paymentType: paymentTypeValidator,
    expirationDate: expirationDateValidator
  }),
  async (req, res, next) => {
    if (!req.user || req.user.type !== 'buyer') {
      error(res, 'NonAuthorized')
      return next()
    }
    const match = await MatchModel.findOne({
      _id: req.params.id,
      user: req.user.userId
    })
    if (!match) {
      error(res, 'MatchNotFound')
      return next()
    }
    const newOffer = new OfferModel({
      price: req.body.offerPrice,
      paymentType: req.body.paymentType,
      expirationDate: req.body.expirationDate,
      match: match._id,
      user: match.user
    })
    try {
      await newOffer.save()
      ok(res, {
        id: newOffer._id
      })
    } catch (e) {
      next(e)
    }
  }
)

matchRoute.get('/match/:id/offer', async (req, res, next) => {
  if (!req.user) {
    error(res, 'NonAuthorized')
    return next()
  }

  const offers = await OfferModel.find({
    match: req.params.id,
    user: req.user.userId
  }).exec()

  ok(
    res,
    offers.map(offer => {
      return {
        id: offer._id,
        price: offer.price,
        paymentType: offer.paymentType,
        expirationDate: offer.expirationDate
      }
    })
  )
})

module.exports = matchRoute
