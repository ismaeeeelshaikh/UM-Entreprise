// /app/api/featured-products/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find({ featured: true, active: true })
    .limit(8);
  return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
}
