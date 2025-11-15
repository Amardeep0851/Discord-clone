# 💬 Discord Clone – Real-Time Messaging Platform

A full-stack, real-time communication platform inspired by Discord.  
Built with **Next.js**, **Clerk**, **WebSockets**, **role-based permissions**, and a modern UI powered by **Tailwind + Shadcn UI**.

This project includes servers, channels, real-time messaging, file uploads, roles, admin controls, and direct messaging — all wrapped in a clean, modern interface with dark/light theme support.

---

## 🚀 Tech Stack & Libraries

### **Frontend**
- **Next.js 15**
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion / Motion**
- **Shadcn UI Components**  
- **Lucide React** (Icons)
- **next-themes** (Dark/Light Mode)
- **clsx**, **tailwind-merge**, **class-variance-authority**
- **axios**
- **react-use**

### **Forms & Validation**
- **react-hook-form**
- **@hookform/resolvers**
- **zod**

### **Auth**
- **Clerk** (User login, signup, sessions)

### **Messaging**
- **WebSockets**
- **TanStack React Query** (caching, real-time updates)

### **Security**
- **DOMPurify** for sanitizing user-generated content

---

## 🧩 Features

### 🔐 **Authentication**
- User sign-up / login with Clerk  
- User data stored in database  
- Secure session handling

---

### 🏛️ **Server Management**
- Create server  
- Upload server image  
- Rename server  
- Delete server  
- Leave server (for guests not admin)

---

### 🔊 **Channels**
Each server supports multiple channels:

- Text channels  
- Audio channels  
- Video channels  

Admins can:
- Create channels  
- Delete channels  

---

### 💬 **Real-Time Messaging**
- WebSocket-powered live messaging  
- Text messages  
- Emoji support  
- File uploads (images, PDFs)  
- Edit your own messages  
- Delete your own messages  
- Admin/owner can delete any message  

React Query keeps messages cached and only updates on new events.

---

### 🧑‍🤝‍🧑 **Roles & Permissions**
Role system includes:
- **Owner**
- **Admin**
- **Moderator**
- **Guest**

Permissions:
- Owners & Admins can delete any message  
- Only message author can edit  
- Admin can promote/demote users  
- Admin can remove a member  
- Multiple moderate users allowed  
- Guest can leave server  
- Only admin/owner can delete channels or server  

---

### 📩 **Direct Messaging**
Users can:
- Send direct messages to anyone inside the same server  
- Chat in real time  
- Share files and emoji  

---

### 🎨 **Theme Support**
Two themes:
- **Dark mode**
- **Light mode**


---
## 📸 Screenshots

- **Create New Account Page**  
  ![Create New Account](/screenshots/loginpage.png)

- **Home Page – Dark Mode**  
  ![Home Dark](/screenshots/home-black.png)

- **Home Page – Light Mode**  
  ![Home Light](/screenshots/home-white.png)

- **Server Settings Menu**  
  ![Server Settings Menu](/screenshots/Screenshot-2025-11-15-105657.png)

- **Edit Server Info**  
  ![Edit Server](/public/screenshots/server-setting.png)

- **Invite User Link Generation**  
  ![Invite](/screenshots/invite.png)

- **User Management Dialog**  
  ![User Roles](/screenshots/user-role.png)

- **Create Channel**  
  ![Create Channel](/screenshots/create-channel.png)

- **Realtime message in channel**  
  ![Realtime Messages](/screenshots/two-user.png)

- **Direct Messaging**  
  ![DM](/screenshots/directly-message.png)

- **Mobile View**  
  ![Mobile 1](/screenshots/mobile.png)

- **Mobile View With Menu**  
  ![Mobile 2](/screenshots/mobile-2.png)
---

## 🎥 Demo Video

🎬 Full Walkthrough:  
**Video will be uploaded soon**
---

## ⚙️ Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/your-username/discord-clone.git
cd discord-clone
