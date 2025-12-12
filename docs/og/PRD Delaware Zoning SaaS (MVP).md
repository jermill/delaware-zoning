# **PRD \#1 — Delaware Zoning SaaS (MVP)**

## **Brand Name Options (Delaware-Based)**

Pick one of these styles:

### **Professional & Trustworthy**

* **Zonely DE**

* **Zonemap Delaware**

* **FirstState Zoning**

* **BlueHen Zoning**

* **ZoningDE**

### **Real-estate focused**

* **DE LandCheck**

* **ZoningLookup Delaware**

* **ParcelScope DE**

### **My top choice: FirstState Zoning**

✔ Simple  
 ✔ Trustworthy  
 ✔ Delaware heritage (First State)  
 ✔ Easy to brand  
 ✔ Scales when you expand to other states ("FirstState Zoning — DE | MD | PA").

---

# **📝 PRODUCT REQUIREMENTS DOCUMENT — MVP**

## **Product Name: *FirstState Zoning***

## **Objective:**

Provide a **simple zoning lookup tool** for Delaware real estate professionals. User enters an address → instantly sees zoning code \+ allowed uses.

## **Target Users:**

* Realtors

* Investors

* Developers

* Architects

* Surveyors

* Contractors

* Land-use consultants

## **Primary MVP Value:**

**Save time and prevent mistakes** by showing zoning info in one click.

---

# **1\. MVP Core Features (Nothing Extra)**

These are the **ONLY** features in version 1\.

## **1\. Address Search Bar**

User enters:

* full address

* or parcel number

System returns property.

### **Requirements**

* Autocomplete suggestions

* Error handling (“address not found”)

* Fast lookup (\<2 seconds)

---

## **2\. Zoning Code Display (Single Line)**

Show the zoning classification as the **main output**.  
 Example:

* “R-1 — Single Family Residential”

* “C-3 — Highway Commercial”

### **Requirements**

* Clean, readable layout

* Always show the jurisdiction (New Castle County, Kent, Sussex, Wilmington, Dover, etc.)

---

## **3\. Allowed Uses Summary**

Direct, non-technical descriptions of what the user can do with the property.

Example:

* **Allowed:** Single-family homes, accessory structures

* **Conditional:** Duplex (requires approval)

* **Not allowed:** Commercial businesses

### **Rules**

* Use *plain language*

* Keep it to **5–8 bullet points max**

* Pull from zoning code tables for each county/city

---

## **4\. Basic Parcel Information**

Only the essentials:

* Property size (acres or sq ft)

* Parcel ID

* County / Municipality

* Flood zone (basic classification only)

No advanced mapping, no overlays yet.

---

## **5\. Permits Needed (Quick Checklist)**

A short list of common permits based on zone type.

Example output:

* Building permit (if expanding structure)

* Conditional use permit (if adding multi-family)

* Sign permit (commercial zones only)

### **Goals**

* Keep the list simple

* Link to official county websites (external)

---

## **6\. Save / Export PDF (Simple 1-page)**

User downloads a **single-page zoning report**.

Content:

* Address

* Zoning code

* Allowed uses

* Basic parcel info

* Permits checklist

This is all Realtors need for clients.

---

# **2\. Features Explicitly Excluded from MVP (Future Roadmap)**

So the product stays lean.

❌ No maps  
 ❌ No account login system (optional for v1)  
 ❌ No favorites system  
 ❌ No overlays (wetlands, setbacks, sewer lines, etc.)  
 ❌ No API  
 ❌ No comparisons  
 ❌ No commenting/collaboration  
 ❌ No mobile app

MVP \= *clean search → zoning → simple summary*.

---

# **3\. User Flow (Ultra Simple)**

### **Step 1 — User lands on homepage**

Sees a large search box:  
 **“Enter Address or Parcel ID”**

### **Step 2 — User types address**

Autocomplete suggestions appear.

### **Step 3 — System displays zoning results**

Sections:

1. Zoning Category

2. Allowed Uses

3. Parcel Basics

4. Permit Checklist

5. Download Report button

### **Step 4 — User downloads PDF (optional)**

That’s it.

---

# **4\. UI Style Requirements**

* Clean white background

* Dark navy \+ Delaware gold accents (state colors)

* Simple icons only

* Everything readable on one screen

* No jargon

* No clutter

Example layout:

`---------------------------------------------------`  
`| Address Search Bar                              |`  
`---------------------------------------------------`  
`| Zoning Code:  R-2 (Single Family Residential)   |`  
`---------------------------------------------------`  
`| Allowed Uses                                    |`  
`|  - Single-family home                           |`  
`|  - Accessory building                           |`  
`|  - Home-based business (limited)                 |`  
`---------------------------------------------------`  
`| Parcel Basics                                   |`  
`|  - Parcel ID: XXXXXXX                           |`  
`|  - Size: 0.34 acres                             |`  
`|  - County: New Castle                           |`  
`|  - Flood Zone: X                                |`  
`---------------------------------------------------`  
`| Permit Checklist                                |`  
`|  - Building permit (if expanding)               |`  
`|  - Fence permit (if over 6 ft)                  |`  
`---------------------------------------------------`  
`| Download PDF                                     |`  
`---------------------------------------------------`

---

# **5\. Technical Requirements (MVP Level Only)**

Backend can be lightweight:

### **Data Sources**

* County zoning tables (public)

* Parcel lookup via state GIS endpoints or scraped static tables

### **System Architecture**

* PostgreSQL or SQLite database

* Simple backend (Node.js, Python, Ruby—your choice)

* CDN for static data

### **Performance Requirements**

* Zoning lookup \< 2 seconds

* PDF export \< 3 seconds

---

# **6\. Pricing Model (MVP-Simple)**

Three initial options:

### **Monthly subscription**

* **$19/mo**: Unlimited searches

* **$49/mo**: Team access (up to 5 users)

OR

### **Credits system**

* Free trial: 5 searches

* $10 \= 20 searches

MVP should launch with **just one paid plan**, not multiple.

---

# **7\. Launch Strategy (Delaware-Focused)**

### **1\. Reach out to:**

* Delaware Association of Realtors

* Local real estate Facebook groups

* Real estate brokerages

* Title agents

* Small developers

### **2\. Offer:**

* 2-week free trial

* “Founding user” pricing locked for life

### **3\. Build trust with local branding:**

Use Delaware identity heavily — “First State,” “Blue Hen,” etc.

---

# **✔ MVP Success Criteria**

* First 10 paying users in 30 days

* Users complete zoning lookup in under 20 seconds

* 80% of searches successfully resolve an address

* Users request additional zoning features (validate demand)

