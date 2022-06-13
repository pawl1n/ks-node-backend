import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'
import Product from '../models/Product.mjs'
dotenv.config()

const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
)
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

export function sendMail(name, order, recipient) {
  if (!order) {
    return
  }
  const accessToken = OAuth2_client.getAccessToken()

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  })

  const html = getHtmlMessage(name, order).then((html) => {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: recipient,
      subject: 'Нове замовлення',
      html
    }

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error: ', error)
      } else {
        console.log(info)
      }
      transport.close()
    })
  })
}

async function getHtmlMessage(name, order) {
  const data = await getProductsAndTotalSum(order)
  const html = `
  <style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
  </style>
    <body>
      <h1>Привіт, ${name}!</h1>
      <p>
        Ви замовили товари:
      </p>
      <ul>
        ${data.products
          .map((product) => `<li>${product.name} - ${product.quantity}</li>`)
          .join('')}
      </ul>
      <p>
        На суму: ${data.totalPrice} грн.
      </p>
      <p>
        Дякуємо за покупку!
      </p>
    </body>
  `
  return html
}

async function getProductsAndTotalSum(order) {
  let totalPrice = 0
  const products = []
  for (let item of order.list) {
    totalPrice += +item.cost * +item.quantity
    const product = await Product.findById(item.product)
    products.push({
      name: product.name,
      quantity: item.quantity,
      price: item.cost
    })
  }
  return {
    products,
    totalPrice
  }
}
