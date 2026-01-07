# OS-Nexus: Interactive Operating Systems Visualizer

![Project Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech Stack](https://img.shields.io/badge/tech-React%20%7C%20Tailwind%20%7C%20Framer%20Motion-blueviolet)

**OS-Nexus** is a gamified, interactive Single Page Application (SPA) designed to visualize complex Operating Systems algorithms. Built with a "Cyberpunk/Hacker Terminal" aesthetic, it helps students and developers understand scheduling logic through real-time simulation.

## 🚀 Live Demo
**Check out the live application here:**
[**https://os-nexus-visualizer.lovable.app**](https://os-nexus-visualizer.lovable.app)

## 🌟 Key Features

### 1. 🧠 CPU Scheduler (Priority Preemptive)
Visualize how the CPU handles processes based on priority and arrival time.
* **Real-time Gantt Chart:** Watch processes execute and get preempted in real-time.
* **Dynamic Inputs:** Add custom processes with Arrival Time, Burst Time, and Priority.
* **Metrics:** Automatically calculates Average Waiting Time and Turnaround Time.
* **Algorithm Logic:** Implements true preemptive logic (time-step simulation), breaking ties with FCFS.

### 2. 💾 Disk Controller (C-SCAN)
Visualize how a disk arm moves to service read/write requests.
* **Interactive Disk Head:** Animated marker moving across tracks (0-199).
* **Visual Jump:** Clearly distinguishes the "Flyback" (End -> Start) from regular seek operations.
* **Seek Calculation:** Computes total seek operations including the circular jump.

### 3. 🎓 Knowledge Check (Quiz)
A gamified way to test your understanding.
* **Interactive Cards:** Flip cards to reveal answers and detailed explanations.
* **Score Tracking:** Keeps track of your correct answers in the session.

## 🛠️ Tech Stack
* **Frontend Framework:** React + Vite
* **Styling:** Tailwind CSS (Cyberpunk/Dark Mode Theme)
* **Animations:** Framer Motion (Smooth transitions and data visualization)
* **Icons:** Lucide React

## 📦 Installation & Setup

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
    Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing
Contributions are welcome! If you have ideas for new algorithms (like Round Robin or Banker's Algorithm), feel free to fork the repo and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewAlgorithm`)
3.  Commit your Changes (`git commit -m 'Add Round Robin Visualizer'`)
4.  Push to the Branch (`git push origin feature/NewAlgorithm`)
5.  Open a Pull Request

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---
*Built with ❤️ for OS Students everywhere.*
