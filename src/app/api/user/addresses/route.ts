import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        // ✅ Migration Fix: If no addresses found, check if User has legacy default address
        if (addresses.length === 0) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            });

            if (user?.defaultAddress) {
                console.log("Migrating legacy address for user:", session.user.id);
                const newAddress = await prisma.address.create({
                    data: {
                        userId: session.user.id,
                        fullName: user.name || "My Address",
                        email: user.email,
                        phone: user.defaultPhone || "",
                        country: user.defaultCountry || "India",
                        address: user.defaultAddress,
                        city: user.defaultCity || "",
                        state: user.defaultState || "",
                        pincode: user.defaultPincode || "",
                        isDefault: true,
                    },
                });
                addresses = [newAddress];
            }
        }

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("[ADDRESS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { fullName, phone, country, address, city, state, pincode, isDefault, email } = body;

        // Validate required fields
        if (!fullName || !phone || !country || !address || !city || !state || !pincode) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // If setting as default, unset other defaults first
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, isDefault: true },
                data: { isDefault: false },
            });

            // Also update the User model's default fields for backward compatibility/redundancy
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    defaultPhone: phone,
                    defaultCountry: country,
                    defaultAddress: address,
                    defaultCity: city,
                    defaultState: state,
                    defaultPincode: pincode,
                },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: session.user.id,
                fullName,
                email: email || session.user.email, // Fallback to session email
                phone,
                country,
                address,
                city,
                state,
                pincode,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(newAddress);
    } catch (error) {
        console.error("[ADDRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
