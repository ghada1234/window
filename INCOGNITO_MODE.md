# Incognito Mode Behavior

## Current Differences Between Regular and Incognito Windows

### Regular Window (localStorage available)
✅ Data persists across page refreshes
✅ Login state maintained
✅ All wellness data saved permanently
✅ Preferences remembered

### Incognito Window (memory storage only)
⚠️ Data only lasts for current session
⚠️ Page refresh = data loss
⚠️ Each new tab/window = fresh start
⚠️ Login state lost on refresh

## Why This Happens

Browsers restrict `localStorage` in incognito/private mode to protect privacy. Our app uses in-memory storage as a fallback, but memory is cleared when:
- Page is refreshed
- Tab is closed
- New tab/window is opened

## Solutions Implemented

1. **Safe Storage Wrapper** - Handles both modes gracefully
2. **Warning Banner** - Notifies users about incognito limitations
3. **Session Storage Option** - Could use `sessionStorage` instead (persists during tab session)

## To Make Incognito Work Better

We can:
1. Use `sessionStorage` instead of memory (persists during tab lifetime)
2. Add "Export Data" feature to save manually
3. Add demo data for incognito users
4. Use URL parameters to restore state

Would you like me to implement any of these?

