🧩 Component-wise Development Flow (in order)
1. Core UI Foundations

• Colour Menu
   ‣ Visual colour picker with selection state
   ‣ Single and toggle selection logic
• Range Menu
   ‣ Price range slider with min–max constraints
   ‣ Synchronised input boxes and sliders
• Checkbox Menu
   ‣ Multi-select filters (body shape, material, finish, case)
   ‣ Independent state tracking per filter group


2. Product Display Architecture

• Div Card
   ‣ Reusable product card layout
   ‣ Image, title, price, and metadata separation
• Detail Card
   ‣ Expanded product information structure
• Quantity Bar
   ‣ Increment and decrement logic
   ‣ Upper bound enforcement from inventory stock
• Menu Containers
   ‣ Logical grouping of UI elements
   ‣ Layout-safe composition without hard coupling


3. Side Panel System

• Side Panel
   ‣ Collapsible filter panel
   ‣ Animated open/close behaviour
• Add Menu
   ‣ Admin-only actions entry
• Side Panel Add Menu
   ‣ Inventory creation and management entry points


4. Colour & Media Handling

• Colour Picker
   ‣ Colour-specific stock tracking
   ‣ Visual sync with quantity and cart state
• Image Uploader
   ‣ Structured image handling for products
   ‣ Designed for database storage compatibility


5. Inventory & Data Layer

• Guitar Inventory
‣ Centralised product data model
   ‣ Colour-wise stock, pricing, and metadata
• Basic Bucket Extraction
   ‣ Media asset retrieval logic
   ‣ Separation of UI and storage concerns
• Add New Guitar
   ‣ Inventory insertion workflow
   ‣ UI → database pipeline (Supabase)


6. Shopping Cart System

• Shopping Cart
   ‣ Colour-specific cart entries
   ‣ Quantity-aware item tracking
• Menu + Shopping Cart Collaboration
   ‣ Cart icon badge sync
   ‣ Real-time quantity aggregation

• Strict Cart Rules
   ‣ Quantity change automatically removes the item from the cart
   ‣ Colour re-selection restores the previous quantity state


7. Payment Flow

• Payment Submit
   ‣ Order finalisation logic
• Cart Payment
   ‣ Cart → payment state transition
   ‣ Clean separation between UI and transaction intent


8. Inventory Management

• Manage Inventory
   ‣ Admin inventory overview
   ‣ Edit and control existing products.


9. UX & System Reliability

• Loading Screen
   ‣ Full-screen loader overlay
   ‣ Prevents user interaction during:
    ⁃ Page transitions
    ⁃ Data fetch
    ⁃ Auth validation
• Navigation with Loader
‣ Consistent loader usage across all page changes
‣ No partial renders or UI flicker


10. Final Assembly

• Assembly 1
   ‣ Component-level integration
• Assembly 2
   ‣ Full page-level integration
   ‣ Realistic user flow simulation


🧠 Key Design Principles

● Component-first development
● State correctness over visual hacks
● No shared global mutation without intent
● Real e-commerce behaviour (not demo logic)
● UI and database concerns are clearly separated


🛠️ Tech Stack

● HTML5
● CSS3 (component-scoped styling)
● Vanilla JavaScript (modular, event-driven)
● Supabase (authentication + database)
● LocalStorage for client-side persistence
● Firebase Auth (user identity layer)

📌 Purpose

This repository is not a template and not a UI showcase.
It is a learning-driven, production-style breakdown of how a complex inventory and cart system should be built incrementally and correctly.
