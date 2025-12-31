# LearnSmart Data Collection Summary
**Play Store Data Safety Compliance Documentation**

**Effective Date:** January 1, 2025  
**Last Updated:** January 1, 2025  
**Contact:** learnsmartofficial24@gmail.com

---

## Overview

LearnSmart is an educational app designed for students. We collect minimal data necessary to provide a personalized learning experience. This document provides a comprehensive overview of all data collection practices in compliance with Google Play Store requirements, GDPR, and COPPA.

---

## Data Collection Inventory

### 1. Personal Information

#### Email Address
- **How Collected:** During user signup/login via AnimatedLoginForm component
- **Why Collected:** User authentication, account management, app access
- **Storage Location:** Local device (AsyncStorage) - NOT stored in cloud
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Retained until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO
- **Encryption:** Stored locally on device only

#### Name
- **How Collected:** During user signup in AnimatedLoginForm
- **Why Collected:** Personalization of learning experience, greeting messages
- **Storage Location:** Local device (AsyncStorage) via userStore
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

#### Grade/Class Selection
- **How Collected:** During onboarding via StreamSelectionModal
- **Why Collected:** Personalize content based on student's academic level
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user changes selection or logs out
- **Shared with Third Parties:** ❌ NO

---

### 2. Learning Analytics

#### Learning Progress (XP)
- **How Collected:** Automatically tracked as user completes lessons and quizzes
- **Why Collected:** Gamification, progress tracking, motivation
- **Storage Location:** Local device (AsyncStorage) via xpStore
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

#### Streaks
- **How Collected:** Automatically tracked via streakService based on daily usage
- **Why Collected:** Gamification, encourage consistent learning habits
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user logs out
- **Shared with Third Parties:** ❌ NO

#### Quiz Scores
- **How Collected:** Automatically recorded when user completes quizzes
- **Why Collected:** Track learning progress, show achievements
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

#### Reading History (Lessons/Chapters Viewed)
- **How Collected:** Automatically tracked when user views lessons/chapters
- **Why Collected:** Progress tracking, resume where user left off
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

#### Quiz Completion History
- **How Collected:** Automatically recorded when quizzes are completed
- **Why Collected:** Track achievements, display in Trophy Room
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

---

### 3. Device Information

#### Device Identifiers (for AdMob)
- **How Collected:** Automatically collected by Google AdMob SDK
- **Why Collected:** Serve personalized advertisements, prevent ad fraud
- **Storage Location:** Not stored by LearnSmart (handled by AdMob)
- **Who Has Access:** Google AdMob (advertising service)
- **Data Retention:** As per Google AdMob's privacy policy
- **Shared with Third Parties:** ✅ YES (Google AdMob only)
- **User Control:** Users can reset advertising ID in device settings

#### Basic Device Info (App Performance)
- **How Collected:** Automatically logged by React Native for crash reporting
- **Why Collected:** App performance monitoring, bug fixes
- **Storage Location:** Not stored (temporary logs only)
- **Who Has Access:** App developers only
- **Data Retention:** Cleared on app restart
- **Shared with Third Parties:** ❌ NO

---

### 4. User Preferences

#### Avatar Preference
- **How Collected:** User selection via AvatarSelector component
- **Why Collected:** Personalization, visual customization
- **Storage Location:** Local device (AsyncStorage) via userStore
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user changes selection or logs out
- **Shared with Third Parties:** ❌ NO

#### Theme Preference (Light/Dark Mode)
- **How Collected:** User selection via DarkModeToggle component
- **Why Collected:** Visual customization, user comfort
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user changes selection or logs out
- **Shared with Third Parties:** ❌ NO

---

### 5. Technical Identifiers

#### User ID (Internal)
- **How Collected:** Auto-generated using timestamp and random string
- **Why Collected:** Internal reference for local data management
- **Storage Location:** Local device (AsyncStorage) via userStore
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO
- **Format:** `user_[timestamp]_[random_string]`

#### Signup Date
- **How Collected:** Automatically recorded when user creates account
- **Why Collected:** Track user lifecycle, calculate streaks
- **Storage Location:** Local device (AsyncStorage)
- **Who Has Access:** Only the app on the user's device
- **Data Retention:** Until user deletes account/logs out
- **Shared with Third Parties:** ❌ NO

---

## Third-Party Services

