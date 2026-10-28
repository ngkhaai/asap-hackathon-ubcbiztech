https://asapproductplus.lovable.app

# ASAP: "Right need. Right now."

UBC BizTech case question: How might SAP help retailers close the gap between demand shifts and the business's response?

# Summary

ASAP is a mobile app built on SAP. When a hot item runs out at one store, the store team gets the right stock fast:

FLAG: any salesperson scans the empty size on their phone.
PICK: the store manager sees options ranked by fastest arrival and most profit: transfer from a nearby store, warehouse restock, or "save the sale" (ship to the customer).
APPROVE: the regional allocator approves. The stock transfer is created in SAP S/4HANA, and the sending store picks it with SAP's existing Transfer Products app.

Case company: Arc'teryx (Amer Sports), reported to run SAP S/4HANA and to operate about 75 stores in North America (see note in section 6). Hypothetical personas: Tom (a shopper who loses his size), store staff and manager, Daniel (regional allocator).

# How it works
**Step	Who	What happens**
- Flag	Any salesperson	Scans the empty size; stock is read live from S/4HANA
- Pick	Store manager	Sees ranked options (fastest arrival, most profit) with units, ETA, cost, and risk to the sending store
- Approve	Regional allocator	One tap creates the transfer in S/4HANA; the sending store picks it up in SAP's Transfer Products app

*Delivery options*: same-day courier (e.g., Uber Direct, about 10 mi in Vancouver), next scheduled truck, staff walk-over, or ship to the customer. Payments ("save the sale"): integrate an existing mobile POS (Tap to Pay on iPhone, Canada 2024); we do not build our own.

**Why mobile?**

We see stock gaps on the floor. SAP's phone apps (Look Up Retail Products, Transfer Products) show nearby-store stock and move it, but do not rank options or route approval. No new hardware is needed. Trade-off: Walmart moved from staff using their own phones (2018) to issuing 740K+ company phones (2021), so ASAP supports both.

**Why these users?**

Salespeople see the gap first, managers know the store, and allocators own transfers. Each person does the step they are closest to.

**Market map**
Product	| What it does |	Gap
SAP IBP / Retail Intelligence	| Forecasts |	No store action
SAP store apps	| See and move stock |	No ranking, no approval chain
Nextail Store Requests (closest rival)	| Staff request a size on mobile; head office approves |	Warehouse only, next replenishment cycle, not built on SAP

*Positioning: ASAP is the missing connection between them. We do not claim new forecasting.*

