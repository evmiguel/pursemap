import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};

export async function POST(request: NextRequest) {
    const res = await request.json();
    const { email, name, cost, category, date } = res;
    const result = await prisma.purchase.create({
        data: {
            email,
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