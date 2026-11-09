# Simplify FurTrace for Non-Tech Users & Streamline Core Objective

Make FurTrace ultra-simple, welcoming, and frictionless for everyday users (especially non-tech users or users stressed about a lost pet) by stripping away heavy technical overlays, enterprise blueprints, complex comparison modals, and administrative clutter while keeping the core mission crystal clear: **Reuniting lost pets with their owners**.

## User Review Required

> [!IMPORTANT]
> **Removals & Simplifications**:
> - Completely remove the developer `ArchitectureBlueprint` component and its navigation links.
> - Remove complex administrative `ModerationPanelModal` and `FlagReportModal` from normal user navigation.
> - Simplify `MatchComparisonModal` into a clean, friendly, single-tap visual comparison card.
> - Streamline landing page clutter (`CaseStudiesSection`, excessive reviews/FAQs) to focus immediately on the two main actions: **"I Lost My Pet"** and **"I Found a Pet"**.

## Proposed Changes

### Core UI & Navigation Component Cleanup

#### [MODIFY] [Navbar.tsx](file:///C:/Users/Dell/Documents/BSIT/Applications/src/components/Navbar.tsx)
- Remove links to developer architecture blueprints or advanced technical panels.
- Simplify header items to focus purely on Home, Browse Lost Pets, Report Lost, and Report Sighting.

#### [MODIFY] [LandingHero.tsx](file:///C:/Users/Dell/Documents/BSIT/Applications/src/components/LandingHero.tsx)
- Make the primary CTA buttons ("I Lost My Pet" and "I Found / Saw a Pet") larger, warmer, and immediately prominent.
- Remove overwhelming text and streamline messaging for stressed pet owners.

#### [MODIFY] [MatchComparisonModal.tsx](file:///C:/Users/Dell/Documents/BSIT/Applications/src/components/MatchComparisonModal.tsx)
- Replace complex side-by-side metric sliders and technical match diagnostics with an intuitive, friendly visual comparison card ("Could this be your pet?") with simple "Yes, Contact Finder" and "Not My Pet" buttons.

#### [MODIFY] [App.tsx](file:///C:/Users/Dell/Documents/BSIT/Applications/src/App.tsx)
- Remove `ArchitectureBlueprint`, heavy case study sections, and extraneous clutter from the main render tree, leaving a clean, laser-focused layout.

## Verification Plan

### Automated Tests
- Run `npm run build` and `npm run lint` to ensure zero compilation or TypeScript errors.

### Manual Verification
- Review the simplified landing page and ensure the primary actions ("I Lost My Pet" / "I Found a Pet") are prominent and frictionless.
