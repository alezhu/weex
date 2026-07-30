# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added camelCase property getters for week dates (`firstDay`, `lastDay`, `startDate`, `endDate`).
- Added week comparison and containment methods (`equals`, `isBefore`, `isAfter`, `containsDate`).
- Added date range formatting and day list generation (`toDateRange`, `toDayList`, `formatDateRange`).
- Added static helper methods: `Week.current()`, `Week.now()`, `Week.getWeeksInYear()`.
- Added unit tests covering new API methods and achieving 100% code coverage.

### Fixed
- Fixed JSDoc comments to correctly state Monday as the start of the week.
- Fixed `Week.from()` and `Week.getWeekStartDate()` to support existing `Week` instances.
- Improved string parsing in `Week.from()` for `W`-prefixed week strings (e.g., `2026-W05`, `2026W05`).

### Changed
- Reordered class methods by visibility and alphabetical order.
- Optimized ESM export structure and removed legacy wrapper scripts.
- Cleaned up obsolete Jest configuration files.

## [1.0.6] - 2026-05-17

### Added
- JSDoc comments for `Week` class methods.
- Support for Node.js 22 and 24 in test matrix.

### Fixed
- Fixed CommonJS package build output.
- Corrected error messages for week number validation.

### Changed
- Refactored `Week` class to improve type safety and parsing logic.
- Switched package manager to `pnpm`.
- Switched test runner from Jest to Vitest.
- Updated `tsconfig.json` build configuration.

## [1.0.5] - 2023-09-26

### Changed
- Removed dependency on Node native `assert` module.

### Documentation
- Added status and build badges to README.

## [1.0.4] - 2023-09-25

### Added
- Support for passing integer values as week numbers to `.from()`, `.prev()`, and `.next()` methods.

### Documentation
- Updated README documentation with clearer usage instructions.

## [1.0.3] - 2023-09-25

### Changed
- Updated build process to create both CommonJS and ESModule compatible packages.
- Reorganized test files into a separate directory.

## [1.0.2] - 2023-09-24

### Changed
- Renamed package to `@alezhu/weex`.
- Added pre-publish build scripts.
- Added CommonJS compilation support.

## [1.0.1] - 2023-09-24

### Added
- Initial release of `@alezhu/weex`.
- Core `Week` class implementation for ISO week calculations.
- TypeScript configuration and initial test setup.
