# Goat Farm Desktop Build

## What this does

This project can be packaged as a local Windows desktop-style application:

- `Flask` serves both the API and the built React frontend.
- The React build is copied into `static/frontend/`.
- `PyInstaller` packages the Flask app into `dist/app.exe`.
- When the user runs `app.exe`, the local server starts and opens the browser automatically.

## Build steps

1. Build the React frontend:

```powershell
cd frontend
npm run build
```

2. Copy the build output into Flask static assets:

```powershell
cd ..
if (Test-Path static\frontend) { Remove-Item -Recurse -Force static\frontend }
New-Item -ItemType Directory -Path static\frontend | Out-Null
Copy-Item -Recurse -Force frontend\dist\* static\frontend\
```

3. Package the app:

```powershell
python -m PyInstaller --onefile --add-data "static;static" app.py
```

## Output

- Executable: `dist/app.exe`
- Embedded frontend source for Flask packaging: `static/frontend/`

## End-user usage

1. Double-click `dist/app.exe`
2. The app starts on `http://localhost:5000`
3. The default browser opens automatically
4. The user interacts with the app normally

## Notes

- The app is configured for Windows packaging.
- Flask serves `index.html` for React routes and `assets/*` for built frontend files.
- The packaged app uses `_MEIPASS` when running from PyInstaller so static files resolve correctly inside the executable.
- The app runs with `debug=False`.
- **✨ NEW:** SQLite database (`goatfarm.db`) is created automatically - no external database installation required!
- The database file is stored alongside the EXE and persists between runs.

