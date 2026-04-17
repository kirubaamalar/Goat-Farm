# Goat Farm Application

## 🚀 How to Run

**Simply double-click `app.exe`**

The application will:
1. Start automatically
2. Open your browser
3. Show the Goat Farm interface at `http://localhost:5000`

## ✅ What You See

- Browser opens automatically (if not, manually go to http://localhost:5000)
- Console window shows startup messages
- Application is ready to use!

## 📝 Troubleshooting

If the app doesn't start:

1. **Check console window** for error messages
2. **Check if port 5000 is available:**
   - Close other applications using port 5000
   - Or edit `config.py` and change `PORT = 5000` to another number (5001, 5002, etc.)
3. **Check antivirus** - may be blocking the application

## 📖 About This Application

- **Backend:** Flask (Python web framework)
- **Frontend:** React (built-in)
- **Database:** SQLite (created automatically)
- **Runs:** Fully offline, no internet required

## 📂 Folder Structure

```
app.exe              ← Click to run
goat_farm_debug.log  ← Debugging info (created on first run)
_internal/           ← Application files (don't modify)
```

## ❓ Questions?

All application files are bundled inside `app.exe`. No additional installation needed!

---

**Version:** 1.0  
**Built with:** PyInstaller (Python 3.13)  
**Date:** April 17, 2026
