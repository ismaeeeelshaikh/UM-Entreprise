import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    props: { params: Promise<{ addressId: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { addressId } = params;
        const body = await request.json();
        const { fullName, phone, country, address, city, state, pincode, isDefault, email } = body;

        // specific check: verify addressing belongs to user
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== session.user.id) {
            return new NextResponse("Address not found or unauthorized", { status: 404 });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, isDefault: true, id: { not: addressId } },
                data: { isDefault: false },
            });

            // Update User model defaults
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

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                fullName,
                email,
                phone,
                country,
                address,
                city,
                state,
                pincode,
                isDefault,
            },
        });

        return NextResponse.json(updatedAddress);
    } catch (error) {
        console.error("[ADDRESS_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ addressId: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { addressId } = params;

        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== session.user.id) {
            return new NextResponse("Address not found or unauthorized", { status: 404 });
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADDRESS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
