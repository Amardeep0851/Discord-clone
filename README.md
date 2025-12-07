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
  <img width="1909" height="863" alt="loginpage" src="https://github.com/user-attachments/assets/626309ab-bb1c-474e-bc44-d30205340104" />

- **Home Page – Dark Mode**  
  <img width="1917" height="855" alt="home-black" src="https://github.com/user-attachments/assets/7ad2d6aa-09be-4f40-9c57-19fbec0d8fc5" />


- **Home Page – Light Mode**  
 <img width="1919" height="871" alt="home white" src="https://github.com/user-attachments/assets/6993c56e-b1c0-452e-a0ac-09f3559e95ba" />


- **Server Settings Menu**  
  <img width="1919" height="854" alt="Screenshot 2025-11-15 105657" src="https://github.com/user-attachments/assets/f094206a-f72c-4104-86d0-73dcc168d70b" />


- **Edit Server Info**  
  <img width="1918" height="862" alt="server setting" src="https://github.com/user-attachments/assets/a329abc9-a133-4375-a899-552dc25fd2ee" />


- **Invite User Link Generation**  
  <img width="1919" height="862" alt="invite" src="https://github.com/user-attachments/assets/cd597e84-9e5c-4333-9681-d99af71e8027" />


- **User Management Dialog**  
  <img width="1917" height="855" alt="user role" src="https://github.com/user-attachments/assets/2c28b57d-5550-44e1-a393-ef8e599059bf" />


- **Create Channel**  
  <img width="1919" height="852" alt="create channel" src="https://github.com/user-attachments/assets/fc076aef-897c-4d3b-ab8b-1330a6593a67" />


- **Realtime message in channel**  
  <img width="1919" height="875" alt="two user" src="https://github.com/user-attachments/assets/fa5e2c7b-9fae-424c-a4df-2d4b0f8d9937" />


- **Direct Messaging**  
  <img width="1919" height="890" alt="directly message" src="https://github.com/user-attachments/assets/d6a215c6-faa7-404a-bdcc-8d2b148aba1c" />


- **Mobile View**  
  <img width="804" height="857" alt="mobile " src="https://github.com/user-attachments/assets/21aa7a92-6a04-4536-a2bd-952fc4093dc5" />


- **Mobile View With Menu**  
  <img width="795" height="846" alt="mobile 2" src="https://github.com/user-attachments/assets/043fd819-5aa1-4525-918f-e10a0ce6dfb3" />

---

## 🎥 Demo Video

🎬 Full Walkthrough:  
**Video will be added soon**
---
