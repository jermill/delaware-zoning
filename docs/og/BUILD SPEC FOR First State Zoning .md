\# 🏛️ FirstState Zoning — MVP Build Document    
\#\#\# A zoning lookup & permitted-use intelligence platform for Delaware (expandable to other states)

\---

\#\# 📌 1\. Product Scope (MVP)

\*\*FirstState Zoning\*\* is a SaaS that allows users to instantly look up:

\- Zoning classifications    
\- Permitted uses    
\- Use restrictions    
\- Overlay districts    
\- Dimensional requirements    
\- Special exceptions / conditional uses    
\- Basic permitting requirements  

MVP focuses \*\*only on Delaware\*\*, starting with all counties:

\- New Castle County    
\- Kent County    
\- Sussex County  

\#\#\# 🎯 MVP Promise  
\> “Type an address → instantly see zoning, what’s allowed, and what’s not.”

\#\#\# 👥 User Types  
\- \*\*Basic User\*\* (Realtors, Investors, Homebuyers)  
\- \*\*Pro User\*\* (Developers, Architects, Contractors)  
\- \*\*Business/Enterprise User\*\* (Brokerages, Title Companies)  
\- \*\*Platform Admin (HomeReady, Inc.)\*\*

\---

\#\# 📋 2\. User Flows

\---

\#\#\# 2.1 Basic User Flow

1\. User arrives at \*\*FirstStateZoning.com\*\*    
2\. Enters an address into the search bar    
3\. System returns:    
   \- Zoning district    
   \- Summary of permitted uses    
   \- Quick allowed/not allowed icons  

4\. User can:    
   \- Save a report    
   \- Export PDF (Pro only)    
   \- Create a free account to track searches  

\---

\#\#\# 2.2 Pro User Flow

1\. User logs in    
2\. Enters address    
3\. Gets advanced data:    
   \- Dimensional standards (setbacks, height, FAR)    
   \- Overlay data    
   \- STR (Short-Term Rental) rules    
   \- Flood zone (optional add-on)    
4\. Can:    
   \- Save properties    
   \- Run bulk searches    
   \- Export zoning PDFs    
   \- Add notes  

\---

\#\#\# 2.3 Business/Enterprise Flow

1\. Admin for a real estate team logs in    
2\. Adds team members    
3\. Enables unlimited searches    
4\. Downloads zoning reports in bulk    
5\. Tracks team activity  

\---

\#\#\# 2.4 Platform Admin Flow

1\. Log into admin dashboard    
2\. Add zoning datasets    
3\. Modify permitted-use rules    
4\. Manage users & subscriptions    
5\. See system metrics  

\---

\#\# 🚀 3\. Onboarding

\#\#\# 3.1 Basic (Free) Onboarding

\- Enter email \+ password OR Google login    
\- Create 1 free saved property    
\- Option to upgrade to Pro  

\#\#\# 3.2 Pro Onboarding

\- User selects plan    
\- Redirected to Stripe Checkout    
\- Subscription activates    
\- User receives:    
  \- PDF exports    
  \- Unlimited saved properties    
  \- Advanced zoning data  

\#\#\# 3.3 Business Onboarding

\- Sales-assisted or Stripe Checkout    
\- Create organization    
\- Invite team members  

\---

\# ⚙️ 4\. MVP Feature List

\---

\#\# Basic Features (Free or $19/mo)

\- Address search    
\- Zoning district lookup    
\- Summary of permitted uses    
\- Save 5 properties    
\- View zoning notes    
\- Map pin display    
\- Limited PDF export (watermarked)

\---

\#\# Pro Features ($49/mo)

\- Unlimited searches    
\- Full permitted use matrix    
\- Setbacks / height / lot area    
\- Overlay rules    
\- STR restrictions (if available)    
\- Flood zone data (optional add-on)    
\- Unlimited saved properties    
\- Clean PDF export  

\---

\#\# Business Features ($99/mo+)

\- 5–10 team seats    
\- Bulk address upload    
\- Bulk report download    
\- Permission management    
\- Priority data updates  

\---

\#\# Admin Features

