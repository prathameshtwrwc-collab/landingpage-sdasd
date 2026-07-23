# Tech Context
# Technical Context

## Overview

The platform is being developed as a modern web application focused on scalability, maintainability, security, and future expansion.

Technology decisions documented here are considered project standards.

Future development should align with these decisions unless explicitly approved.

---

# Frontend

Framework:

Next.js

Architecture:

App Router

Language:

TypeScript

---

# UI Framework

TailwindCSS

Used for:

* Layouts
* Components
* Responsive Design
* Design System

---

# Component Library

shadcn/ui

Used for:

* UI Components
* Accessibility
* Consistent Design Patterns

---

# Animations

Framer Motion

Used for:

* Page Transitions
* Scroll Effects
* Micro Interactions
* Dashboard Animations

---

# Authentication

Provider:

Clerk

Responsibilities:

* Signup
* Login
* Logout
* Email Verification
* Password Reset
* Session Management
* Role-Based Authentication

The platform must never implement a custom authentication system.

---

# Roles

Supported Roles:

superadmin

admin

member

Future roles should remain supported.

---

# Session Management

Handled entirely by Clerk.

No custom session implementation.

No express-session.

No custom JWT system.

Clerk remains the source of truth.

---

# Database

Provider:

Supabase PostgreSQL

Responsibilities:

* Organizations
* Members
* Assessments
* Reports
* Recommendations
* Analytics

---

# Storage

Provider:

Supabase Storage

Used For:

* PDF Reports
* Generated Documents
* Future Assets

---

# Backend

Primary Backend:

Next.js Server Actions

Future support:

API Routes

Background Jobs

Scheduled Tasks

---

# Database Access

Preferred Approach:

Server-side database operations.

Avoid exposing sensitive operations to the client.

Business logic should remain server-side.

---

# Route Structure

Next.js App Router

Route Groups:

(superadmin)

(admin)

(member)

(public)

---

# Super Admin Routes

/superadmin/*

---

# Admin Routes

/ admin/*

---

# Member Routes

/ member/*

---

# Public Routes

/

/assessment

/about

/contact

/privacy

/terms

---

# Folder Structure

Recommended Structure

app/

components/

lib/

hooks/

types/

actions/

services/

memory-bank/

public/

---

# Components

Reusable components should be centralized.

Avoid duplicate implementations.

Shared components belong in:

components/

Role-specific components may be grouped separately.

---

# State Management

Current Preference:

React State

Server Components

Server Actions

Future Consideration:

Zustand

Only if required.

Avoid unnecessary complexity.

---

# Forms

Preferred:

React Hook Form

Validation:

Zod

---

# Data Validation

All inputs should be validated.

Validation should occur:

Client Side

Server Side

Database Level

---

# Security

Authentication:
Clerk

Authorization:
Role Based Access Control

Database:
Row Level Security

Principle:
Least Privilege

---

# Logging

Important events should be logged.

Examples:

Assessment Completion

Report Generation

Organization Creation

Admin Creation

Member Registration

Login Events

Referral Events

---

# Analytics

Analytics should be generated from database records.

Avoid storing duplicate metrics.

Derived metrics should be calculated from source data.

---

# Deployment

Frontend:

Vercel

Database:

Supabase

Authentication:

Clerk

Storage:

Supabase Storage

---

# Migration Status

Current Migration:

React + Vite
↓
Next.js App Router

Requirements:

Zero UI Loss

Zero Design Changes

Preserve Existing Dashboards

Preserve Existing Charts

Preserve Existing Components

Preserve Existing Layouts

---

# Design Preservation Rule

The current UI has already been approved.

Do Not:

* Redesign
* Simplify
* Replace layouts
* Remove charts
* Remove dashboard sections

Functionality should be added while preserving the existing visual system.

---

# Future Expansion

The architecture should support:

Mobile Applications

AI Recommendations

Doctor Portals

Counsellor Portals

Research Portals

Branch-Level Analytics

Multi-Language Support

Corporate Wellness Programs

without major architectural redesign.
