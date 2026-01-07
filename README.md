# 🖥️ OS-Nexus: Interactive Operating Systems Visualizer

![Project Status](https://img.shields.io/badge/status-live-success?style=for-the-badge&color=2ea44f)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/tech-React%20%7C%20Tailwind%20%7C%20Framer%20Motion-blueviolet?style=for-the-badge)

> **Visualize the invisible logic of your computer.**

**OS-Nexus** is a gamified, interactive Single Page Application (SPA) designed to visualize complex Operating Systems algorithms. Built with a "Cyberpunk/Hacker Terminal" aesthetic, it helps students and developers understand scheduling logic through real-time simulation.

---

## 🚀 Live Demo

**Experience the simulation in your browser:**
### [👉 Launch OS-Nexus App](https://os-nexus-visualizer.lovable.app)

---

## 🌟 Key Features

### 1. 🧠 CPU Scheduler (Priority Preemptive)
Visualize how the CPU handles processes based on priority and arrival time.
* **Real-time Gantt Chart:** Watch processes execute and get preempted tick-by-tick.
* **Dynamic Inputs:** Add custom processes with Arrival Time, Burst Time, and Priority.
* **Smart Metrics:** Automatically calculates Average Waiting Time and Turnaround Time.
* **Algorithm Logic:** Implements true preemptive logic (time-step simulation), strictly adhering to OS principles.

### 2. 💾 Disk Controller (C-SCAN)
Visualize how a disk arm moves to service read/write requests.
* **Interactive Disk Head:** Animated marker moving across tracks (0-199).
* **Visual Jump:** Clearly distinguishes the "Flyback" (End -> Start) from regular seek operations.
* **Seek Calculation:** precise computation of total seek operations including the circular jump.

### 3. 🎓 Knowledge Check (Quiz)
A gamified way to test your understanding.
* **Interactive Cards:** Flip cards to reveal answers and detailed explanations.
* **Score Tracking:** Keeps track of your correct answers during the session.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React + Vite |
| **Styling** | Tailwind CSS (Cyberpunk/Dark Mode Theme) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

---

## 📦 Installation & Setup

Running this project locally is simple. Prerequisite: Node.js installed.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YourUsername/os-nexus-visualizer.git](https://github.com/YourUsername/os-nexus-visualizer.git)
    cd os-nexus-visualizer
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    > Open your browser and navigate to `http://localhost:5173`.

---

## 👥 Collaborators

| Name | USN |
| :--- | :--- |
| **Dhanush J** | 1RF24IS030 |
| **Dhruv Ajay Hangal** | 1RF24IS031 |
| **Arjun** | 1RF24IS020 |
| **Jeevan V** | 1RF24IS045 |

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new algorithms (like Round Robin or Banker's Algorithm), feel free to fork the repo and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewAlgorithm`)
3.  Commit your Changes (`git commit -m 'Add Round Robin Visualizer'`)
4.  Push to the Branch (`git push origin feature/NewAlgorithm`)
5.  Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">
  <br/>
  <i>Built with ❤️ for OS Students everywhere.</i>
</div>
