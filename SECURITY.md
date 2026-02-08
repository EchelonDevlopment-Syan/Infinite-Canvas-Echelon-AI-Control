# Security Guidelines

## 🔐 Environment Variables & Secrets Management

### Current Setup

This application uses the **Google Gemini API** which requires an API key. The key is managed through environment variables.

### ✅ What's Protected

1. **No secrets in git repository**
   - `.env` files are gitignored
   - Only `.env.example` with placeholder values is committed
   - Git history has been verified clean

2. **Environment variable configuration**
   - Development: Store in `.env` file (local only)
   - Production (Netlify): Store in Netlify dashboard

### ⚠️ Known Security Limitations

**IMPORTANT: This is a client-side application, which has inherent security limitations:**

1. **API Key Visible in Client Code**
   - The Gemini API key is embedded in the JavaScript bundle during build
   - Users can view the API key in browser DevTools
   - This is a limitation of client-side applications

2. **API Key in Network Requests**
   - API keys appear in fetch requests (line 325 of geminiService.ts)
   - These are visible in browser Network tab

### 🛡️ Security Best Practices for This Architecture

Given this is a **client-side SPA**, here are the recommended security measures:

#### For Development (Local)

1. **Create a `.env` file** (never commit this!):
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Verify .env is gitignored**:
   ```bash
   git status  # Should NOT show .env file
   ```

3. **Use API key restrictions** in Google Cloud Console:
   - Restrict by HTTP referrer (your domain)
   - Set usage quotas
   - Enable alerts for unusual activity

#### For Production (Netlify)

1. **Set environment variable in Netlify**:
   - Navigate to: Site configuration → Environment variables
   - Add: `GEMINI_API_KEY` with your API key
   - Scope: All scopes or Builds only

2. **Configure API Key Restrictions** in Google Cloud Console:
   - Add your Netlify domain to allowed referrers
   - Example: `*.netlify.app/*`, `yourdomain.com/*`
   - Set daily quota limits
   - Enable billing alerts

### 🔒 Google Cloud API Key Security

Configure these restrictions in [Google Cloud Console](https://console.cloud.google.com/):

1. **Application Restrictions**
   - Type: HTTP referrers (web sites)
   - Website restrictions:
     - `http://localhost:3000/*` (development)
     - `https://your-site.netlify.app/*` (production)
     - Add your custom domain if applicable

2. **API Restrictions**
   - Restrict key to: Generative Language API
   - This prevents misuse for other Google services

3. **Quota Management**
   - Set daily request limits
   - Set per-user rate limits
   - Enable billing alerts at thresholds

### 🚨 What to Do If Key is Compromised

If you suspect your API key has been exposed:

1. **Immediately delete the compromised key** in Google Cloud Console
2. **Create a new API key** with proper restrictions
3. **Update the key** in:
   - Your local `.env` file
   - Netlify environment variables
4. **Review billing** for unexpected usage
5. **Check access logs** in Google Cloud Console

### 📋 Security Checklist

Before deploying:

- [ ] `.env` file is gitignored (verify with `git status`)
- [ ] No API keys in git history (`git log --all -p | grep -i 'AIza'`)
- [ ] `.env.example` contains only placeholder values
- [ ] API key has HTTP referrer restrictions enabled
- [ ] API key has API restrictions (Generative Language API only)
- [ ] Usage quotas are set in Google Cloud Console
- [ ] Billing alerts are configured
- [ ] Environment variables set in Netlify dashboard

### 🔍 Verify No Secrets in Build

After building, you can verify the bundle doesn't expose full API keys:

```bash
npm run build
grep -r "AIza" dist/  # Should NOT find real API keys (will find hardcoded references)
```

**Note**: The API key will be in the bundle by design - this is unavoidable for client-side apps. The security relies on Google Cloud's API key restrictions.

### 📚 Additional Resources

- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🏗️ Architecture Consideration

**This application is designed as a client-side SPA.** For maximum security in production applications handling sensitive data, consider:

1. **Backend Proxy Pattern**: Create a server-side API that holds the Gemini API key
2. **Authentication**: Add user authentication before API access
3. **Rate Limiting**: Implement server-side rate limiting
4. **Usage Tracking**: Monitor and limit per-user API usage

For this demo/prototype application, the current approach with API key restrictions is acceptable.
