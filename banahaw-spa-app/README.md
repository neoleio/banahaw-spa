# Banahaw Spa — Full Website + Admin Dashboard

This is a React app with two parts:
- **Public website** (`/`) — pulls services, prices, gallery, and text from your Supabase database live.
- **Admin dashboard** (`/admin`) — log in to add/edit services & prices, manage gallery photos, edit site text, and view/manage customer bookings.

## Already done for you
- Database schema created in Supabase (`supabase_schema.sql` — already run)
- Supabase connection keys are already wired into `src/lib/supabase.js`
- Your admin login was created in Supabase Authentication

## How to run locally (optional, only if you want to preview before deploying)
```
npm install
npm run dev
```
Then open the URL it shows (usually http://localhost:5173).

## How to deploy to Vercel
1. Push this whole folder to a GitHub repository.
2. In Vercel, click **Add New → Project → Import Git Repository**, select your repo.
3. Leave all settings as default (Vercel auto-detects Vite). Click **Deploy**.
4. Your site goes live at a free `*.vercel.app` URL.

Every time you push a change to GitHub, Vercel redeploys automatically.

## How to use the admin dashboard
1. Go to `https://yoursite.vercel.app/admin`
2. Log in with the email/password you created in Supabase → Authentication → Users
3. Use the sidebar tabs:
   - **Bookings** — see every customer request, mark as Confirmed / Completed / Cancelled
   - **Services & Prices** — add, edit, hide, or delete treatments and their prices
   - **Gallery** — add or remove photos (paste an image URL)
   - **Site Text** — edit hero headline, about text, phone, address, hours, and social links

Changes you make in `/admin` show up on the live public site immediately — no redeploy needed, since the site reads live from the database.

## Adding gallery photos
The gallery tab needs an image **URL**, not a file upload. Easiest free options:
- Upload the photo to **imgur.com** (no account needed) and copy the direct image link
- Or upload to Google Drive, right-click → Share → "Anyone with the link", then use a direct-image-link converter

## Notes
- The booking form does not currently send you an email notification — submissions only appear in the `/admin` Bookings tab. Check that tab regularly, or ask to have email notifications added later.
- Keep your Supabase password and admin login private — anyone with admin credentials can edit your whole site.
