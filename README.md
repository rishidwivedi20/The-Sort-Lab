# The Sort Lab 🧪✨

A high-performance, developer-oriented interactive **Sorting Algorithm Visualizer** built with **React**, **TypeScript**, and **Vite**. 

By offloading heavy computation steps of sorting algorithms to **Web Workers**, **The Sort Lab** ensures silky-smooth 60 FPS UI rendering, even when handling large arrays or multiple simultaneous sorting operations.

---

## 🚀 Key Features

* **⚡ Thread-Isolated Sorting**: Uses Web Workers to compute sorting steps in a separate background thread. The main UI remains fully responsive, preventing browser layout locks.
* **📊 Visual Comparison Mode**: Compare two different algorithms side-by-side on the same initial data distribution.
* **📈 Benchmarking Arena**: Run performance stress-tests across multiple algorithms simultaneously with custom array sizes and value distributions (random, sorted, reversed, nearly sorted).
* **🎨 Clean & Responsive Dark Mode**: Sleek modern UI built with Tailwind CSS, custom color palettes, and micro-animations.
* **🛡️ Type-Safe Architecture**: Written entirely in TypeScript for structured type definitions, interfaces, and compile-time correctness.
* **🏷️ Stability Tracking**: Toggle stability labels to visually monitor whether equal keys maintain their relative order during the sorting process.

---

## 🛠️ Algorithms Implemented

| Category | Algorithm | Time Complexity (Best) | Time Complexity (Average) | Time Complexity (Worst) | Space Complexity | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Basic** | **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| | **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No |
| | **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| **Intermediate** | **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes |
| | **Quick Sort (Lomuto)** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No |
| | **Heap Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No |
| **Advanced** | **Counting Sort** | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | Yes |
| | **Radix Sort (LSD)** | $O(d(n + k))$ | $O(d(n + k))$ | $O(d(n + k))$ | $O(n + k)$ | Yes |
| | **Shell Sort** | $O(n \log n)$ | $O(n^{4/3})$ | $O(n^2)$ | $O(1)$ | No |
| | **Bucket Sort** | $O(n + k)$ | $O(n + k)$ | $O(n^2)$ | $O(n)$ | Yes |

---

## 💻 Tech Stack

* **Frontend Library**: React 18+
* **Build System**: Vite (lightning-fast HMR)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Concurrency**: Web Workers API (native Javascript workers compiled through Vite)

---

## ⚙️ Getting Started

### 📋 Prerequisites
Ensure you have Node.js installed on your machine (v18.x or higher is recommended).

### 🔧 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rishidwivedi20/The-Sort-Lab.git
   ```
2. Navigate to the project directory:
   ```bash
   cd "The Sort Lab"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 🚀 Running Local Dev Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to start experimenting.

### 📦 Production Build
Compile and optimize the application for deployment:
```bash
npm run build
```
The optimized files will be built into the `dist/` directory.

---

## 📂 Project Structure

```
├── public/                # Static assets (favicons, icons)
├── src/
│   ├── algorithms/        # Sorting algorithms (basic, intermediate, advanced)
│   ├── assets/            # App assets
│   ├── components/        # Reusable UI (Canvas, ControlPanel, Benchmark, etc.)
│   ├── hooks/             # Custom hooks (theme management, controller state)
│   ├── pages/             # App Pages (Dashboard)
│   ├── types/             # Common TypeScript interfaces
│   ├── utils/             # Helper utilities (generators, worker helpers)
│   └── workers/           # Web Worker scripts for background processing
├── index.html             # Main HTML Template
├── tailwind.config.js     # Tailwind Configuration
└── tsconfig.json          # TypeScript Configuration
```
