import { Quiz } from '../types';

export const STARTER_QUIZZES: Quiz[] = [
  {
    id: 'rit-cse-dsa',
    title: 'Data Structures & Algorithms (RIT CSE / IT)',
    description: 'RIT Autonomous Curriculum aligned: Asymptotic complexity, Balanced Trees, Dynamic Programming, and Graph Traversal algorithms.',
    courseTag: 'CS3301 / CS3351',
    category: 'RIT CSE & IT',
    timePerQuestionSec: 25,
    createdAt: '2025-09-01',
    isCustom: false,
    playsCount: 248,
    bestScore: 94,
    questions: [
      {
        id: 'rit-cs-q1',
        question: 'In RIT Autonomous Regulation Data Structures, what is the tightest worst-case time complexity of finding an element in an AVL Tree with n nodes?',
        type: 'multiple_choice',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
        correctAnswerIndex: 0,
        explanation: 'Because an AVL tree maintains a balance factor of {-1, 0, +1} through rotations after insertions/deletions, its height is strictly bounded by 1.44 log₂(n), ensuring guaranteed O(log n) worst-case lookups.',
        monkeyHint: 'RIT CSE reminder: AVL trees are strictly height-balanced, avoiding skewing!'
      },
      {
        id: 'rit-cs-q2',
        question: 'Which graph algorithm computes the single-source shortest path in a directed acyclic graph (DAG) in linear O(V + E) time?',
        type: 'multiple_choice',
        options: ['Topological Sort followed by edge relaxation', 'Dijkstra with a Fibonacci Heap', 'Bellman-Ford Algorithm', 'Floyd-Warshall All-Pairs'],
        correctAnswerIndex: 0,
        explanation: 'By finding a topological ordering of vertices in O(V + E) and then relaxing edges in topological sequence, shortest paths in a DAG can be computed in single-pass linear time without cycles.',
        monkeyHint: 'Think about ordering vertices linearly before relaxing edges!'
      },
      {
        id: 'rit-cs-q3',
        question: 'True or False: In a Max-Heap array representation with 1-based indexing, the parent of a node at index i is always at Math.floor(i / 2).',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True. In binary heaps stored as contiguous arrays, node i has left child 2i, right child 2i + 1, and parent Math.floor(i / 2).',
        monkeyHint: 'Standard binary heap arithmetic used in heapsort labs at RIT!'
      },
      {
        id: 'rit-cs-q4',
        question: 'What dynamic programming paradigm is utilized in the 0/1 Knapsack problem versus Fractional Knapsack?',
        type: 'multiple_choice',
        options: ['0/1 Knapsack uses DP; Fractional Knapsack uses a Greedy Approach', '0/1 uses Greedy; Fractional uses Dynamic Programming', 'Both require Divide and Conquer with O(n³)', 'Fractional uses Backtracking with Branch & Bound'],
        correctAnswerIndex: 0,
        explanation: '0/1 Knapsack lacks the greedy-choice property due to item indivisibility and requires DP. Fractional Knapsack can be solved greedily by sorting value/weight ratio.',
        monkeyHint: 'Can you cut items into pieces? If yes, greedy works!'
      },
      {
        id: 'rit-cs-q5',
        question: 'What is the minimum number of queues needed to implement a Last-In-First-Out (LIFO) Stack data structure?',
        type: 'multiple_choice',
        options: ['Two standard queues (or one with cyclic rotation)', 'At least three priority queues', 'Zero, only linked list nodes', 'Four circular queues'],
        correctAnswerIndex: 0,
        explanation: 'A stack can be simulated with two standard FIFO queues by transferring elements during push/pop, or one queue using rotation of length n-1 during push.',
        monkeyHint: 'Classic RIT Autonomous lab interview & viva question!'
      }
    ]
  },
  {
    id: 'rit-aids-ml',
    title: 'Machine Learning & Neural Architectures (RIT AI & DS)',
    description: 'Foundations of Deep Learning: Backpropagation gradients, attention mechanisms, loss functions, and regularization.',
    courseTag: 'AD3401 / AI3401',
    category: 'RIT AI & DS',
    timePerQuestionSec: 25,
    createdAt: '2025-09-02',
    isCustom: false,
    playsCount: 215,
    bestScore: 90,
    questions: [
      {
        id: 'rit-ai-q1',
        question: 'In the Transformer architecture (Vaswani et al.), how is Scaled Dot-Product Attention computed for queries Q, keys K, and values V?',
        type: 'multiple_choice',
        options: [
          'softmax( (Q K^T) / sqrt(d_k) ) * V',
          'sigmoid( (Q * K) / d_k ) + V',
          'tanh( Q + K ) * V',
          'ReLU( Q K^T ) / d_k'
        ],
        correctAnswerIndex: 0,
        explanation: 'Scaled Dot-Product Attention calculates compatibility matrix Q K^T, scales by 1/sqrt(d_k) to prevent softmax saturation in high dimensions, and applies softmax weights to V.',
        monkeyHint: 'The scaling factor sqrt(d_k) stops dot products from growing excessively large!'
      },
      {
        id: 'rit-ai-q2',
        question: 'Which activation function is specifically designed to eliminate the vanishing gradient problem in deep hidden layers while maintaining fast computational speed?',
        type: 'multiple_choice',
        options: ['Rectified Linear Unit (ReLU)', 'Sigmoid Logistic Function', 'Hyperbolic Tangent (Tanh)', 'Linear Identity'],
        correctAnswerIndex: 0,
        explanation: 'ReLU (f(x) = max(0, x)) has constant derivative 1 for positive inputs, avoiding gradient attenuation over many backpropagation steps compared to sigmoid or tanh.',
        monkeyHint: 'Max of 0 and x — the standard staple of modern CNNs and MLPs!'
      },
      {
        id: 'rit-ai-q3',
        question: 'What is the primary effect of adding L2 regularization (Ridge / Weight Decay) to the model loss function?',
        type: 'multiple_choice',
        options: [
          'Penalizes large weight magnitudes by adding λ Σ(w_i²), preventing overfitting',
          'Forces individual feature weights to become exactly zero (sparse feature selection)',
          'Transforms all negative weights to positive values',
          'Eliminates the bias term in neural network neurons'
        ],
        correctAnswerIndex: 0,
        explanation: 'L2 regularization adds the sum of squared weights to the cost function, shrinking coefficients smoothly toward zero to reduce model variance. L1 (Lasso) promotes exact zeros.',
        monkeyHint: 'L2 shrinks all weights smoothly, while L1 makes weights strictly zero!'
      },
      {
        id: 'rit-ai-q4',
        question: 'True or False: In binary classification, Precision is defined as True Positives divided by (True Positives + False Positives).',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True. Precision = TP / (TP + FP), measuring out of all positive predictions how many were actual positives. Recall is TP / (TP + FN).',
        monkeyHint: 'Precision focuses on predicted positives: how accurate are our alarm rings?'
      }
    ]
  },
  {
    id: 'rit-ece-signals',
    title: 'Signals & Systems & Microcontrollers (RIT ECE & EEE)',
    description: 'Fourier Transforms, Nyquist Sampling, ARM Cortex architecture, and Digital Signal Processing fundamentals.',
    courseTag: 'EC3354 / EE3402',
    category: 'RIT ECE & EEE',
    timePerQuestionSec: 25,
    createdAt: '2025-09-03',
    isCustom: false,
    playsCount: 189,
    bestScore: 88,
    questions: [
      {
        id: 'rit-ec-q1',
        question: 'According to the Nyquist-Shannon sampling theorem, what is the minimum sampling frequency required to reconstruct a signal band-limited to 8 kHz without aliasing?',
        type: 'multiple_choice',
        options: ['16 kHz (2 * f_max)', '8 kHz', '4 kHz', '32 kHz'],
        correctAnswerIndex: 0,
        explanation: 'Nyquist rate f_s >= 2 * f_max. For a maximum frequency component of 8 kHz, the minimum sampling rate without aliasing distortion is 2 * 8 = 16 kHz.',
        monkeyHint: 'Double the maximum frequency: f_s >= 2 * f_max!'
      },
      {
        id: 'rit-ec-q2',
        question: 'In Linear Time-Invariant (LTI) systems, what mathematical operation between the input signal x(t) and system impulse response h(t) determines the output y(t)?',
        type: 'multiple_choice',
        options: ['Convolution Integral', 'Pointwise Cross Multiplication', 'Laplace Subtraction', 'Autoregressive Differentiation'],
        correctAnswerIndex: 0,
        explanation: 'For continuous-time LTI systems, the output y(t) is given by the convolution integral ∫ x(τ) h(t - τ) dτ. In discrete time, it is convolution summation.',
        monkeyHint: 'Flip, shift, multiply, and integrate!'
      },
      {
        id: 'rit-ec-q3',
        question: 'In an embedded ARM Cortex-M architecture micro-controller, what register holds the address of the next machine instruction to be executed?',
        type: 'multiple_choice',
        options: ['Program Counter (PC / R15)', 'Link Register (LR / R14)', 'Stack Pointer (SP / R13)', 'Control Register (CONTROL)'],
        correctAnswerIndex: 0,
        explanation: 'R15 is the Program Counter (PC), holding the address of the currently executing/next fetched instruction. R14 is LR for function return addresses.',
        monkeyHint: 'R15 holds the address of the instruction being fetched!'
      }
    ]
  },
  {
    id: 'rit-mech-thermo',
    title: 'Thermodynamics & Fluid Dynamics (RIT Mech & Civil)',
    description: 'Second Law of Thermodynamics, Rankine / Carnot cycles, Bernoulli principle, and Strength of Materials.',
    courseTag: 'ME3391 / CE3301',
    category: 'RIT Mech & Civil',
    timePerQuestionSec: 25,
    createdAt: '2025-09-04',
    isCustom: false,
    playsCount: 164,
    bestScore: 92,
    questions: [
      {
        id: 'rit-me-q1',
        question: 'What is the theoretical thermal efficiency of a Carnot heat engine operating between a heat source at 600 K and a cold sink at 300 K?',
        type: 'multiple_choice',
        options: ['50% (η = 1 - T_c / T_h)', '66.7%', '100%', '33.3%'],
        correctAnswerIndex: 0,
        explanation: 'Carnot efficiency η = 1 - (T_c / T_h) = 1 - (300 / 600) = 0.50 or 50%. This represents the upper thermodynamic limit for any cyclic heat engine.',
        monkeyHint: '1 minus ratio of sink to source absolute temperatures in Kelvin!'
      },
      {
        id: 'rit-me-q2',
        question: 'Along a steady, incompressible, frictionless streamline, which equation expresses the conservation of mechanical energy as P + (1/2)ρv² + ρgh = constant?',
        type: 'multiple_choice',
        options: ['Bernoulli’s Equation', 'Navier-Stokes Conservation Form', 'Poiseuille’s Law', 'Euler-Lagrange Equation'],
        correctAnswerIndex: 0,
        explanation: 'Bernoulli’s equation relates static pressure, dynamic pressure (kinetic energy per unit volume), and hydrostatic head (potential energy per unit volume) along an inviscid streamline.',
        monkeyHint: 'Named after the 18th-century Swiss mathematician and physicist!'
      },
      {
        id: 'rit-me-q3',
        question: 'True or False: In Mohr’s Circle for plane stress analysis, the center of the circle on the normal stress axis is situated at ((σ_x + σ_y) / 2, 0).',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True. In Strength of Materials, the center of Mohr’s Circle lies at the average normal stress σ_avg = (σ_x + σ_y)/2 on the horizontal axis with zero shear stress.',
        monkeyHint: 'The average normal stress gives the coordinates of the circle center!'
      }
    ]
  },
  {
    id: 'rit-campus-trivia',
    title: 'RIT Rajapalayam Campus Traditions & Engineering Lore',
    description: 'Ramco Institute of Technology (Autonomous) campus culture, department symposiums, tech fests, Autonomous exam hacks, and hostel life!',
    courseTag: 'RIT 101',
    category: 'RIT Campus Life',
    timePerQuestionSec: 20,
    createdAt: '2025-09-05',
    isCustom: false,
    playsCount: 380,
    bestScore: 100,
    questions: [
      {
        id: 'rit-lore-q1',
        question: 'Ramco Institute of Technology (RIT) is situated in which scenic Tamil Nadu town backed by the Western Ghats?',
        type: 'multiple_choice',
        options: ['Rajapalayam, Virudhunagar District', 'Coimbatore', 'Madurai', 'Tirunelveli'],
        correctAnswerIndex: 0,
        explanation: 'Ramco Institute of Technology was founded by the prestigious Ramco Group and is located along the foothills of the Western Ghats on North Vaganallur Road in Rajapalayam.',
        monkeyHint: 'Known worldwide for the famous Rajapalayam hound breed and textile mills!'
      },
      {
        id: 'rit-lore-q2',
        question: 'What is the premier National Level Technical Symposium organized annually by the Department of Computer Science & Engineering at RIT?',
        type: 'multiple_choice',
        options: ['TechYuga / CS Symposium', 'Kurukshetra', 'Pragyan', 'Shaastra'],
        correctAnswerIndex: 0,
        explanation: 'RIT hosts flagship National Level Technical symposiums and conferences (such as TechYuga) bringing together engineering students across Tamil Nadu for coding, webathons, and paper presentations.',
        monkeyHint: 'RIT’s signature engineering extravaganza!'
      },
      {
        id: 'rit-lore-q3',
        question: 'What is the best revision strategy approved by the RIT Genius Monkey mascot for scoring high marks in RIT Autonomous End-Semester exams?',
        type: 'multiple_choice',
        options: [
          'Solving past RIT Autonomous question papers + Active Recall with Genius Monkey',
          'Cramming photocopied notes 20 minutes before entering the exam hall',
          'Reading random social media summaries without practicing derivations',
          'Memorizing question numbers instead of solving engineering equations'
        ],
        correctAnswerIndex: 0,
        explanation: 'Active recall, derivation practice, and solving previous RIT Autonomous examination papers with spaced repetition gives RIT students guaranteed S/A grades without exam panic!',
        monkeyHint: 'Practice previous RIT Autonomous papers with active testing!'
      },
      {
        id: 'rit-lore-q4',
        question: 'True or False: The state-of-the-art campus of RIT features specialized Center of Excellence (CoE) labs in AI, IoT, Robotics, and Dassault 3D Design.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'True! Ramco Institute of Technology features cutting-edge industrial collaborative labs and Centers of Excellence partnering with industry leaders to give students real-world exposure.',
        monkeyHint: 'Industrial labs are a signature pride of the Ramco Group heritage!'
      }
    ]
  }
];

