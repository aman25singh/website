---
title: "Math Drill"
description: "A timed mental-arithmetic trainer that analyzes which digits and number patterns affect response time and accuracy."
status: "active"
date: "2026-09-13"
updated: "2026-09-13"
tags:
  - Python
  - Tkinter
  - pandas
  - data-visualization
  - mental-math
  - plotting-and-charting
published: true
featured: false
slug: "math-drill"
repo: "https://github.com/aman25singh/math-drill"
---

## What it is

Math Drill is a desktop application for timed mental-arithmetic practice. It presents addition, subtraction, multiplication, and exact-division questions, records each submitted answer with its operands and response time, and turns the resulting session log into performance analysis.

The distinguishing output is more specific than a score or an operation-level average. The analysis can compare questions containing particular digits, additions that require a carry, subtractions that require a borrow, operand sizes, and other derived patterns.

## The goal

The project addresses a practical weakness in conventional drill tools: a total score does not explain what is making a person slow or inaccurate. Math Drill preserves the numeric operands behind each rendered question so it can identify patterns such as a digit appearing in an operand or a larger operand affecting response time.

It is intended for people practicing mental arithmetic under time pressure, especially preparation for quantitative finance, analytics, and technical assessments. The longer-term direction described by the project is a web version that can use these measurements to provide progress tracking and adaptive practice focused on supported weak spots.

## Tech stack

- **Python 3.10+** provides the application and analysis runtime.
- **Tkinter** supplies the configuration and timed-drill desktop interface. It is part of CPython rather than a pip dependency; Linux installations may need the `python3-tk` system package.
- **pandas** converts session records into tabular data and computes feature flags, comparisons, and session metrics.
- **Matplotlib and seaborn** render the eight-panel analysis figure, including the digit-difficulty heatmap, operation timing, response-time trend, and feature comparisons.
- **JSON and the Python standard library** provide local append-only session storage, validation, atomic writes, timing, and question generation.
- **pytest and Ruff** support the GUI-free unit and regression tests and code-quality checks. GitHub Actions runs the test matrix, installation checks, and dependency audits.

The project has no network service, account system, database, or hosted application in the current repository.

## How it works

The configuration screen in `mathdrill/app.py` collects enabled operations, operand ranges, session duration, the session name, and whether negative subtraction answers are allowed. `DrillConfig` validates those choices before a session starts.

`mathdrill/core.py` generates a question through the selected operation. Addition and subtraction use the addition ranges, multiplication uses the multiplication ranges, and operands may be swapped for variety. Division constructs the dividend from a positive divisor and quotient, so every division answer is exact. `DrillSession` starts a monotonic per-question clock, parses the submitted entry, scores it, and builds a record containing the rendered question, operation, operands, correct answer, user answer, Unix timestamp, response duration, and correctness.

`mathdrill/game_frame.py` owns the Tkinter widgets and the session countdown. It uses one monotonic deadline for both the visible timer and answer acceptance, consumes each question once, ignores blank submissions, disables input when time expires, cancels pending callbacks, and saves the completed session once.

`mathdrill/storage.py` resolves the data location from `MATHDRILL_DATA_DIR`, the source checkout, or a per-user directory. It validates the JSON shape, accepts legacy records that use `question_type`, creates missing directories, and writes through a temporary file before replacing the session log.

`mathdrill/insights.py` loads all sessions or filters them by session name, flattens the answer records with `mathdrill/features.py`, derives the pattern flags, and renders the analysis figure. Boolean features compare true and false groups; numeric features are binned and compared with a baseline. The insights CLI can open the figure or save it as a PNG.

## Design and implementation

The core design keeps question generation, scoring, timing rules, feature extraction, storage, and rendering separate. `core.py`, `features.py`, and `storage.py` do not depend on Tkinter or Matplotlib, which makes the important behavior testable without opening a window and leaves a clear foundation for the planned web port.

The answer schema is the compatibility boundary between the desktop app, analysis tools, and future frontends. Operands are stored separately from the display string because digit-level analysis cannot be recovered reliably from presentation text alone. New records use `operation`; readers normalize older redundant `question_type` fields.

Timing uses a monotonic clock for elapsed response duration so wall-clock changes cannot distort measurements, while stored timestamps remain Unix seconds for ordering sessions over time. Session speed uses each session's configured duration and averages individual session rates, avoiding misleading gaps between sessions played days apart.

The analytics deliberately suppress comparisons whose groups are too small. The feature-comparison chart reports sample and baseline counts, and panels show an explanatory empty state when there is not enough data. A reproducible script generates a clearly labelled synthetic overview for documentation without using a user's practice history.

## Current status

The desktop application is working and was manually played through successfully. The current codebase includes configuration validation, working-directory-independent storage and analysis launch, the eight-panel analytics view, local JSON persistence, and a 97-test regression suite covering question generation, feature extraction, storage, timer callbacks, and headless chart rendering. The latest desktop implementation is commit `d914e57`, pushed to the public repository.

The project is still an active desktop application rather than a finished training platform. Analytics become meaningful only after several sessions, and the historical chart dataset is not part of the repository; local session logs are intentionally gitignored. The planned next stage is a browser implementation that preserves the session contract, adds localStorage persistence and desktop-log import, ports the digit and timing analytics, and later adds cross-session progress and explainable adaptive question weighting. No frontend framework, live URL, backend, or deployment is present yet.
