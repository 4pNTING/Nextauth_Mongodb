import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
