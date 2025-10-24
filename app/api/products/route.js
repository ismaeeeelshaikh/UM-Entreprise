import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/products - Get all products with filtering
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    const query = { active: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products - Create new product (Admin only)
 */
export async function POST(request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: error.message === 'Forbidden - Admin access required' ? 403 : 500 }
    );
  }
}
