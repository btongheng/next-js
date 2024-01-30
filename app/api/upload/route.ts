import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const buketName = 'images'
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const file = await request.blob();
    const header = headers();
    const fileName = header.get("X-Vercel-Filename")

    await supabase.storage
        .from(buketName)
        .upload(fileName, file, {
        })

    const { data } = supabase.storage
        .from(buketName)
        .getPublicUrl(fileName)

    return NextResponse.json({
        url: data.publicUrl
    })

}