# Google Sheets Setup Guide (Updated)

## Important Changes:
Due to encoding issues with Arabic sheet names, we've updated the system to use English sheet names.

## Required Sheet Names:
- `Contracts` (instead of العقود)
- `Payments` (instead of الدفعات)  
- `Users` (instead of المستخدمين)
- `Notifications` (instead of التنبيهات)
- `Settings` (instead of الإعدادات)

## Step-by-Step Setup:

### 1. Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the spreadsheet ID from the URL (the part between `/d/` and `/edit`)

### 2. Create Required Sheets
Create the following sheets with these exact names:

#### Sheet: "Contracts"
Row 1 (Headers):
\`\`\`
Contract ID | Contract Name | Contract Number | Start Date | End Date | Total Rent Value | Facilities Service Fees | Signage Fees | Rent Payment Period | Contract Status | Notes | Created At | Updated At | Created By
\`\`\`

Example Row 2:
\`\`\`
C001 | عقد إيجار مجمع الرياض التجاري | RC-2024-001 | 2024-01-15 | 2025-01-15 | 500000 | 25000 | 15000 | ربع سنوي | نشط | هذا العقد يشمل إيجار المحلات التجارية | 2024-01-10 | 2024-01-12 | أحمد محمد
\`\`\`

#### Sheet: "Payments"
Row 1 (Headers):
\`\`\`
Payment ID | Contract ID | Type | Amount | Payment Date | Due Date | Status | Payment Method | Receipt Number | Notes | Created By | Created At | Updated At
\`\`\`

Example Row 2:
\`\`\`
PAY001 | C001 | rent | 125000 | 2024-01-15 | 2024-01-15 | paid | تحويل بنكي | REC-2024-001 | دفعة الربع الأول | أحمد محمد | 2024-01-15 | 2024-01-15
\`\`\`

#### Sheet: "Users"
Row 1 (Headers):
\`\`\`
User ID | Username | Full Name | Email | Role | Permissions | Status | Last Login | Created At
\`\`\`

Example Row 2:
\`\`\`
U001 | admin | أحمد محمد السعيد | admin@company.com | مدير النظام | قراءة,كتابة,حذف,إدارة | نشط | 2024-01-15 10:30 | 2024-01-01
\`\`\`

### 3. Set Permissions
1. Click "Share" button in Google Sheets
2. Change to "Anyone with the link"
3. Set permission to "Viewer"
4. Copy the share link

### 4. Google API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create API Key
5. Restrict the API Key to Google Sheets API only

### 5. Update Environment Variables
Make sure your `.env.local` has:
\`\`\`env
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_spreadsheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
\`\`\`

### 6. Test Connection
Visit `/test-connection` page to verify everything is working correctly.

## Troubleshooting:

### Common Issues:
1. **HTTP 400 Error**: Usually means sheet names don't match or permissions are wrong
2. **HTTP 403 Error**: API key issues or quota exceeded
3. **HTTP 404 Error**: Spreadsheet ID is wrong or not accessible

### Solutions:
1. Double-check sheet names are exactly: `Contracts`, `Payments`, `Users`
2. Verify spreadsheet is shared publicly
3. Confirm API key is working and has proper restrictions
4. Check Google Cloud Console for API usage and errors

## Fallback Mode:
The system now includes fallback data, so even if Google Sheets connection fails, the application will still work with sample data for testing purposes.
