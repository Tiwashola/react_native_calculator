# React Native Calculator

A clean, iOS-style calculator built with React Native and Expo. Supports basic arithmetic operations with a polished dark UI.

## Features

- Addition, subtraction, multiplication, division
- Percentage and sign toggle (+/−)
- Decimal point support
- Live expression display
- Active operator highlight
- Error handling (e.g. division by zero)

## Prerequisites

- Node.js ≥ 18
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

## Getting Started

```bash
npx create-expo-app CalculatorApp
cd CalculatorApp
```

Replace `app/(tabs)/index.tsx` with the `App.jsx` file from this repo, then:

```bash
npx expo start
```

Scan the QR code with Expo Go to run on your phone.

> **Tip:** If you get an "internet connection offline" error on Expo Go, press `t` in the terminal to switch to tunnel mode, then rescan the QR code.

## Project Structure

```
CalculatorApp/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx      # Main calculator screen (App.jsx goes here)
│   └── _layout.tsx
├── assets/
├── app.json
├── package.json
└── README.md
```

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: React Native calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rn-calculator.git
git push -u origin main
```
