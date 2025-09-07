// app/api/chats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
      // TODO: get the current session for the current user from const session = await getCurrentUser();

    const { staffId, userId, from, text } = await request.json();

    if (!staffId || !userId || !from || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    } 

    const message = await prisma.message.create({
      data: {
        staffId,
        userId,
        from,
        text,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const session = await getCurrentUser();

//     if (!session?.USER) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch staff (doctor/nurse/admin) the user has sent messages to
//     const messages = await prisma.message.findMany({
//       where: { from: session.user.id },
//       orderBy: { createdAt: "desc" },
//     });

//     // Extract unique staffIds from messages
//     const staffIds = [...new Set(messages.map((msg) => msg.staffId))];

//     const staffs = await prisma.user.findMany({
//       where: { id: { in: staffIds } },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         role: true,
//       },
//     });

//     return NextResponse.json({ staffs, messages });
//   } catch (error) {
//     console.error("Chats fetch error:", error);
//     return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
//   }
// }
