import { getPercentageChange } from "@/helper/getPercentageChange";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
let cachedInsights: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GET = async (req: NextRequest) => {
  try {
    const isAdminMiddlewareResponse = await isAdmin(req);
    if (isAdminMiddlewareResponse) {
      return isAdminMiddlewareResponse;
    }

    const now = Date.now();

    // ✅ Return cached data if it's still fresh
    if (cachedInsights && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedInsights);
    }

    await connectDB();

    const currentDate = new Date();
    const startOfThisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // === ORDERS & SALES INSIGHTS FOR MAIN CARDS ===
    const thisMonthOrders = await (Order as mongoose.Model<IOrder>).find({
      createdAt: { $gte: startOfThisMonth },
      paymentStatus: "paid",
    });

    const lastMonthOrders = await (Order as mongoose.Model<IOrder>).find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      paymentStatus: "paid",
    });

    const totalOrdersThisMonth = thisMonthOrders.length;
    const totalSalesThisMonth = thisMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrdersLastMonth = lastMonthOrders.length;
    const totalSalesLastMonth = lastMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // === USERS INSIGHTS FOR MAIN CARDS ===
    const totalUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfThisMonth },
      role: "user",
    });

    const totalUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      role: "user",
    });

    const registeredCustomers = await User.countDocuments({ role: "user" });

    // === GROWTH CALCULATIONS FOR MAIN CARDS ===
    const orderGrowth = getPercentageChange(
      totalOrdersThisMonth,
      totalOrdersLastMonth
    );
    const salesGrowth = getPercentageChange(
      totalSalesThisMonth,
      totalSalesLastMonth
    );
    const customerGrowth = getPercentageChange(
      totalUsersThisMonth,
      totalUsersLastMonth
    );

    // SALES BY CATEGORY PIE-CHART INFO

    const mainCategories = [
      "VW-T5",
      "VW-T6.1",
      "VW-T7",
      "Universal Camper Parts",
    ];
    const colors = ["#2DD4BF", "#F59E0B", "#38BDF8", "#8B5CF6"];

    // Step 1: Fetch paid orders and populate products
    const paidOrders = await (Order as mongoose.Model<IOrder>)
      .find({ paymentStatus: "paid" })
      .populate("items.product");

    // Step 2: Calculate sold quantity per category
    const categoryCountMap = new Map<string, number>();

    for (const order of paidOrders) {
      for (const item of order.items) {
        const product = item.product as unknown as IProduct;
        const category = product.mainCategory;
        const prevQty = categoryCountMap.get(category) || 0;
        categoryCountMap.set(category, prevQty + item.quantity);
      }
    }

    // Step 3: Compute total sold quantity
    const totalSoldQty = mainCategories.reduce(
      (sum, cat) => sum + (categoryCountMap.get(cat) || 0),
      0
    );

    // Step 4: Build full categoryData array
    const categoryData = mainCategories.map((name, index) => {
      const value = categoryCountMap.get(name) || 0;
      const percentage =
        totalSoldQty === 0
          ? "0.00%"
          : ((value / totalSoldQty) * 100).toFixed(2) + "%";

      return {
        name,
        value,
        color: colors[index % colors.length],
        percentage,
      };
    });

    //END OF SALES BY CATEGORY PIE-CHART INFO

    // TOP CUSTOMERS TABLE INFO
    const topCustomers = await (User as mongoose.Model<IUser>)
      .find(
        { totalSpent: { $gt: 0 } }, // optional filter to exclude zero spenders
        { name: 1, email: 1, totalSpent: 1, _id: 1 } // fields to return
      )
      .sort({ totalSpent: -1 }) // sort descending by totalSpent
      .limit(10);
    // END OF TOP CUSTOMERS TABLE INFO

    // LOW STOCK TABLE INFO
    const dbProducts = await (Product as mongoose.Model<IProduct>)
      .find(
        {},
        {
          name: 1,
          images: 1,
          variants: 1,
        }
      )
      .lean();

    const products = dbProducts.flatMap((product) =>
      product.variants.map((variant) => ({
        name: product.name,
        variantName: variant.name,
        availableStocks: variant.stock,
        inStock: variant.stock > 5,
        image: product.images?.[0] || "/images/default.png",
      }))
    );

    // END OF LOW STOCK TABLE INFO

    const result = {
      totalOrdersThisMonth,
      totalSalesThisMonth,
      registeredCustomers,
      change: {
        orderGrowth: {
          percentage: parseFloat(orderGrowth.percentage.toFixed(2)),
          impact: orderGrowth.impact,
        },
        salesGrowth: {
          percentage: parseFloat(salesGrowth.percentage.toFixed(2)),
          impact: salesGrowth.impact,
        },
        customerGrowth: {
          percentage: parseFloat(customerGrowth.percentage.toFixed(2)),
          impact: customerGrowth.impact,
        },
      },
      categoryData,
      topCustomers,
      lowStockInfo: products,
    };

    // ✅ Cache the result
    cachedInsights = result;
    lastFetchTime = now;

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
