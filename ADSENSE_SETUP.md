# Google AdSense Setup Guide

This guide will help you set up Google AdSense ads on your SecureChat website to start earning money.

## 📋 Prerequisites

- A website (domain) hosted and publicly accessible
- Google account
- Valid payment information
- Your website must comply with Google AdSense policies

## 🚀 Step-by-Step Setup

### Step 1: Apply for Google AdSense

1. **Visit**: https://www.google.com/adsense/
2. **Click**: "Sign up now"
3. **Sign in** with your Google account (create one if needed)
4. **Fill in your website details**:
   - Website URL: Your domain (e.g., `https://my-secure-chat.netlify.app`)
   - Time zone: Your location
   - Payment information
5. **Accept Terms of Service**
6. **Submit your application**

**Note**: Google typically takes 24-48 hours to review your application.

### Step 2: Get Your Publisher ID and Ad Slots

Once your application is approved:

1. **Go to**: Google AdSense Dashboard (https://www.google.com/adsense/)
2. **Navigate to**: Settings → Account Information
3. **Find your Publisher ID** - It looks like: `ca-pub-xxxxxxxxxxxxxxxx`
4. **Create Ad Units**:
   - Go to: Ads and sites → Ad units
   - Click: "By ad unit"
   - Create new ad unit
   - Get the slot ID (e.g., `1234567890`)

### Step 3: Update Your Code

1. **Replace the placeholder Publisher ID** in `src/components/AdBanner.tsx`:

```typescript
// Find this line:
script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx';

// Replace with your actual Publisher ID:
script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID';
```

Also update in the component:

```typescript
data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"

// Replace with:
data-ad-client="ca-pub-YOUR_ACTUAL_ID"
```

2. **Update the ad slot ID**:

```typescript
data-ad-slot={slot}

// The slot is passed as a prop, e.g.:
<AdBanner slot="1234567890" format="auto" />
```

### Step 4: Add Ads to Your Website

The website already has AdBanner components ready to use. Here are the placements:

#### **Homepage Banner Ads** (Optional)
Add to `src/App.tsx` in the landing page section:

```typescript
import AdBanner from './components/AdBanner';

// In the landing page rendering section, add:
<AdBanner slot="YOUR_SLOT_ID" format="auto" responsive={true} />
```

#### **Chat Room Sidebar Ads** (Optional)
Add to `src/components/ChatRoom.tsx`:

```typescript
// In the messages area, add:
<AdBanner slot="YOUR_SLOT_ID" format="vertical" responsive={true} />
```

#### **Footer Ads**
Add to `src/components/Footer.tsx`:

```typescript
import AdBanner from './components/AdBanner';

// In the footer component:
<AdBanner slot="YOUR_SLOT_ID" format="horizontal" responsive={true} />
```

### Step 5: Important Configuration

**Update these placeholders throughout the codebase:**

Find and replace all instances of:
```
ca-pub-xxxxxxxxxxxxxxxx
```

With your actual Publisher ID:
```
ca-pub-YOUR_ACTUAL_ID
```

And replace:
```
1234567890
```

With your actual ad slot IDs from AdSense.

## 💰 Ad Placement Recommendations

### Best Placement Locations:
1. **Above the fold** (visible without scrolling) - 728x90 leaderboard ad
2. **Sidebar** (if space available) - 300x600 half-page ad
3. **Bottom of page** - 728x90 leaderboard ad
4. **Between content** - Responsive ads

### Example Placements for SecureChat:

**Landing Page**: Add 2-3 responsive banner ads
- Above features section
- Between features and action buttons
- Bottom footer area

**Chat Room**: Add 1 vertical ad on the right side (if space)
- Doesn't interfere with chat

**Mobile**: Use responsive ads that adapt to screen size

## ⚠️ Google AdSense Policies

**DO:**
- ✅ Place ads where they're visible and not hidden
- ✅ Use responsive ad units for better CTR
- ✅ Mix text and display ads
- ✅ Test ads on your own site
- ✅ Let ads load naturally

**DON'T:**
- ❌ Click your own ads
- ❌ Encourage users to click ads
- ❌ Use misleading ad placements
- ❌ Place ads in email or newsletters
- ❌ Modify ad code or styling
- ❌ Use auto-refreshing ads
- ❌ Participate in click fraud

## 🔍 Troubleshooting

### Ads Not Showing?

1. **Check Publisher ID**: Make sure it's correct (ca-pub-...)
2. **Check Slot ID**: Verify the ad slot exists in your account
3. **Wait for Approval**: It can take 24-48 hours for new ad units to activate
4. **Check Console**: Open browser DevTools (F12) and check for errors
5. **Domain Match**: Make sure your domain matches exactly in AdSense

### Invalid Traffic Warning?

If you get this warning, Google detected unusual clicking patterns:
- Don't click your own ads
- Don't place ads where they might get accidental clicks
- Ensure proper ad spacing

## 📊 Monitoring Earnings

1. **Go to**: Google AdSense Dashboard
2. **View Reports**: See real-time earnings and statistics
3. **Track Performance**: Monitor which ad placements perform best
4. **Optimize**: Adjust placements based on performance data

**Note**: Earnings usually appear within 24 hours of ad impressions.

## 🎯 Earning Tips

1. **Traffic First**: Focus on getting more visitors before optimizing ads
2. **Niche Content**: Higher-paying ads appear for specific topics
3. **Test Placements**: Try different ad sizes and positions
4. **Mobile Optimization**: Most users browse on mobile
5. **Content Quality**: Better content = more engagement = higher CTR

## 🚀 Deployment with Ads

Once configured, deploy your website:

1. Update your code with real Publisher ID and slot IDs
2. **Build the project**:
   ```bash
   npm run build
   ```
3. **Deploy to hosting**:
   - Netlify: Drag the `dist` folder
   - Vercel: Connect GitHub repo
   - GitHub Pages: Push to gh-pages branch

4. **Verify in AdSense**:
   - Go to AdSense dashboard
   - Add your domain if not already there
   - Wait for activation (24-48 hours)
   - Check your site shows ads correctly

## 📞 Support

**Google AdSense Help**: https://support.google.com/adsense/

**Common Issues Docs**: https://support.google.com/adsense/answer/7499641

## 💡 Quick Reference

**Publisher ID Format**: `ca-pub-` followed by 16 numbers

**Common Ad Sizes**:
- `728x90` - Leaderboard (horizontal)
- `300x250` - Medium rectangle
- `300x600` - Half page (vertical)
- `970x90` - Large leaderboard
- `auto` - Responsive (recommended)

**Ad Types**:
- Display ads - Image/visual ads
- Text ads - Text-only ads
- Native ads - Blends with content
- Matched content - Related content ads

**Formats in AdBanner**:
```typescript
format="auto"         // Responsive, recommended
format="horizontal"   // Leaderboard style
format="vertical"     // Column style
responsive={true}     // Adapts to screen size
```

---

**Estimated Timeline**:
- Application submission: Immediate
- Approval: 24-48 hours
- First earnings: 1-3 days after ads go live
- First payout: ~30 days (minimum $100)

Good luck with monetizing your SecureChat! 🚀💰
