# What's UpDog?

A decentralized website uptime monitoring system built with TypeScript, Solana blockchain integration, and real-time WebSocket communication. The system uses a network of validators to check website availability and stores results in a distributed manner.

 <p align="center">
    <br />
    ·
    <a href="https://up-dog.vercel.app">Website</a>
    ·
    <a href="https://github.com/Akash-YS05/uptime-check">Github</a>
    ·
  </p>

## Architecture

The system consists of three main components:

- **API Server** - REST API for managing websites and retrieving monitoring data
- **Hub Server** - WebSocket coordinator that manages validators and distributes monitoring tasks
- **Validator Nodes** - Distributed nodes that perform actual website checks
- **Frontend** - Next.js frontend for UI 

## ✨ Features

- 🌐 **Decentralized Monitoring** - Multiple validators check each website for reliability
- 🔐 **Solana Integration** - Cryptographic signatures ensure validator authenticity
- 📊 **Real-time Updates** - WebSocket-based communication for instant results
- 💰 **Incentive System (Upcoming)** - Validators earn rewards for monitoring services
- 🔒 **JWT Authentication** - Secure API access with token-based auth
- 📈 **Performance Tracking** - Latency measurement and status history
- 🚀 **High Performance** - Built with Bun runtime for optimal speed

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Backend**: Express.js with TypeScript
- **Database**: Prisma ORM (database agnostic)
- **Blockchain**: Solana Web3.js
- **WebSockets**: Native Bun WebSocket support
- **Cryptography**: TweetNaCl for message signing
- **Authentication**: JWT with RSA public key verification

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.2.13 or higher
- Node.js (for compatibility)
- Database (PostgreSQL, MySQL, or SQLite)
- Solana wallet for validator nodes

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/uptime-monitor.git
cd uptime-monitor
```

### 2. Install Dependencies

```bash
# Install dependencies for all apps
bun install

# Or install individually
cd apps/api && bun install
cd apps/hub && bun install
cd apps/validator && bun install
```

### 3. Environment Setup

Create `.env` files in each app directory:

#### API Server (`apps/api/.env`)
```env
PORT=3001
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBI....
-----END PUBLIC KEY-----"
DATABASE_URL="your_database_connection_string"
```

#### Hub Server (`apps/hub/.env`)
```env
PORT=8081
DATABASE_URL="your_database_connection_string"
```

#### Validator (`apps/validator/.env`)
```env
PORT=3000
PRIVATE_KEY="[1,2,3,...,64]"  # Solana keypair as JSON array
HUB_URL="ws://localhost:8081"  # or wss://your-hub-domain.com
```

## 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Server    │───▶│    Database     │
│  (Frontend)     │    │  (Express.js)   │    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Hub Server    │
                       │  (WebSocket)    │
                       └─────────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │      Validator Network     │
                    │  ┌─────┐ ┌─────┐ ┌─────┐  │
                    │  │ V1  │ │ V2  │ │ V3  │  │
                    │  └─────┘ └─────┘ └─────┘  │
                    └───────────────────────────┘
```

## 🔐 Security Features

- **Cryptographic Signatures**: All validator communications are signed using Ed25519
- **JWT Authentication**: Secure API access with RSA public key verification
- **Message Verification**: Hub verifies all validator responses
- **Timeout Protection**: Prevents hanging connections and callbacks
- **Input Validation**: Sanitized inputs and proper error handling

## 🚦 Monitoring Flow

1. **Website Registration**: Users add websites via API
2. **Task Distribution**: Hub distributes monitoring tasks to validators
3. **Validation**: Validators check websites and measure latency
4. **Response Signing**: Validators sign their responses cryptographically
5. **Verification**: Hub verifies signatures and stores results
6. **Reward Distribution**: Validators earn rewards for successful checks
---
**And that's all folks!**
