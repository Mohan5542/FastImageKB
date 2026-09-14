# Brandique Tools - Project Directives & Coding Standards

## 1. Mobile Compact Scaling Mandate (Critical)
In mobile view (`max-width: 768px` and `max-width: 380px`), all texts, buttons, cards, boxes, and spacing across the entire website must remain sleek and compact (never bulky or oversized):
- **Universal Root Scale**: The website enforces a compact mobile root font size (`13.5px` on screens `<= 768px`, and `12.5px` on small screens `<= 380px`). This automatically reduces all `rem`-based Tailwind typography, padding, margins, and gaps by ~16% to 22%.
- **Rem Units**: When creating new pages, components, or updating existing ones, always use standard Tailwind CSS classes (e.g. `text-xs`, `text-sm`, `text-base`, `p-3`, `p-4`, `gap-3`, `space-y-4`). Do NOT use large hardcoded pixel values (like `text-[32px]` or `p-[40px]`).
- **Responsive Sizing**:
  - Buttons: Keep mobile action buttons compact (`py-2.5 px-4` or `py-2 px-3`), text single-line with `font-semibold text-xs sm:text-sm`.
  - Cards & Containers: Use `p-3.5 sm:p-6 lg:p-8` instead of large desktop paddings on mobile.
  - Section Spacing: Use `py-8 sm:py-16` or `py-10 sm:py-20` rather than massive vertical padding on mobile.
  - Form Inputs: Keep inputs comfortably compact (`py-2 px-3 text-sm font-mono`).
- **Future Pages**: Any new HTML page or React route must link `/mobile-scale.css` or include the global mobile scaling rules in its `<head>` so that all future updates automatically inherit this same compact mobile appearance.
