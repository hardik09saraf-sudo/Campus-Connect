# CampusConnect — Campus Event Management & Registration Portal

## What this project does
This is a functional front-end event portal built using:
- HTML
- CSS
- Vanilla JavaScript
- localStorage (browser database)

## Working features
1. Browse campus events
2. Search events
3. Filter by category
4. Sort by date, seats or name
5. Register for an event
6. Prevent duplicate registration
7. Automatically reduce available seats
8. My Registrations page
9. Organizer dashboard
10. Create, edit and delete events
11. Dashboard statistics
12. Data remains after refreshing the browser

## How to run
1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Double-click `index.html`.
3. The portal opens in your browser.
4. Use Organizer → Create Event to demonstrate event management.
5. Use Events → Register to demonstrate student registration.

## Important project explanation
This version is a real working browser application. Its data is stored in localStorage, so it works without installing a server.

For a true multi-user college deployment, the same interface can later be connected to a backend/database such as Firebase, Supabase, Node.js + Express + MongoDB, or MySQL. That is required if multiple students on different devices must share the same registrations.

## Suggested teacher demonstration
- Start at Home.
- Show event search/filter.
- Register a student for an event.
- Open My Registrations and show the confirmation.
- Open Organizer.
- Create a new event.
- Edit the event.
- Delete it.
- Refresh the page and show that data persists.

