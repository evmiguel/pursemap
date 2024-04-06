import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
    return { $bigint: this.toString() };
};

export async function POST(request: NextRequest) {
    const res = await request.json();
    const { email, name, cost, category } = res;
    const result = await prisma.purchase.create({
        data: {
            email,
            name,
            cost: parseFloat(cost),
            category
        }
    });
    return NextResponse.json({result});
}