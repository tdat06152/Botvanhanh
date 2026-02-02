import { NextRequest, NextResponse } from "next/server";
import { getKB } from "@/lib/store";

export async function GET() {
    const kb = getKB();
    return NextResponse.json(kb);
}
