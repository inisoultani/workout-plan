import { createClient } from "@supabase/supabase-js";

const targetEmail = "workoutplanapp@bltiwd.com";
const password = "123456";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserIdByEmail(email) {
  let page = 1;
  const perPage = 1000;
  // Paginate until user is found or no more results
  // Note: adjust perPage/page if your project has many users
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find(u => (u.email || "").toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (!data.users.length || data.users.length < perPage) return null;
    page += 1;
  }
}

try {
  // Delete existing user (if any)
  const existingId = await findUserIdByEmail(targetEmail);
  if (existingId) {
    console.log(`Deleting existing user ${existingId} for email ${targetEmail}...`);
    const { error: delErr } = await supabase.auth.admin.deleteUser(existingId);
    if (delErr) throw delErr;
  }

  // Create fresh user
  const { data, error } = await supabase.auth.admin.createUser({
    email: targetEmail,
    password: password,
    email_confirm: true,
    user_metadata: { seed: true },
  });
  if (error) throw error;
  console.log("Created user:", data.user.id);
} catch (e) {
  console.error(e);
  process.exit(1);
}