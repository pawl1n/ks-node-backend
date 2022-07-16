import Product from '../models/Product.mjs'
import Order from '../models/Order.mjs'
import Purchase from '../models/Purchase.mjs'
import User from '../models/User.mjs'

export async function overview(req, res) {
  try {
    const monthAgo = new Date(new Date() - 1000 * 3600 * 24 * 30)
    const now = new Date()

    const productsCount = await Product.countDocuments()
    const ordersCount = await Order.countDocuments({
      date: { $gte: monthAgo, $lte: now }
    })

    const usersCount = await User.countDocuments({
      created: { $gte: monthAgo, $lte: now }
    })

    const ordersDataByMonth = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: monthAgo,
            $lte: now
          },
          status: {
            $in: ['Delivered']
          }
        }
      },
      {
        $group: {
          _id: {
            dayOfMonth: {
              $dayOfMonth: '$date'
            },
            month: {
              $month: '$date'
            }
          },
          count: {
            $sum: 1
          }
        }
      }
    ])

    const purchasesData = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalSum: {
            $sum: '$totalPrice'
          }
        }
      }
    ])

    const ordersData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSum: {
            $sum: '$totalPrice'
          }
        }
      }
    ])

    const ordersSum = ordersData.length ? ordersData[0].totalSum : 0
    const purchasesSum = purchasesData.length ? purchasesData[0].totalSum : 0
    const revenue = ordersSum - purchasesSum

    return res.status(200).json({
      success: true,
      message: '',
      data: {
        productsCount: +productsCount,
        ordersCount: +ordersCount,
        revenue: +revenue,
        usersCount: usersCount,
        ordersDataByMonth: ordersDataByMonth
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(200).json({
      success: false,
      message: err
    })
  }
}

export function analytics(req, res) {}
