# Excalibur's Scouting System

## Overview

Excalibur's Scouting System is a web application designed to facilitate scouting activities. It includes features for user management, match assignments, and various scouting forms.

## Features

- User Authentication
- User Management (Admin)
- Match Assignments (Admin)
- Scouting Forms (Super Scouting, Pit Scouting)
- Profile Management
- Actions and My Matches

## Technologies Used

- JavaScript
- React
- npm
- react-router-dom

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/YehudaRothstein/excalibur-scouting-system.git
    cd excalibur-scouting-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

## Project Structure

```plaintext
src/
├── App.js
├── Pages/
│   ├── Actions/
│   ├── Home/
│   ├── Login/
│   ├── ManageUsers/
│   ├── MatchAssign/
│   ├── MyMatches/
│   ├── Nav/
│   ├── Profile/
│   ├── Scouting/
│   │   ├── Pit/
│   │   └── Super/
├── context/
├── AdminRoute.js
├── ProtectedRoute.js
