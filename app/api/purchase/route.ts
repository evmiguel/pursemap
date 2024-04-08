import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};

export async function POST(request: NextRequest) {
    const res = await request.json();
    const { name, cost, category, date } = res;

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    }) || { id: '' };
    const result = await prisma.purchase.create({
        data: {
            userId: user?.id,
            name,
            date: new Date(date),
            cost: parseFloat(cost),
            category
        }
    });
    return NextResponse.json({result});
}

export async function DELETE(request: NextRequest) {
    const res = await request.json()
    const { id } = res;
    const result = await prisma.purchase.delete({
        where: {
            id
        }
    })
    return NextResponse.json({result})
}