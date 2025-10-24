import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = { active: true };
  if (searchParams.has('category')) {
    query.category = searchParams.get('category');
  }
  if (searchParams.has('search')) {
    query.$text = { $search: searchParams.get('search') };
  }
  const products = await Product.find(query);
  return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
}
