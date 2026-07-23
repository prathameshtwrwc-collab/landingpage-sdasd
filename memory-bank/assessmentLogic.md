# Assessment Logic

# Assessment Logic

## Overview

The Sleep Chronotype Assessment is the core engine of the platform.

Its purpose is to determine an individual's natural chronotype and generate personalized insights, recommendations, and reports.

The assessment must remain configurable and version-controlled.

---

# Assessment Objective

Determine:

- Lark (Morning Type)
- Eagle (Intermediate Type)
- Owl (Evening Type)

Based on:

- Sleep preferences
- Wake preferences
- Energy patterns
- Daily habits
- Biological rhythm indicators

---

# Assessment Structure

Assessment
↓
Questions
↓
Answers
↓
Scoring Engine
↓
Chronotype Calculation
↓
Result Generation
↓
Recommendations
↓
Report Generation

---

# Assessment Versions

The system must support multiple versions.

Examples:

Version 1

Version 2

Version 3

Historical assessments must remain linked to the version used at the time.

Question changes must never break historical reporting.

---

# Question Types

Supported question types:

Single Choice

Multiple Choice

Multi Select

Descriptive

Future support:

Scale Based

Image Based

Conditional Questions

---

# Assessment Flow

Step 1

Member enters personal details.

Required:

- First Name
- Last Name
- Age
- Country
- City
- Pincode
- Occupation
- Email
- Phone

---

Step 2

Member begins assessment.

No login required.

---

Step 3

Member answers all questions.

---

Step 4

Answers are stored.

---

Step 5

Scoring engine calculates totals.

---

Step 6

Chronotype determined.

Possible outcomes:

- Lark
- Eagle
- Owl

---

Step 7

Result explanation displayed.

---

Step 8

Recommendations assigned.

---

Step 9

PDF report generated.

---

Step 10

Assessment stored permanently.

---

# Scoring Engine

Every answer has a score.

The scoring logic must be configurable.

Scores should not be hardcoded into application code.

Scoring values should be stored in the database.

---

# Chronotype Calculation

The system calculates:

Lark Score

Eagle Score

Owl Score

The highest valid score determines the chronotype.

Example:

Lark = 42

Eagle = 28

Owl = 18

Result:

Lark

---

# Chronotype Outcomes

Supported outcomes:

## Lark

Morning Type

Characteristics:

- Early wake preference
- Morning productivity
- Earlier sleep preference

---

## Eagle

Intermediate Type

Characteristics:

- Balanced rhythm
- Adaptable schedule
- Consistent energy

---

## Owl

Evening Type

Characteristics:

- Later sleep preference
- Evening productivity
- Late peak energy

---

# Result Generation

Assessment completion automatically triggers:

Chronotype Calculation

↓

Result Creation

↓

Recommendation Assignment

↓

Report Generation

---

# Result Screen

The result screen should display:

Chronotype

Explanation

Strengths

Challenges

Benefits

Optimization Suggestions

---

# Recommendations

Recommendations are based on:

Chronotype

Examples:

Sleep Timing

Exercise Timing

Nutrition Timing

Work Timing

Light Exposure

Energy Management

Recovery Strategies

---

# Report Generation

Every completed assessment should generate:

PDF Report

The report should contain:

Personal Details

Assessment Summary

Chronotype

Interpretation

Recommendations

Generated Date

---

# Report Actions

Member should be able to:

Download

Print

Share

Save

Access Later

---

# Completion Tracking

Assessment status values:

STARTED

COMPLETED

ABANDONED

Only COMPLETED assessments generate results.

---

# Historical Assessments

Members may complete multiple assessments over time.

Historical assessments must remain available.

Future comparisons should be supported.

---

# Future Enhancements

Additional Assessments

Sleep Disorder Screening

Energy Assessments

Lifestyle Assessments

Corporate Wellness Assessments

Behavioral Assessments

AI Recommendations

Advanced Personalization

---

# Core Principle

The assessment is not merely a questionnaire.

It is the entry point into:

Sleep Wellness

Chronotype Intelligence

Personal Optimization

Corporate Wellness

Research Analytics

The assessment experience should be simple, educational, and actionable.
