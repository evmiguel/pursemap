import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
}
export async function POST(request: NextRequest) {
    const res = await request.json();
    const { date, cost } = res;
    const result = await prisma.purchase.findMany({
        where: {
            date: new Date(date),
            cost
        }
    })
    return NextResponse.json({ result })
}