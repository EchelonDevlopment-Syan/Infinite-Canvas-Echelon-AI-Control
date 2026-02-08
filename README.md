<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Echelon AI Control - Infinite Canvas

**Your app is working!** See it in action below:

![App Working](https://github.com/user-attachments/assets/6357f82a-f666-48de-a785-b090fd2f0fe6)

---

## 🚀 QUICK START - Get Live in 5 Minutes

**Want to deploy for live testing right now?**

1. **Quick Deploy:** See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) ✅
2. **Detailed Guide:** See [QUICKSTART.md](QUICKSTART.md) 📖

**#1 Issue:** Missing API key in Netlify → [Fix it here](DEPLOYMENT_CHECKLIST.md#-1-reason-it-doesnt-load-missing-api-key)

---

View your app in AI Studio: https://ai.studio/apps/drive/1L72Rsuoj9idSR-ALBZj8Nkuis4aISZZp

## 🔐 Security First

**IMPORTANT**: Review [SECURITY.md](SECURITY.md) for critical information about API key management and security best practices.

## Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory (this file is gitignored):
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/apikey
   
   ⚠️ **Security Note**: Configure API key restrictions in [Google Cloud Console](https://console.cloud.google.com/):
   - Restrict to HTTP referrers (localhost:3000 for dev)
   - Limit to Generative Language API only
   - Set usage quotas

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000 in your browser

4. **Build for production:**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

## Deploy to Netlify

1. **Push code to GitHub**

2. **Connect to Netlify:**
   - Import your repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set environment variables in Netlify:**
   - Go to: Site configuration → Environment variables
   - Add: `GEMINI_API_KEY` with your API key value
   - Scope: All scopes or Builds only

4. **Configure API key restrictions** in Google Cloud Console:
   - Add your Netlify domain: `*.netlify.app/*`
   - Add your custom domain if applicable

5. **Deploy!**

See [SECURITY.md](SECURITY.md) for detailed security configuration.

## 📁 Project Structure

```
├── components/          # React components
├── services/           # API service layer (Gemini AI)
├── constants.ts        # App constants
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main App component
├── index.tsx          # Application entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
└── netlify.toml       # Netlify deployment config
```

## 🛡️ Security

- ✅ No secrets committed to repository
- ✅ Environment variables properly gitignored
- ✅ Example configuration provided
- ⚠️ Client-side app - API key visible in browser (use Google Cloud restrictions)

Read [SECURITY.md](SECURITY.md) for comprehensive security guidelines.

## 📝 License

© 2025 Echelon Development & Contract Consulting. All Rights Reserved.
