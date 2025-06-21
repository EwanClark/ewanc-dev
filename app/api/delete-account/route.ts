import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Ensure the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete user data from profiles table first
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return NextResponse.json(
        { error: "Failed to delete profile data" },
        { status: 500 }
      );
    }

    // Add more table cleanups as needed
    // e.g. delete user's posts, comments, etc.

    // Call the Supabase Edge Function to delete the user's authentication record
    try {
      const supabaseAuthToken =
        req.headers.get("authorization")?.split(" ")[1] || "";

      const deleteResponse = await fetch(
        "https://rzemkbfqoqpwpouyafkp.supabase.co/functions/v1/delete-account",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAuthToken}`, // Pass the user's token for security
          },
          body: JSON.stringify({ userId }),
        }
      );

      const responseData = await deleteResponse.json();

      if (!deleteResponse.ok) {
        console.error(
          "Error calling delete user function:",
          responseData.error
        );
        return NextResponse.json(
          {
            error:
              "Failed to delete user authentication record: " +
              responseData.error,
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error calling delete user function:", error);
      return NextResponse.json(
        { error: "Failed to delete user authentication record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete account route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