\- Edit zoning datasets    
\- Upload spreadsheets/CSV zoning rules    
\- Add new counties/states    
\- Override permitted-use logic    
\- Manage subscriptions  

\---

\# 🧱 5\. Backend Data Model (Supabase)

All schemas below are compatible with Supabase \+ Postgres.

\---

\#\# 5.1 \`zoning\_districts\`

Stores zoning codes (e.g., “R-3”, “C-1”).

\`\`\`sql  
create table zoning\_districts (  
  id uuid primary key default gen\_random\_uuid(),  
  state text default 'DE',  
  county text not null,  
  district\_code text not null,  
  name text,  
  description text,  
  created\_at timestamptz default now()  
);  
5.2 permitted\_uses  
Maps allowed uses per zoning district.

sql  
Copy code  
create table permitted\_uses (  
  id uuid primary key default gen\_random\_uuid(),  
  zoning\_id uuid references zoning\_districts(id) on delete cascade,  
  use\_category text not null,   \-- e.g. 'Residential', 'Commercial'  
  use\_type text not null,       \-- e.g. 'Single Family', 'Retail'  
  allowed boolean not null,  
  conditions text,              \-- conditional use requirements  
  created\_at timestamptz default now()  
);  
5.3 dimensional\_standards  
For setbacks, heights, lot size, etc.

sql  
Copy code  
create table dimensional\_standards (  
  id uuid primary key default gen\_random\_uuid(),  
  zoning\_id uuid references zoning\_districts(id),  
  front\_setback numeric,  
  side\_setback numeric,  
  rear\_setback numeric,  
  max\_height numeric,  
  min\_lot\_area numeric,  
  far numeric,  
  created\_at timestamptz default now()  
);  
5.4 properties\_search\_history  
Tracks address lookups.

sql  
Copy code  
create table properties\_search\_history (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid references auth.users(id),  
  address text not null,  
  zoning\_result jsonb,  
  created\_at timestamptz default now()  
);  
5.5 saved\_properties  
sql  
Copy code  
create table saved\_properties (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid references auth.users(id),  
  address text not null,  
  zoning\_data jsonb,  
  notes text,  
  created\_at timestamptz default now()  
);  
5.6 subscriptions (similar to HomeReady)  
sql  
Copy code  
create table subscriptions (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid references auth.users(id),  
  stripe\_customer\_id text,  
  stripe\_subscription\_id text,  
  stripe\_price\_id text,  
  plan text check (plan in ('basic', 'pro', 'business')),  
  status text,  
  created\_at timestamptz default now()  
);  
📂 6\. Storage Buckets (Supabase)  
1\. reports  
Stores exported zoning PDFs.

Structure:

bash  
Copy code  
user\_id/report\_id.pdf  
2\. datasets  
Stores imported zoning spreadsheets/maps.

🔐 7\. Row-Level Security (High-Level)  
Rules:  
Users can only access their searches (properties\_search\_history.user\_id \= auth.uid()).

Saved properties are private.

Only Platform Admins can modify zoning\_districts, permitted\_uses, etc.

Example:

sql  
Copy code  
create policy "user can view own searches"  
on properties\_search\_history  
for select using (user\_id \= auth.uid());  
Admin bypass is done with JWT custom claim.

💳 8\. Stripe Subscription Structure  
Plans:  
Basic – $19/mo  
Unlimited zoning lookups

Basic permitted use summary

Save 5 properties

Pro – $49/mo  
Everything in Basic PLUS:

Unlimited saved properties

Full dimensional standards

PDF export

Overlay data

Flood zone

Business – $99/mo  
5–10 seats

Unlimited searches

Bulk upload

Bulk PDF exports

Stripe Setup:

Products:

firststatezoning\_basic

firststatezoning\_pro

firststatezoning\_business

Monthly prices:

$19

$49

$99

Webhook updates subscription table.

🧭 9\. Summary  
This MVP specification includes:

✔ User flows

✔ Onboarding steps

✔ Basic/Pro/Business feature sets

✔ Full database schema for zoning logic

✔ Storage bucket structure

✔ RLS setup

✔ Stripe subscription structure

This is everything needed to start building FirstState Zoning immediately.  
