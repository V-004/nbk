# 🏦 NexusBank - Next-Generation Contactless Banking Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A revolutionary digital banking platform combining cutting-edge AI, biometric authentication, and contactless payment technologies to deliver a secure, intelligent, and seamless banking experience.

![NexusBank Banner](frontend/public/nexus-logo.png)

## 🌟 Key Features

### 🔐 Multi-Modal Biometric Authentication
- **Face Recognition**: Advanced facial recognition using Face-API.js and TensorFlow
- **Voice Recognition**: Voice biometric authentication with multi-language support
- **Password Authentication**: Traditional secure login with JWT tokens

### 🤖 AI-Powered Banking Assistant
- **Natural Language Processing**: Powered by Google Gemini AI
- **Voice Commands**: Hands-free banking operations
- **Multi-language Support**: English, Hindi, Spanish, French
- **24/7 Availability**: Instant assistance anytime

### 💳 Contactless Payment Solutions
- **UPI Payments**: Instant money transfers via UPI ID
- **QR Code Payments**: Scan and pay functionality
- **NFC Tap-to-Pay**: Contactless card payments
- **IMPS/NEFT**: Bank-to-bank transfers

### 💎 Virtual Card Management
- **Instant Card Generation**: Create virtual debit/credit cards
- **Card Tokenization**: Enhanced security for online transactions
- **Freeze/Unfreeze**: Control card status instantly
- **Spending Limits**: Set custom transaction limits

### 🎁 Rewards & Gamification
- **Points System**: Earn 1 point per ₹100 spent
- **Achievement Badges**: Unlock milestones and achievements
- **Tiered Rewards**: Bronze, Silver, Gold, Platinum tiers
- **Redemption Options**: Cashback, vouchers, bill payments

### 📊 Real-Time Analytics
- **Spending Insights**: AI-powered financial analysis
- **Category Tracking**: Automatic transaction categorization
- **Budget Management**: Set and track budgets
- **Visual Reports**: Interactive charts and graphs

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 15.1.3 with App Router
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.1
- **Components**: Shadcn/ui
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React
- **Face Recognition**: Face-API.js 0.22.2

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **Databases**: 
  - MongoDB (User data, sessions)
  - SQLite (Accounts, transactions)
- **Authentication**: JWT, bcrypt
- **AI Integration**: Google Gemini API
- **File Upload**: Multer

### Security
- **Encryption**: AES-256 for sensitive data
- **Authentication**: Multi-factor (Password + OTP + Biometric)
- **Token Management**: JWT with refresh tokens
- **Data Protection**: HTTPS/TLS, PCI DSS compliance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (for user data)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/nexusbank.git
cd nexusbank
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexusbank
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Database Setup

The SQLite database will be created automatically on first run. For MongoDB, ensure it's running:
```bash
# Start MongoDB
mongod
```

### 5. Run the Application

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📖 Usage Guide

### User Registration
1. Navigate to `/register`
2. Enter email, password, and personal details
3. Optionally enroll face and voice biometrics
4. Account created with default savings account

### Login Options
- **Password Login**: Email + password
- **Face Recognition**: Click "Login with Face" and allow camera access
- **Voice Recognition**: Click "Login with Voice" and speak passphrase

### Making Payments
1. Go to Dashboard → Payments
2. Select payment method (UPI/IMPS/NEFT/QR/NFC)
3. Enter recipient details and amount
4. Confirm and authenticate with OTP

### Using AI Assistant
1. Click the AI assistant icon (bottom right)
2. Type or speak your query
3. Get instant banking assistance

## 🏗️ Project Structure

```
contactless-bank/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── register/       # Registration pages
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── banking/        # Banking components
│   │   ├── dashboard/      # Dashboard components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
│
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication APIs
│   │   ├── accounts.js     # Account management
│   │   ├── payments.js     # Payment processing
│   │   ├── cards.js        # Virtual cards
│   │   └── ai.js           # AI assistant
│   ├── models/             # Database models
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
│
└── README.md               # This file
```

## 🔒 Security Features

- **Multi-Factor Authentication**: Password + OTP + Biometric
- **Encrypted Biometric Data**: Face and voice data stored as encrypted descriptors
- **JWT Token Security**: Signed tokens with expiration
- **Transaction Limits**: Per-transaction and daily limits
- **Fraud Detection**: Real-time suspicious activity monitoring
- **Secure Communication**: HTTPS/TLS encryption
- **PCI DSS Compliance**: Payment card industry standards

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Credentials
For development/testing:
- **Email**: test@nexusbank.com
- **Password**: Test@123

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Password login
- `POST /api/auth/face-login` - Face recognition login
- `POST /api/auth/voice-login` - Voice recognition login
- `POST /api/auth/logout` - User logout

### Account Endpoints
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id/balance` - Get account balance
- `GET /api/accounts/:id/statement` - Get account statement

### Payment Endpoints
- `POST /api/payments/upi` - UPI payment
- `POST /api/payments/imps` - IMPS transfer
- `POST /api/payments/neft` - NEFT transfer
- `POST /api/payments/qr` - QR code payment
- `POST /api/payments/nfc` - NFC payment

For complete API documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

### Environment Variables (Production)
Ensure all environment variables are properly set for production:
- Update `MONGODB_URI` to production database
- Use strong `JWT_SECRET`
- Configure `GEMINI_API_KEY`
- Set proper CORS origins

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: NexusBank Development Team
- **Project Lead**: [Your Name]
- **Contact**: support@nexusbank.com

## 🙏 Acknowledgments

- **Face-API.js** - For facial recognition capabilities
- **Google Gemini AI** - For AI assistant functionality
- **Next.js Team** - For the amazing framework
- **Shadcn/ui** - For beautiful UI components
- **MongoDB** - For flexible data storage

## 📞 Support

For support, email support@nexusbank.com or join our Discord community.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Multi-modal authentication
- ✅ AI banking assistant
- ✅ Contactless payments
- ✅ Virtual cards
- ✅ Rewards system

### Phase 2 (Next 3 Months)
- 🔄 Investment services
- 🔄 Loan management
- 🔄 Insurance integration
- 🔄 Bill payments

### Phase 3 (Next 6 Months)
- 🔄 Cryptocurrency wallet
- 🔄 Robo-advisory
- 🔄 Social payments
- 🔄 Merchant services

---

**Made with ❤️ by NexusBank Team**

⭐ Star us on GitHub if you find this project useful!
