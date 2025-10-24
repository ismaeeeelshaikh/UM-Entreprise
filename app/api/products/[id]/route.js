import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return NextResponse.json({ product: JSON.parse(JSON.stringify(product)) });
}
