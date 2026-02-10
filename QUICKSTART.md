# 🚀 QUICK START - Get Your App Live in 5 Minutes

**For:** AI Studio → GitHub → Netlify Workflow  
**Goal:** Get your app live for testing with your team

---

## ⚡ The Fastest Path to Live Testing

### Step 1: Set Your API Key in Netlify (ONE TIME SETUP)

**This is the #1 reason apps don't load!**

1. Go to your Netlify site: https://app.netlify.com
2. Click on your site
3. Go to **Site configuration** (in left menu)
4. Click **Environment variables**
5. Click **Add a variable**
6. Enter:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your actual Gemini API key from https://aistudio.google.com/apikey
   - **Scopes:** Select "All scopes"
7. Click **Save**

✅ **You only need to do this ONCE per site**

---

### Step 2: Deploy to Netlify

You have **two options**:

#### Option A: Push from AI Studio (Your Normal Workflow)

1. In AI Studio, click **Save to GitHub** 
2. Push your changes
3. Netlify will **automatically deploy** (if connected)
4. Wait 2-3 minutes for build to complete
5. Check your Netlify URL

#### Option B: Manual Netlify Deploy (If Auto-Deploy Isn't Set Up)

1. Push your code to GitHub (from AI Studio or locally)
2. Go to Netlify: https://app.netlify.com
3. Click **Add new site** → **Import an existing project**
4. Choose **GitHub** and authorize
5. Select your repository: `Infinite-Canvas-Echelon-AI-Control`
6. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build` ✅
   - Publish directory: `dist` ✅
7. Click **Deploy site**
8. Wait 2-3 minutes

---

## 🔧 Troubleshooting: "App Doesn't Load"

### Problem 1: Blank Page on Netlify

**Cause:** Missing API key  
**Fix:**
1. Check Netlify → Site configuration → Environment variables
2. Make sure `GEMINI_API_KEY` is set
3. **Trigger a redeploy:** Deploys → Trigger deploy → Deploy site

### Problem 2: "Failed to Load" Errors

**Cause:** Old build cache  
**Fix:**
1. Netlify → Deploys → Trigger deploy
2. Choose **Clear cache and deploy site**

### Problem 3: Build Failed

**Cause:** Missing dependencies or old Node version  
**Fix:**
1. Check build logs in Netlify
2. Verify `netlify.toml` has `NODE_VERSION = "18"` ✅
3. Redeploy

### Problem 4: Works Locally But Not on Netlify

**Cause:** API key not set in Netlify environment  
**Fix:**
1. Go to Netlify → Site configuration → Environment variables
2. Add `GEMINI_API_KEY` (see Step 1)
3. Redeploy

---

## ✅ Verify It's Working

After deployment:

1. **Open your Netlify URL** (e.g., `https://your-site.netlify.app`)
2. You should see:
   - ✅ "Echelon AI Control" header
   - ✅ Hero section with founder info
   - ✅ Slide presentation section
   - ✅ AI Control Studio tools

3. **Test AI Features** (requires API key):
   - Upload a PDF in "Echelon Sales Architect"
   - Try generating a video prompt
   - Test image editing

If you see these, **you're live!** 🎉

---

## 📱 Share with Your Team

Your app is now live at your Netlify URL (e.g., `https://your-site.netlify.app`)

**Anyone can access it** - just share the URL!

**Custom Domain** (optional):
1. Netlify → Domain management → Add custom domain
2. Follow DNS setup instructions

---

## 🔄 Your Ongoing Workflow

Once set up, your workflow is:

```
AI Studio → Save to GitHub → Netlify auto-deploys → Live ✅
```

**Every time you push from AI Studio:**
1. Changes go to GitHub
2. Netlify detects the push
3. Netlify builds automatically
4. New version is live in 2-3 minutes

No manual steps needed! 🚀

---

## 🆘 Still Not Working?

### Check These in Order:

1. **Netlify Build Logs**
   - Go to: Netlify → Deploys → Click latest deploy
   - Look for errors in build logs
   - Common error: "Build failed" = Missing API key or dependencies

2. **Browser Console**
   - Open your site
   - Press F12 → Console tab
   - Look for red errors
   - Common error: "API Key not found" = Set GEMINI_API_KEY in Netlify

3. **Verify Files Are Deployed**
   - Netlify → Deploys → Published deploy
   - Check if `index.html` and `assets/` folder exist

### Common Fixes:

```bash
# If build fails, check package.json has correct scripts
✓ "build": "vite build"
✓ "preview": "vite preview"

# If API doesn't work, check environment variable name
✓ Must be exactly: GEMINI_API_KEY
✓ Not: API_KEY or gemini_api_key
```

---

## 📞 Need More Help?

**Netlify Build Logs:** Show exact error messages  
**Browser Console:** Shows JavaScript errors  
**Network Tab:** Shows failed API calls

**Check These Files Are Present:**
- ✅ `netlify.toml` (deployment config)
- ✅ `index.html` (has script tag on line 39)
- ✅ `package.json` (has build script)

---

## 🎯 TL;DR - Absolute Minimum Steps

For someone who just wants it LIVE right now:

1. **Set API key in Netlify** (Environment variables → `GEMINI_API_KEY`)
2. **Push code to GitHub** (from AI Studio or terminal)
3. **Connect Netlify to GitHub repo** (one-time)
4. **Wait 2-3 minutes**
5. **Open your Netlify URL**

Done! 🎉

---

**Your app is now live and ready for team testing!**

If you're still having issues after following these steps, check the build logs in Netlify - they'll tell you exactly what's wrong.
