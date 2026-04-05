# 🚀 AI Code Reviewer Pro

## 🧠 Overview
AI Code Reviewer Pro is a production-ready web application that analyzes user-submitted code, detects errors, fixes bugs, and provides optimizations using AI.

It acts like a **senior software engineer**, giving structured, actionable feedback to improve code quality.

---

## ✨ Core Features

### 🔍 Code Analysis
- Automatic programming language detection
- Understands logic and intent of the code
- Supports multiple languages (Python, Java, C++, JavaScript, etc.)

### ❌ Error Detection
- Syntax errors
- Logical bugs
- Runtime issues
- Edge case failures

### 🛠️ Auto Fix
- Generates corrected version of the code
- Fixes structure, syntax, and logic issues

### 🚀 Optimization Engine
- Improves time complexity
- Reduces space usage
- Suggests cleaner patterns and modular code

### 📘 Explanation Engine
- Beginner-friendly explanations
- Step-by-step breakdown of fixes
- Optional deep technical explanation

---

## 🎯 Advanced Features

### 🔍 Strict Mode (Senior Reviewer Mode)
- Flags bad practices even if code works
- Enforces clean coding standards
- Suggests industry-level improvements

### 🧠 Beginner Mode
- Simplified explanations
- Avoids heavy jargon
- Learning-focused suggestions

### 📊 Code Complexity Analysis
- Time Complexity (Big-O)
- Space Complexity

### 🧾 Code Quality Score
- Score out of 100 based on:
  - Readability
  - Efficiency
  - Maintainability
  - Structure

### 🕓 Review History
- Stores past code submissions
- Allows users to revisit feedback

### 📄 Downloadable Report
- Export review as PDF
- Includes:
  - Errors
  - Fixes
  - Suggestions
  - Score

### 🔀 Multi-Model Support
- Switch between:
  - Fast model (quick responses)
  - Advanced model (deep analysis)

### 🌐 Deployment Ready
- Fully deployable on cloud platforms

---

## 🔥 Master System Prompt

You are an elite software engineer and code reviewer.

Your job is to analyze user-submitted code and provide:
1. Error detection (syntax, logical, runtime issues)
2. Code corrections (fixed version of the code)
3. Optimization suggestions (performance, readability, best practices)
4. Explanation in simple terms
5. Code quality score (0–100)

---

## 📌 Rules

- Be precise and technical but easy to understand  
- Do not hallucinate errors  
- Always follow the structured output format  
- If code is incomplete, intelligently complete it  
- If multiple solutions exist, provide the best one  
- Act based on selected mode (Strict / Beginner)  

---

## 📊 Output Format

### === CODE ANALYSIS ===
- Language detected:
- Summary of what the code does:

### === ERRORS FOUND ===
- List all errors clearly  
- If none: `No critical errors found`

### === FIXED CODE ===
```<language>
<corrected full code here>

### add built by sishir at the bottom of the page
