const axios = require('axios')

// Hard-coded credentials for development 
// In production, these should be environment variables
const PAYPAL_CLIENT_ID = 'Ac5IXSKfzhmtTTLPFX4PGiQgWa9uuZG35m6vLt7AqXA4M5sVHrZnuK24ZMpZAWaQ83yfHbnDLMzPhhA9'
const PAYPAL_SECRET = 'EOEHeyIAWOYRntEG179KVcsy5Zo2_pvInhjUBK2XlN9QaMXBFmKVyZzxzdQ6vZ9FDx7gvbSYUNQFjfqb'
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'
const BASE_URL = 'http://localhost:3000'

async function generateAccessToken() {
  try {
    const url = `${PAYPAL_BASE_URL}/v1/oauth2/token`
    console.log(`Requesting PayPal auth token from: ${url}`)
    
    const response = await axios({
      url,
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET
      }
    })

    return response.data.access_token
  } catch (error) {
    console.error('Error generating PayPal access token:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    throw new Error(`Failed to get PayPal access token: ${error.message}`)
  }
}

exports.createOrder = async (amount = '100.00') => {
  try {
    const accessToken = await generateAccessToken()
    
    if (!accessToken) {
      throw new Error('Failed to get PayPal access token')
    }

    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`
    console.log(`Creating PayPal order at: ${url} for amount: ${amount}`)
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: 'EV Rental',
              description: 'rent an electric vehicle',
              quantity: 1,
              unit_amount: {
                currency_code: 'USD',
                value: amount
              }
            }
          ],
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount
              }
            }
          }
        }
      ],
      application_context: {
        return_url: `${BASE_URL}/complete-order`,
        cancel_url: `${BASE_URL}/cancel-order`,
        user_action: 'PAY_NOW',
        brand_name: 'White Carbon'
      }
    }

    const response = await axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: JSON.stringify(orderData)
    })

    console.log('PayPal order created successfully')
    
    // Check for approval link
    const approveUrl = response.data.links.find(link => link.rel === 'approve')
    if (!approveUrl || !approveUrl.href) {
      throw new Error('Approval URL not found in PayPal response')
    }
    
    return approveUrl.href
  } catch (error) {
    console.error('Error creating PayPal order:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    throw new Error(`Failed to create PayPal order: ${error.message}`)
  }
}

//this.createOrder().then(result => console.log(result))

exports.capturePayment = async (orderId) => {
  try {
    const accessToken = await generateAccessToken()
    
    if (!accessToken) {
      throw new Error('Failed to get PayPal access token')
    }

    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`
    console.log(`Capturing PayPal payment at: ${url} for order: ${orderId}`)
    
    const response = await axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log('PayPal payment captured successfully')
    return response.data
  } catch (error) {
    console.error('Error capturing PayPal payment:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    throw new Error(`Failed to capture PayPal payment: ${error.message}`)
  }
}