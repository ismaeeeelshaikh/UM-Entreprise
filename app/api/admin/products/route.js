import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request) {
  await connectDB();
  const products = await Product.find({});
  const safeProducts = JSON.parse(JSON.stringify(products));
  return NextResponse.json({ products: safeProducts });
}