export const COLLEGE_SUBJECTS = [
  'RIT CSE & IT',
  'RIT AI & DS',
  'RIT ECE & EEE',
  'RIT Mech & Civil',
  'RIT Autonomous Syllabus',
  'Core Engineering',
  'RIT Campus Life',
  'Custom'
] as const;

export const MONKEY_RANKS = [
  { name: 'RIT First Year Chimp 🐒', minScore: 0, desc: 'Freshman at RIT Rajapalayam, finding classrooms & labs' },
  { name: 'Sophomore Engineer Simian 🐵', minScore: 250, desc: 'Mastering internal assessments and circuit/code labs' },
  { name: 'Junior Tech Scholar 🦍', minScore: 700, desc: 'Project expo champion and RIT Autonomous semester ace' },
  { name: 'Senior Placement Sage 🦧', minScore: 1400, desc: 'Campus placement ready with high cognitive problem-solving' },
  { name: 'Dean of RIT Bananas 🎓🐵', minScore: 2500, desc: 'RIT Legend, tops department curves and national symposiums' },
  { name: 'Ramco Gold Medalist Monkey 🌟👑', minScore: 4000, desc: 'Highest Academic Honor of Ramco Institute of Technology' },
];

export function calculateMonkeyRank(bananas: number) {
  for (let i = MONKEY_RANKS.length - 1; i >= 0; i--) {
    if (bananas >= MONKEY_RANKS[i].minScore) {
      return MONKEY_RANKS[i];
    }
  }
  return MONKEY_RANKS[0];
}
