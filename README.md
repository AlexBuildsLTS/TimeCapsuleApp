# ⏳ Time Capsule - A Message to Your Future Self

<div align="center">
  <img src="https://i.imgur.com/your-logo-image.png" alt="Time Capsule Logo" width="200" height="200" style="border-radius: 20px;">
  
  [![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue.svg)](https://expo.dev)
  [![Framework](https://img.shields.io/badge/Framework-React%20Native-61DAFB.svg)](https://reactnative.dev)
  [![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020.svg)](https://expo.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🌟 Preserve Today's Moments for Tomorrow

**Time Capsule** is a digital vessel for your memories, designed to send messages, photos, videos, and sounds to your future self. Create a capsule, fill it with memories, seal it until a future date, and rediscover your past with an emotional unlocking ceremony. It's a unique and poignant way to connect with who you were and see how far you've come.

---

```
## ✨ Core Features

### 캡슐 **Capsule Creation**
- **Intuitive Wizard**: A guided, multi-step process to create your time capsule.
- **Set the Date**: Choose any future date for your capsule to unlock.
- **Multimedia Memories**: Add various types of content to preserve your moments perfectly:
  - 📸 **Photos & Videos**: Capture visuals from your camera or gallery.
  - 🎤 **Voice Memos**: Record audio notes, thoughts, or sounds from your environment.
  - 📝 **Text Notes**: Write letters, predictions, or messages to your future self.
  - 📍 **Location Tagging**: Pinpoint the exact location where your memories were made.

### 🔐 **Sealing & Secure Storage**
- **Irreversible Sealing**: Once a capsule is sealed, its contents are locked away and cannot be accessed or modified until the unlock date.
- **Anticipation Building**: The app provides powerful visual feedback, confirming your memories are securely stored for the future.
- **(Roadmap) End-to-End Encryption**: Future versions will feature a robust backend where all content is encrypted. The decryption key will only become available to your device on the unlock date, ensuring ultimate privacy and security.

### 🏛️ **The Vault**
- **Centralized Hub**: A beautiful, minimalist main screen displaying all your sealed and unlocked capsules.
- **Live Countdowns**: Each sealed capsule features a live countdown, building anticipation for the moment of reveal.
- **At-a-Glance Stats**: Quickly see how many capsules are sealed, ready to be unlocked, or have been opened.
- **Performant UI**: Built with Shopify's FlashList for a smooth, high-performance scrolling experience, no matter how many capsules you have.

### 🎉 **The Unlocking Ceremony**
- **Push Notifications**: Receive a special notification on the day your capsule is ready to be opened.
- **Animated Reveal**: A custom, dramatic "unveiling" animation delivers the emotional payoff you've been waiting for.
- **Curated Experience**: Memories are revealed sequentially, telling the story of that moment in time just as you saved it.
```

---

```

## 🚀 Advanced & Unique Features

### 🗺️ **Map of Memories (Optional Extension)**

- **Geotag Your Past**: Tag each capsule with the location it was created.
- **Interactive World Map**: Visualize where in the world your past selves have left messages, creating a global journal of your life's journey.

### 💫 **Futuristic Minimalism Design**

- **Immersive Dark Theme**: Deep space blues and purples create a sense of introspection, time, and space.
- **Vibrant Accent Colors**: A single, bright accent color provides a clean, high-contrast, and futuristic feel.
- **Elegant Animations**: Smooth, choreographed animations using `Moti` and `React Native Reanimated` make the app feel alive and responsive.
- **Custom Iconography**: Minimalist, line-art icons ensure a consistent and uncluttered visual language.

```

---

```

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React Native 0.79.1**: For building a truly native cross-platform application.
- **Expo SDK 53 (Managed Workflow)**: Simplifies development, building, and deployment.
- **TypeScript 5.8**: For robust, scalable, and type-safe code.
- **Expo Router 5**: File-based routing for clean navigation logic.
- **Zustand 5**: Minimalist, fast, and scalable state management.
- **React Native Reanimated 3 & Moti**: For creating beautiful, high-performance 60fps animations.
- **Shopify FlashList**: For high-performance list rendering in the Vault.
- **Lucide Icons**: A clean and consistent icon set.

### **Backend & Security (Proposed)**
- **Storage**: Firebase Storage or AWS S3 for secure, long-term storage of multimedia content.
- **Database**: Firestore or DynamoDB for managing capsule metadata and user information.
- **Scheduled Unlocking**: Cloud Functions (Firebase/AWS Lambda) to trigger push notifications and make decryption keys available on schedule.
- **Encryption**: Implement AES-256 encryption for all capsule content, ensuring only the user can access their memories.

### **Development Tools**
- **Expo CLI**: For a seamless local development experience.
- **EAS Build**: For creating production-ready builds for iOS and Android in the cloud.
- **EAS Submit**: For submitting the app to the Apple App Store and Google Play Store.
- **ESLint & Prettier**: For maintaining high code quality and consistency.
```

---

```
## 📱 Screenshots & Demo

<div align="center" style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <figure>
    <img src="image_73c8cf.png" alt="The Vault" width="250">
    <figcaption><em>The Vault: Your collection of sealed capsules with live countdowns.</em></figcaption>
  </figure>
  <figure>
    <img src="image_73c983.png" alt="Capsule Creation" width="250">
    <figcaption><em>Step 1: Naming your capsule and setting the unlock date.</em></figcaption>
  </figure>
  <figure>
    <img src="image_73cc8f.png" alt="Add Memories" width="250">
    <figcaption><em>Step 2: Adding photos, voice notes, text, and location.</em></figcaption>
  </figure>
  <figure>
    <img src="image_73cce9.png" alt="Review & Seal" width="250">
    <figcaption><em>Step 3: The final review before sealing your memories away.</em></figcaption>
  </figure>
</div>
```

---

````
## 🚀 Quick Start Guide

### **Prerequisites**

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### **Installation**

```bash
# Clone the repository
git clone [https://github.com/your-username/time-capsule-app.git](https://github.com/your-username/time-capsule-app.git)
cd time-capsule-app

# Install dependencies
npm install

# Start the development server
npm run dev
````

---

```

🎯 Project Roadmap
[x] Core UI/UX: Vault, multi-step creation flow, and profile screen.

[x] State Management: Implement global state with Zustand.

[x] Date Selection: Add interactive calendar for unlock date.

[ ] Multimedia Implementation:

[ ] Integrate expo-image-picker for photo/video selection.

[ ] Integrate expo-av for voice memo recording and playback.

[ ] Integrate expo-location for location tagging.

[ ] Backend Integration:

[ ] Set up Firebase/AWS for storage and database.

[ ] Implement secure user authentication.

[ ] Upload media to cloud storage upon sealing.

[ ] Encryption Layer:

[ ] Implement client-side encryption (AES-256) before uploading.

[ ] Securely manage decryption keys, making them available only on the unlock date.

[ ] Unlocking Ceremony:

[ ] Integrate push notifications via Firebase Cloud Messaging.

[ ] Trigger the UnlockCeremony component for ready capsules.

[ ] Map of Memories: Implement the map view for geotagged capsules.
```

📄 License

```

```
