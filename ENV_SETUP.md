# Environment Variable Setup & Verification

This guide helps you set up and verify your GEMINI_API_KEY is configured correctly.

---

## 🔑 Step 1: Get Your API Key

1. Go to: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key (starts with "AIza...")

⚠️ **Keep this key private!** Never commit it to git.

---

## 💻 Step 2: Set Up Local Environment Variable

### For Local Development

**Create a `.env` file in the project root:**

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file and replace the placeholder
# The file should contain:
GEMINI_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Or create it manually:**

1. In your project root, create a file named `.env`
2. Add this line (replace with your actual key):
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

✅ **The `.env` file is automatically gitignored** - it won't be committed.

---

## 🔍 Step 3: Verify Environment Variable is Set

### Method 1: Use the Verification Script

Run the built-in verification script:

```bash
npm run verify-env
```

**Expected output if correctly set:**
```
✅ Environment variable verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ GEMINI_API_KEY is set
✓ Value starts with: AIza...
✓ Length: 39 characters (correct format)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All checks passed!

Your environment is ready for development.
```

**Expected output if NOT set:**
```
❌ Environment variable verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ GEMINI_API_KEY is not set

Please create a .env file with:
GEMINI_API_KEY=your_api_key_here
```

### Method 2: Manual Verification

Check if the file exists and has content:

```bash
# Check if .env file exists
ls -la .env

# View the content (safe - only shows first few characters)
cat .env | head -1
```

Should show: `GEMINI_API_KEY=AIza...`

---

## 🧪 Step 4: Test the App with Your API Key

**Start the development server:**

```bash
npm run dev
```

**Open in browser:**
```
http://localhost:3000
```

**Test the AI features:**

1. **PDF Upload:** Try uploading a PDF in "Echelon Sales Architect"
2. **Image Editor:** Upload an image and try an edit
3. **Video Generator:** Enter a video prompt

**If the API key is working:**
- ✅ Features will process without errors
- ✅ No "API Key not found" messages in console

**If the API key is NOT working:**
- ❌ Console shows: "Error: API Key not found in environment"
- ❌ Features fail to process

---

## 🚀 Step 5: For Production (Netlify)

### Set Environment Variable in Netlify

1. Go to: https://app.netlify.com
2. Select your site
3. **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Set:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your actual API key
   - **Scopes:** All scopes (or just "Builds")
6. Click **Save**
7. **Trigger a redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Verify on Netlify

After deployment completes:

1. Open your Netlify URL
2. Test an AI feature (PDF upload, image edit, video generation)
3. If it works → ✅ Variable is set correctly!
4. If it fails → Check Netlify build logs for errors

---

## ❌ Troubleshooting

### Problem: "API Key not found in environment"

**Cause:** `.env` file doesn't exist or variable isn't set

**Fix:**
```bash
# Verify .env file exists
ls -la .env

# Create it if missing
cp .env.example .env

# Edit and add your key
nano .env  # or use your preferred editor
```

### Problem: "Invalid API key" or "Authentication failed"

**Cause:** API key is incorrect or doesn't have proper permissions

**Fix:**
1. Verify the key is copied correctly (no extra spaces)
2. Get a fresh key from https://aistudio.google.com/apikey
3. Make sure you copied the entire key (starts with "AIza")

### Problem: Works locally but not on Netlify

**Cause:** Environment variable not set in Netlify dashboard

**Fix:**
1. Netlify → Site configuration → Environment variables
2. Add `GEMINI_API_KEY` with your key
3. Redeploy the site

### Problem: Variable shows as "undefined" in build

**Cause:** Variable name mismatch

**Fix:**
- Ensure the variable name is **exactly**: `GEMINI_API_KEY`
- No typos, case-sensitive
- Check `vite.config.ts` for the correct variable name

---

## 📋 Checklist: Verify Everything is Set Correctly

Use this checklist to confirm your setup:

**Local Development:**
- [ ] `.env` file exists in project root
- [ ] `.env` contains: `GEMINI_API_KEY=AIza...`
- [ ] `.env` is listed in `.gitignore`
- [ ] `npm run verify-env` passes all checks
- [ ] `npm run dev` starts without errors
- [ ] Console shows no "API Key not found" errors
- [ ] AI features work in browser

**Production (Netlify):**
- [ ] Environment variable added in Netlify dashboard
- [ ] Variable name is exactly: `GEMINI_API_KEY`
- [ ] Redeploy triggered after adding variable
- [ ] Build completed successfully
- [ ] Site loads without errors
- [ ] AI features work on live site

---

## 🔒 Security Notes

✅ **Good Practices:**
- `.env` file is gitignored (never committed)
- Use different API keys for dev/production
- Set usage limits in Google Cloud Console
- Enable billing alerts

❌ **Never Do This:**
- Don't commit `.env` file to git
- Don't share API keys in screenshots/issues
- Don't hardcode keys in source code
- Don't use production keys in development

---

## 📞 Quick Reference

**Get API Key:** https://aistudio.google.com/apikey  
**Verify Setup:** `npm run verify-env`  
**Start Dev Server:** `npm run dev`  
**Netlify Dashboard:** https://app.netlify.com

**File Locations:**
- Local: `.env` (project root)
- Example: `.env.example` (safe to commit)
- Config: `vite.config.ts` (handles variable injection)

---

**Need more help?** See [SECURITY.md](SECURITY.md) for detailed security guidelines.
