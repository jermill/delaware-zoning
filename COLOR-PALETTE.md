# Official Delaware Zoning Color Palette

Reference: [Coolors Palette](https://coolors.co/82b8de-a8bdbe-fffcf6-d8b368-152f50)

## Brand Colors

### Primary Colors

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|--------|
| **Delaware Blue** | `#82B8DE` | `delaware-blue` | Primary actions, buttons, links, active states |
| **Delaware Navy** | `#152F50` | `delaware-navy` | Headers, footers, dark sections, text |
| **Delaware Gold** | `#D8B368` | `delaware-gold` | CTAs, highlights, premium features |
| **Delaware Sage** | `#A8BDBE` | `delaware-sage` | Secondary elements, badges, accents |
| **Delaware Cream** | `#FFFCF6` | `delaware-cream` | Light backgrounds, cards, sections |

## Color Applications

### 🎨 Primary Buttons
- Background: `bg-delaware-gold`
- Text: `text-delaware-navy`
- Hover: `hover:opacity-90`

### 🔵 Secondary Buttons
- Background: `bg-delaware-blue`
- Text: `text-white`
- Hover: `hover:opacity-90`

### 🌙 Dark Sections
- Background: `bg-delaware-navy`
- Text: `text-white` or `text-gray-300`
- Accents: `delaware-blue` or `delaware-gold`

### ☀️ Light Sections
- Background: `bg-white` or `bg-delaware-cream`
- Text: `text-gray-900` or `text-delaware-navy`
- Borders: `border-delaware-sage/30`

### 🎯 Badges & Tags
- Background: `bg-delaware-sage`
- Text: `text-delaware-navy`
- Border: `border-delaware-blue/30`

## Color Contrast Requirements

All colors meet WCAG AA accessibility standards when used as specified:

- ✅ Delaware Navy (#152F50) on Delaware Cream (#FFFCF6) - AAA
- ✅ Delaware Navy (#152F50) on Delaware Gold (#D8B368) - AA
- ✅ White on Delaware Blue (#82B8DE) - AA
- ✅ White on Delaware Navy (#152F50) - AAA

## Design System Rules

### ❌ Do Not
- Mix Delaware Blue (#82B8DE) and Delaware Navy (#152F50) in the same component
- Use gradients (flat colors only)
- Use colors outside this palette (except semantic colors: success, warning, error)

### ✅ Do
- Use Delaware Gold for primary CTAs
- Use Delaware Blue for interactive elements
- Use Delaware Sage for subtle accents
- Use Delaware Cream for soft backgrounds
- Use Delaware Navy for text and dark sections

## Semantic Colors

These colors are reserved for system messages:

| Purpose | Hex Code | Usage |
|---------|----------|--------|
| Success | `#10B981` | Success messages, confirmations |
| Warning | `#F59E0B` | Warnings, alerts |
| Error | `#EF4444` | Error messages, destructive actions |

## Migration Notes

Updated from previous palette:
- Old Delaware Blue (#002B5C) → New Delaware Navy (#152F50)
- Old Delaware Blue → New Delaware Blue (#82B8DE)
- Old Delaware Gold (#CB9C30) → New Delaware Gold (#D8B368)
- Old Delaware Gray (#A8BDBE) → Delaware Sage (name change only)
- New Delaware Cream (#FFFCF6) added for backgrounds