### Google AdMob
- **Purpose:** Display advertisements
- **Data Collected:** Device identifiers ( Advertising ID), app usage data
- **Data Usage:** Serve personalized ads, prevent fraud, analytics
- **Privacy Policy:** [Google Ads Privacy Policy](https://policies.google.com/technologies/ads)
- **User Control:** Users can opt out of personalized ads in device settings
- **Note:** Currently using test ad units (no real ads displayed)

### Amazon Affiliate Program
- **Purpose:** Earn commissions from book purchases
- **Data Collected:** Cookies (via Amazon, not LearnSmart)
- **Data Usage:** Track affiliate link clicks for commission attribution
- **Privacy Policy:** [Amazon Privacy Notice](https://www.amazon.com/privacy)
- **User Control:** Users can clear cookies in browser settings
- **Note:** Currently using test affiliate tag (no real commissions)

---

## Data Storage Architecture

### Local Storage (AsyncStorage)
All personal and learning data is stored **locally on the user's device** using React Native's AsyncStorage. This includes:

- User authentication data
- Learning progress (XP, streaks)
- Quiz completion history
- User preferences (avatar, theme)
- Reading history

**Storage Keys:**
- `@learnsmart_user_name`
- `@learnsmart_selected_class`
- `@learnsmart_selected_stream`
- `@learnsmart_selected_avatar`
- `@learnsmart_theme_preference`
- `@learnsmart_is_onboarded`
- `@learnsmart/user_age_group`
- `@learnsmart/user_id`
- `@learnsmart/signup_date`
- `@learnsmart/profile_complete`
- XP and achievement data (additional keys)

### No Cloud Storage
❌ LearnSmart does **NOT** use any cloud storage services (Firebase, AWS, etc.)
❌ LearnSmart does **NOT** send any personal data to external servers
❌ LearnSmart does **NOT** create user accounts on any backend

All data remains on the user's device and is deleted when the app is uninstalled.

---

## Data Sharing Practices

### We DO NOT Share:
- ❌ Personal data (name, email) with advertisers or data brokers
- ❌ Learning progress or quiz scores with third parties
- ❌ User preferences with third parties
- ❌ Sell or monetize any user data

### We DO Share:
- ✅ Device identifiers with Google AdMob (for ad personalization only)
- ✅ Affiliate link clicks with Amazon (for commission tracking only)

**Important:** AdMob and Amazon data sharing is limited to their respective services. No other third-party access.

---

## User Rights & Data Control

### Data Access
Users can view all their data within the app:
- Profile screen shows name, avatar, XP, streak
- Trophy Room shows achievements and quiz history
- Settings show preferences (theme, avatar)

### Data Deletion
Users can delete all their data by:
1. Logging out of the app (clears local storage)
2. Uninstalling the app (removes all data)
3. Contacting support at learnsmartofficial24@gmail.com for assistance

### Data Modification
Users can modify their data:
- Change avatar in Profile screen
- Change theme in Settings
- Update class/stream selection in Profile

### Account Deletion
To delete account and all associated data:
1. Open Profile screen
2. Tap "Log Out" (this clears all local data)
3. Or contact learnsmartofficial24@gmail.com for assistance

---

## GDPR Compliance

### Lawful Basis for Processing
LearnSmart processes personal data based on:
1. **Contractual Necessity** - Required to provide learning services
2. **Legitimate Interest** - Improve app functionality and user experience
3. **User Consent** - For personalized advertising (AdMob)

### User Rights under GDPR
- ✅ Right to access personal data
- ✅ Right to rectify inaccurate data
- ✅ Right to erasure (right to be forgotten)
- ✅ Right to restrict processing
- ✅ Right to data portability
- ✅ Right to object to processing
- ✅ Right to withdraw consent

### Contact for GDPR Requests
Email: learnsmartofficial24@gmail.com  
Response Time: Within 30 days

---

## COPPA Compliance

### Children's Privacy Protection
LearnSmart is designed for students and complies with COPPA:

- ✅ No collection of personal data from children under 13 without parental consent
- ✅ No behavioral advertising targeted at children under 13
- ✅ No data collection for commercial purposes from children
- ✅ Age group selection ensures appropriate content delivery

### Parental Consent Process
- Users under 13 require parental consent before account creation
- Parents can review, modify, or delete their child's data
- Contact learnsmartofficial24@gmail.com for parental requests

### Age-Appropriate Design
- Under 12 mode: Fun, colorful, simplified interface
- 12+ mode: Professional, focused dashboard
- Age group selection determines content presentation

---

## Security Measures

### Data Protection
- **Local Storage Only:** No cloud transmission of personal data
- **No Server-Side Storage:** Eliminates data breach risks
- **Minimal Data Collection:** Only essential data collected
- **No Third-Party Sharing:** Except for AdMob and Amazon services

### Technical Security
- AsyncStorage encrypted on device (platform-dependent)
- No external API calls for user data
- No analytics services that transmit personal data
- No crash reporting services that collect personal data

---

## Data Retention Policy

| Data Type | Retention Period | Deletion Trigger |
|-----------|-----------------|------------------|
| Email & Name | Until logout/delete | User logs out or deletes account |
| Learning Progress | Until logout/delete | User logs out or deletes account |
| Quiz History | Until logout/delete | User logs out or deletes account |
| User Preferences | Until logout/delete | User logs out or deletes account |
| Device Identifiers (AdMob) | Per Google's policy | Device reset or opt-out |

**Note:** All data is deleted automatically when user logs out or uninstalls the app.

---

## Privacy Policy References

- Full Privacy Policy: See `PRIVACY_POLICY.md` or Privacy Policy screen in app
- Terms of Service: See `TermsScreen.tsx` or Terms screen in app
- Contact: learnsmartofficial24@gmail.com

---

## Play Store Data Safety Disclosure

### App Data Safety (Google Play Console)

| Data Type | Collected | Shared | Required |
|-----------|-----------|---------|----------|
| Email address | ✅ Yes | ❌ No | ❌ No |
| App activity (quizzes, reading history) | ✅ Yes | ❌ No | ❌ No |
| App info and performance | ✅ Yes | ❌ No | ❌ No |
| Device or other IDs | ✅ Yes | ✅ Yes (AdMob) | ❌ No |

### Security Practices
- Data is encrypted in transit (not applicable - no cloud transmission)
- Data can be deleted (via logout or app uninstall)
- You can request data deletion (contact learnsmartofficial24@gmail.com)

---

## Contact Information

**Privacy Inquiries:** learnsmartofficial24@gmail.com  
**Support Requests:** learnsmartofficial24@gmail.com  
**GDPR/COPPA Requests:** learnsmartofficial24@gmail.com

**Response Time:** Within 30 days for data requests

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 1, 2025 | Initial Data Collection Summary for Play Store submission |

---

**End of Data Collection Summary**
