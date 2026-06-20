# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-06-19

### Added

- Added platform operator control plane UI with workspace detail, logs, and billing management screens.
- Added workspace usage tab, billing summary, and Chargebee-backed invoice detail with PDF download.
- Added workspace access frozen and removed eligibility screens with auth and onboarding integration.
- Added product workbook unsaved-change guard with navigation prompts and label tag status indicators.
- Added user removal controls and inactive member list management in workspace settings.
- Added Product Overview documentation page and consolidated seven-tab product guides.
- Added shared billing types, hooks, and utilities for workspace and platform-admin billing flows.

### Updated

- Updated platform admin dashboard layout, workspace detail, usage events, and billing tooling.
- Updated marketing pricing calculator for Chargebee usage pricing and yearly usage estimates.
- Updated redline styling with shared dark mode support across product views and workbook cells.
- Updated label tags editor with CORS image loading, keyboard shortcuts, and source-file link warnings.
- Updated documentation videos to use next-video player and refreshed compare-versions clip.
- Updated monorepo package versions to `0.5.0`.

### Fixed

- Fixed dashboard department and project card overflow on smaller viewports.
- Fixed product table row expansion to occur only when a component image exists.
- Fixed platform admin billing UI states for empty accounts, past due mirroring, and usage form staleness.
- Fixed TypeScript and Amplify build errors across platform admin and product workbook flows.

## [0.4.0] - 2026-05-28

### Added

- Added in-app documentation with Fumadocs, including embedded walkthrough videos in docs pages.
- Added Sentry error monitoring with user context sync across the application.
- Added sidebar user feedback entry via Sentry User Feedback.

### Updated

- Updated docs layout with a wider content area, sidebar feedback entry, and theme switch.
- Updated documentation videos to use a native video element in `DocsVideo` (replacing the media-chrome player).
- Updated monorepo package versions to `0.4.0`.

### Fixed

- Fixed docs search authentication and documentation video type handling from review feedback.
- Fixed Sentry integration issues from PR review feedback.
- Fixed Amplify production build issues related to documentation video rendering.

## [0.3.1] - 2026-05-24

### Fixed

- Fixed the production app build by using `product_description` when duplicating products.

## [0.3.0] - 2026-05-23

### Added

- Added URL-driven workspace list query parameters with shared list controls for departments, projects, and archives.
- Added server-backed pagination and filtering for workspace lists and archive views.
- Added infinite-scroll department and project pickers with a shared add-users dropdown pattern.
- Added server-backed workspace users list query wiring with an infinite user picker.

### Updated

- Updated product management flows and general UX polish across the application.
- Updated error handling and user-facing error messaging across the UI.
- Updated product audit metadata handling based on review feedback.
- Updated calendar dependencies to `react-day-picker` v10 with aligned `date-fns` versions.
- Updated monorepo package versions to `0.3.0`.

### Fixed

- Fixed archive page tab management and URL query parameter handling.
- Fixed premature project validation and duplicate search parameter handling.
- Fixed workspace table empty states when server-side filters return no rows.
- Fixed workspace list sort allowlists and removed unused legacy table filter code.
- Fixed archive department, project, and product sorting, pagination reset when `totalPages` is zero, and archive tab completion sync with error toasts.
- Fixed list loading skeletons and table column widths on department and project detail pages.
- Fixed redundant workspace list URL setter effect runs.
- Fixed Amplify build issues from conflicting user map annotations and aligned product updates to send `product_name` with `product_description`.

## [0.2.0] - 2026-05-04

### Added

- Added Product Information fields for device class and Basic UDI-DI, including supporting report configuration.
- Added standard symbol library selection with restricted external symbol image hosts.
- Added improved workspace onboarding with admin name capture and workspace ID copy support.
- Added a pricing calculator experience with shared sliding number UI support.
- Added product-aware upload structuring for workspace assets.
- Added refreshed black and white Uprevit brand assets across the product and marketing apps.

### Updated

- Updated product redline workflows across Product Information, Compliance Information, Product Specifications, Symbols & Graphics, and Label Tags.
- Updated label tag image diff handling to support base and next image comparison for modified states.
- Updated symbols, schematics, barcodes, and other component tables and dialogs for more consistent add, edit, and redline behavior.
- Updated reports UI with improved layout handling and blank-result empty states.
- Updated dashboard, sidebar, settings, archive, department, project, and product UI details for cleaner workspace interactions.
- Updated marketing pricing copy, demo presentation, favicon assets, and header/footer branding.
- Updated monorepo package versions and lockfile metadata to `0.2.0`.
- Updated app configuration to use the unified S3 hostname setup.

### Fixed

- Fixed redline image previews so base images are preserved and image diff badges render correctly.
- Fixed redundant label tag redlines when only key-only image data changed.
- Fixed modified label presence diffs in Symbols & Graphics tables.
- Fixed product specification submit behavior so save state resets correctly.
- Fixed fixed-row-height and truncation behavior in redline-heavy product tables.
- Fixed Product Information redline layout and dialog positioning issues.
- Fixed language and status badge layout issues in product redline views.
- Fixed logo file extension usage in the sidebar, onboarding shell, and marketing header.
- Fixed blank report result handling so users see an empty state instead of a broken or unclear page.
- Fixed minor UI consistency issues in skeleton states, toast behavior, dialogs, sliders, and alert dialogs.

### Removed

- Removed legacy single `logo.svg` assets after replacing them with dedicated black and white brand assets.
- Removed obsolete favicon asset usage from the marketing app in favor of the refreshed favicon set.

## [0.1.0] - 2026-04-03

### Added

- Initial production release of Uprevit.
- AWS Cognito authentication and onboarding flows.
- Workspace, department, project, and product management.
- Product documentation workflows including versioning, redlines, reports, exports, source files, and audit logs.
- Separate product app and marketing app structure in the monorepo.
- Bun/Turbo monorepo structure.
- Added Amplify monorepo deployment configuration.

## [0.1.1] - 2026-04-14

### HOTFIX

- update pricing strategy and add placeholder for now
- remove the feature section on pricing page
