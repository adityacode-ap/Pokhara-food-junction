import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller is authenticated and is an owner
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const caller = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: callerData, error: callerError } = await caller.auth.getUser();
    if (callerError || !callerData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: callerStaff } = await admin
      .from("staff_members")
      .select("role")
      .eq("id", callerData.user.id)
      .maybeSingle();

    if (!callerStaff || callerStaff.role !== "owner") {
      return new Response(JSON.stringify({ error: "Only owners can manage staff" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);

    // GET: list all staff members
    if (req.method === "GET") {
      const { data, error } = await admin
        .from("staff_members")
        .select("id, email, display_name, role, created_at")
        .order("created_at");

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: create a new staff account
    if (req.method === "POST") {
      const body = await req.json();
      const { email, password, display_name, role } = body;

      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: insertError } = await admin.from("staff_members").insert({
        id: newUser.user.id,
        email,
        display_name: display_name ?? "Staff",
        role: role === "owner" ? "owner" : "staff",
      });

      if (insertError) {
        // Best-effort cleanup: delete the auth user if the staff row fails
        await admin.auth.admin.deleteUser(newUser.user.id);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, id: newUser.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE: remove a staff account
    if (req.method === "DELETE") {
      const body = await req.json();
      const userId = body.id;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing id parameter" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-deletion
      if (userId === callerData.user.id) {
        return new Response(JSON.stringify({ error: "You cannot delete your own account" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // staff_members row is auto-deleted via ON DELETE CASCADE
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
