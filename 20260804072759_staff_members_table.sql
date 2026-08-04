/*
# Staff Members Table

## Overview
Creates a `staff_members` table to track who has access to the admin dashboard.
The edge function `manage-staff` handles creating and deleting auth accounts
using the service role key; this table stores the display name and role for
each staff member so the dashboard can list them.

## New Table

`staff_members`
- `id` uuid PK — matches the auth.users id (one row per staff account)
- `email` text — the staff member's login email
- `display_name` text — friendly name shown in the dashboard
- `role` text — 'owner' or 'staff' (owner can manage other staff)
- `created_at` timestamp

## Security (RLS)
- RLS enabled.
- Any authenticated staff member can read the staff list (SELECT to authenticated).
- All writes go through the edge function using the service role key (bypasses RLS),
  so no INSERT/UPDATE/DELETE policies are needed from the client.

## Seed
- Inserts a row for the existing staff account (staff@foodjunction.com.np) as 'owner'.
*/

CREATE TABLE IF NOT EXISTS staff_members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT 'Staff',
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_staff_members" ON staff_members;
CREATE POLICY "auth_read_staff_members" ON staff_members FOR SELECT
  TO authenticated USING (true);

-- Seed the existing owner account
INSERT INTO staff_members (id, email, display_name, role)
SELECT id, email, 'Owner', 'owner' FROM auth.users WHERE email = 'staff@foodjunction.com.np'
ON CONFLICT (id) DO NOTHING;
