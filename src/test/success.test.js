const request = require('supertest')
const app = require('../app')
const {
  databaseConnect,
  databaseCleanup,
  databaseDisconnect
} = require('../common/e2e')

describe('success scenario', () => {
  beforeAll(async () => {
    await databaseConnect()
    await databaseCleanup()
  })

  afterAll(async () => {
    await databaseDisconnect()
  })

  it('seller flow', async () => {
    // signup
    const response1 = await request(app)
      .post('/user')
      .send({
        email: 'seller@test.com',
        password: 'password',
        phone: '15104102179',
        type: 'seller'
      })
    expect(response1.body.status).toBe('ok')
    // login
    const response2 = await request(app)
      .post('/auth')
      .send({
        email: 'seller@test.com',
        password: 'password'
      })
    expect(response2.body.status).toBe('ok')
    const sellerAuthToken = response2.body.data.token
    // add listing
    const response3 = await request(app)
      .post('/listing')
      .set({ token: sellerAuthToken })
      .send({
        address: '3723 Temple St, Tampa, FL 33619',
        price: '35.56',
        coverPhoto: 'http://google.com/1.jpg'
      })
    expect(response3.body.status).toBe('ok')
    expect(response3.body.data.fee).toBe(5000)
    expect(response3.body.data.slug).toBe('3723-Temple-St-Tampa-FL-33619')
    const newListingId = response3.body.data.id
    // add photos
    const response4 = await request(app)
      .post(`/listing/${newListingId}/photo`)
      .set({ token: sellerAuthToken })
      .send({
        photoUrl: 'http://google.com/2.jpg'
      })
    expect(response4.body.status).toBe('ok')
  })

  it('buyer flow', async () => {
    // signup
    const response1 = await request(app)
      .post('/user')
      .send({
        email: 'buyer@test.com',
        password: 'password',
        phone: '15104102179',
        type: 'buyer'
      })
    expect(response1.body.status).toBe('ok')
    // login
    const response2 = await request(app)
      .post('/auth')
      .send({
        email: 'buyer@test.com',
        password: 'password'
      })
    expect(response2.body.status).toBe('ok')
    const buyerAuthToken = response2.body.data.token
    // match listing
    const response3 = await request(app)
      .post('/match')
      .set({ token: buyerAuthToken })
      .send({
        listingSlug: '3723-Temple-St-Tampa-FL-33619'
      })
    expect(response3.body.status).toBe('ok')
    const newMatchId = response3.body.data.id
    // make offer
    const response4 = await request(app)
      .post(`/match/${newMatchId}/offer`)
      .set({ token: buyerAuthToken })
      .send({
        offerPrice: 400,
        paymentType: 'cash',
        expirationDate: new Date()
      })
    expect(response4.body.status).toBe('error')
    expect(response4.body.data.code).toBe('ExpirationDateShouldBeMoreThan24Hrs')
  })
})
