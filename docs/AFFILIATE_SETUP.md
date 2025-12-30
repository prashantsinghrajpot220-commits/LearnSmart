# Amazon Affiliate Setup Guide for LearnSmart

This document explains how to set up and configure Amazon Associates affiliate links for book recommendations in the LearnSmart application.

## 1. Prerequisites

- An approved **Amazon Associates account** (required for production)
- Basic understanding of environment variables
- Access to the LearnSmart codebase

## 2. Amazon Associates Account Setup

### Step 1: Sign up for Amazon Associates

1. Go to the [Amazon Associates website](https://affiliate-program.amazon.com/)
2. Click **Join Now for Free** and sign in with your Amazon account
3. Complete the application process with your website/app details
4. Wait for approval (usually takes 1-3 business days)

### Step 2: Get Your Affiliate Tag

Once approved:

1. Log in to your [Amazon Associates dashboard](https://affiliate-program.amazon.com/)
2. Go to **Account Settings** > **Your Account Information**
3. Find your **Tracking ID** (format: `yourname-20`)
4. Copy this tracking ID - this is your affiliate tag

### Step 3: Choose Your Target Region

Decide which Amazon marketplace you want to target:
- **US**: `https://www.amazon.com` (default)
- **UK**: `https://www.amazon.co.uk`
- **Canada**: `https://www.amazon.ca`
- **Germany**: `https://www.amazon.de`
- **France**: `https://www.amazon.fr`
- **Spain**: `https://www.amazon.es`
- **Italy**: `https://www.amazon.it`
- **Japan**: `https://www.amazon.co.jp`
- **India**: `https://www.amazon.in`
- **Australia**: `https://www.amazon.com.au`

## 3. Configuration

### Step 1: Environment Variables

Create a `.env` file in the root of the project (copy from `.env.example`) and add your affiliate credentials:

```env
# Amazon Affiliate Configuration
EXPO_PUBLIC_AMAZON_AFFILIATE_TAG=your-affiliate-tag-20
EXPO_PUBLIC_AMAZON_REGION=US
```

Replace `your-affiliate-tag-20` with your actual Amazon Associates tracking ID.

### Step 2: Book Data Setup

Ensure your book data includes proper identifiers:

- **ASIN** (Amazon Standard Identification Number) - preferred for direct product links
- **ISBN** (International Standard Book Number) - fallback option
- **Amazon URL** - existing product URL that will be converted to affiliate link

Example book data structure:

```javascript
{
  id: 'book-1',
  pathwayId: 'p1',
  pathwayName: 'Web Development',
  title: 'Eloquent JavaScript',
  author: 'Marijn Haverbeke',
  description: 'Modern introduction to JavaScript',
  thumbnail: '💻',
  amazonUrl: 'https://www.amazon.com/dp/1593279507',
  isbn: '9781593279509',
  asin: '1593279507'  // ASIN for direct linking
}
```

## 4. Implementation Details

### Components

- **BooksGrid.tsx**: Main component displaying book recommendations with affiliate links
- **affiliateLinks.ts**: Utility functions for generating and validating affiliate links
- **affiliateConfig.ts**: Configuration for affiliate settings

### How It Works

1. **Link Generation**: When a user clicks "Buy on Amazon", the existing Amazon URL is converted to an affiliate URL by adding your tracking tag
2. **Fallback System**: If direct product linking fails, the system falls back to Amazon search with relevant keywords
3. **Validation**: All affiliate links are validated before being opened
4. **Tracking**: Basic click tracking is implemented (logs to console in development)

### Key Features

- **Automatic Affiliate Tag Injection**: Converts regular Amazon URLs to affiliate URLs
- **Multi-Region Support**: Supports all major Amazon marketplaces
- **Link Validation**: Ensures URLs are valid before opening
- **Fallback Mechanism**: Uses search if direct product link fails
- **Test Mode**: Uses test affiliate tag in development to avoid policy violations
- **Affiliate Disclosure**: Automatically displays required FTC compliance disclosure

## 5. Testing

### Development Testing

The app is configured to use a **test affiliate tag** (`learnsmarttest-20`) during development:

- No real commissions are earned in test mode
- Test links are clearly marked in the UI
- Alerts inform users when test mode is active

### Production Testing

Before going live:

1. Replace the test affiliate tag with your real tag in `.env`
2. Test all book links to ensure they redirect properly
3. Verify the affiliate disclosure is visible
4. Check that click tracking works (console logs in development)

## 6. Compliance & Best Practices

### Amazon Associates Program Policies

- **Disclosure**: You must clearly disclose your affiliate relationship
- **No Incentives**: Don't offer incentives for clicks/purchases
- **No Fake Clicks**: Don't click your own links or encourage others to do so
- **Content Quality**: Ensure your app provides real value beyond just affiliate links

### FTC Compliance

The app automatically includes the required affiliate disclosure:

> "As an Amazon Associate, we earn from qualifying purchases. This helps support our educational platform."

### Privacy Considerations

- Affiliate links do not collect personal user data
- Click tracking is limited to basic analytics (book title, pathway)
- No sensitive information is transmitted

## 7. Advanced: Amazon Product Advertising API (Optional)

For dynamic product data, you can integrate the Amazon Product Advertising API:

### Step 1: Get AWS Credentials

1. Sign up for [AWS](https://aws.amazon.com/)
2. Go to **IAM** > **Users** > **Add User**
3. Attach the **AmazonProductAdvertisingAPIFullAccess** policy
4. Copy the **Access Key ID** and **Secret Access Key**

### Step 2: Configure API

Add to your `.env` file:

```env
EXPO_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Step 3: Implement API Calls

The `affiliateConfig.ts` file includes AWS configuration. You can extend the `affiliateLinks.ts` utility to fetch real-time product data.

## 8. Troubleshooting

### Common Issues

**Issue**: Links not converting to affiliate URLs
- **Solution**: Check that `EXPO_PUBLIC_AMAZON_AFFILIATE_TAG` is set correctly

**Issue**: "Invalid product link" errors
- **Solution**: Verify book data has valid ASIN/ISBN or Amazon URLs

**Issue**: Links opening but no commissions tracked
- **Solution**: Ensure you're not using test tag in production

**Issue**: App rejected by Amazon Associates
- **Solution**: Review compliance requirements and ensure proper disclosure

### Debugging

- Check console logs for affiliate link generation details
- Use `isUsingTestAffiliateTag()` to verify your environment
- Test with real devices (some features may not work in simulators)

## 9. Monitoring & Optimization

### Tracking Performance

- Monitor clicks and conversions in your Amazon Associates dashboard
- Track which books perform best for your audience
- Optimize book recommendations based on conversion rates

### Best Practices

- Feature high-quality, relevant books for your audience
- Keep book data up-to-date (prices, availability)
- Rotate recommendations to keep content fresh
- Consider seasonal or topical book recommendations

## 10. Support

For issues with the affiliate integration:

- Check the [Amazon Associates Help Center](https://affiliate-program.amazon.com/help)
- Review the [Amazon Associates Operating Agreement](https://affiliate-program.amazon.com/gp/associates/agreement)
- Contact Amazon Associates support for account-specific issues

For technical issues with the LearnSmart implementation:
- Review the code in `utils/affiliateLinks.ts` and `config/affiliateConfig.ts`
- Check console logs for errors
- Ensure all environment variables are properly set

## 11. Migration from Test to Production

When ready to go live:

1. **Replace test affiliate tag** with your real tag in `.env`
2. **Test thoroughly** with real devices
3. **Monitor initial performance** in Amazon Associates dashboard
4. **Update regularly** - keep book data current
5. **Comply with policies** - ensure ongoing compliance with Amazon's terms

## 12. Legal Notes

- You are responsible for complying with Amazon Associates Program policies
- This implementation provides the technical foundation but does not guarantee compliance
- Always review the latest Amazon Associates Operating Agreement
- Consult legal counsel if you have questions about affiliate marketing regulations