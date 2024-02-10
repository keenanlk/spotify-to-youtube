import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAuthorizeUrl } from "@/app/lib/youtube-client";

async function handler(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const authUrl = await getAuthorizeUrl();
  return Response.redirect(authUrl);
}

export { handler as GET, handler as POST };
