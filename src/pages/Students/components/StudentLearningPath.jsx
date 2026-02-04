import React, { useState } from "react";

const StudentLearningPath = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [expandedStepId, setExpandedStepId] = useState(null);

  // Toggle function for expanding steps
  const toggleStep = (stepId) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const skillsData = [
    { 
      id: 1, name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
      steps: [
        { id: "p1", title: "Syntax & Variables", desc: "Core basics.", subTopics: ["Indentation", "Comments", "Data Types", "Type Casting"] },
        { id: "p2", title: "Control Flow", desc: "Logic gates.", subTopics: ["If/Else", "Loops (For, While)", "Break/Continue"] },
        { id: "p3", title: "Data Structures", desc: "Built-in containers.", subTopics: ["Lists", "Tuples", "Dictionaries", "Sets"] },
        { id: "p4", title: "OOP", desc: "Object Oriented concepts.", subTopics: ["Classes", "Objects", "Inheritance", "Polymorphism"] },
        { id: "p5", title: "File Handling", desc: "I/O Operations.", subTopics: ["Read", "Write", "Append", "Context Managers"] },
        { id: "p6", title: "Modules", desc: "Code organization.", subTopics: ["Importing", "Pip", "Virtual Environments"] }
      ] 
    },
    { 
      id: 2, name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", 
      steps: [
        { id: "j1", title: "JVM Internals", desc: "Architecture.", subTopics: ["JDK", "JRE", "Bytecode", "Memory Mgmt"] },
        { id: "j2", title: "OOP Concepts", desc: "The pillars of Java.", subTopics: ["Abstraction", "Encapsulation", "Inheritance", "Polymorphism"] },
        { id: "j3", title: "Collections", desc: "Data storage.", subTopics: ["ArrayList", "HashMap", "HashSet", "Iterator"] },
        { id: "j4", title: "Multithreading", desc: "Concurrency.", subTopics: ["Threads", "Runnable", "Synchronization"] },
        { id: "j5", title: "Spring Boot", desc: "Modern Framework.", subTopics: ["Dependency Injection", "Annotations", "REST Controllers"] }
      ]
    },
    { 
      id: 3, name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
      steps: [
        { id: "js1", title: "ES6+ Syntax", desc: "Modern JS.", subTopics: ["Let/Const", "Arrow Functions", "Destructuring", "Spread Operator"] },
        { id: "js2", title: "Async JS", desc: "Handling time.", subTopics: ["Callbacks", "Promises", "Async/Await", "Event Loop"] },
        { id: "js3", title: "DOM Manipulation", desc: "Web interaction.", subTopics: ["Selectors", "Event Listeners", "Traversing DOM"] },
        { id: "js4", title: "Advanced", desc: "Deep dive.", subTopics: ["Closures", "Hoisting", "Prototypes", "This Keyword"] }
      ]
    },
    { 
      id: 4, name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
      steps: [
        { id: "r1", title: "Core Concepts", desc: "Building blocks.", subTopics: ["JSX", "Components", "Props", "State"] },
        { id: "r2", title: "Hooks", desc: "Functional power.", subTopics: ["useState", "useEffect", "useContext", "Custom Hooks"] },
        { id: "r3", title: "Routing", desc: "Navigation.", subTopics: ["React Router", "Dynamic Routes", "Protected Routes"] },
        { id: "r4", title: "State Management", desc: "Global data.", subTopics: ["Context API", "Redux Toolkit", "Zustand"] }
      ]
    },
    { 
      id: 5, name: "C Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", 
      steps: [
        { id: "c1", title: "Basics", desc: "Syntax.", subTopics: ["Data Types", "Operators", "Input/Output"] },
        { id: "c2", title: "Pointers", desc: "Memory addresses.", subTopics: ["Pointer Arithmetic", "Double Pointers", "Function Pointers"] },
        { id: "c3", title: "Memory Mgmt", desc: "Dynamic allocation.", subTopics: ["malloc", "calloc", "free", "Memory Leaks"] },
        { id: "c4", title: "Structs", desc: "Custom types.", subTopics: ["Structure Padding", "Typedef", "Unions"] }
      ]
    },
    { 
      id: 6, name: "Data Structures", icon: "https://cdn-icons-png.flaticon.com/512/3028/3028595.png", 
      steps: [
        { id: "ds1", title: "Complexity", desc: "Analysis.", subTopics: ["Big O Notation", "Time Complexity", "Space Complexity"] },
        { id: "ds2", title: "Linear DS", desc: "Sequential.", subTopics: ["Arrays", "Linked Lists", "Stacks", "Queues"] },
        { id: "ds3", title: "Trees", desc: "Hierarchical.", subTopics: ["Binary Trees", "BST", "AVL Trees", "Heaps"] },
        { id: "ds4", title: "Graphs", desc: "Networks.", subTopics: ["BFS", "DFS", "Dijkstra", "Adjacency Matrix"] }
      ]
    },
    { 
      id: 7, name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", 
      steps: [
        { id: "sq1", title: "Basic Queries", desc: "CRUD operations.", subTopics: ["SELECT", "INSERT", "UPDATE", "DELETE", "WHERE Clause"] },
        { id: "sq2", title: "Joins", desc: "Combining tables.", subTopics: ["Inner Join", "Left/Right Join", "Full Outer Join", "Self Join"] },
        { id: "sq3", title: "Aggregations", desc: "Grouping data.", subTopics: ["GROUP BY", "HAVING", "COUNT/SUM/AVG", "Window Functions"] },
        { id: "sq4", title: "Database Design", desc: "Structure.", subTopics: ["Normalization (1NF-3NF)", "Primary/Foreign Keys", "ER Diagrams"] },
        { id: "sq5", title: "Advanced", desc: "Optimization.", subTopics: ["Indexing", "Stored Procedures", "Triggers", "ACID Properties"] }
      ]
    },
    { 
      id: 8, name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", 
      steps: [
        { id: "ht1", title: "Structure", desc: "Document skeleton.", subTopics: ["Semantic Tags", "Block vs Inline", "Head/Body"] },
        { id: "ht2", title: "Forms", desc: "User input.", subTopics: ["Input Types", "Validation", "Labels", "Submit"] },
        { id: "ht3", title: "Media", desc: "Rich content.", subTopics: ["Audio", "Video", "Canvas", "SVG"] },
        { id: "ht4", title: "SEO & A11y", desc: "Best practices.", subTopics: ["Meta Tags", "ARIA Labels", "Alt Text"] }
      ]
    },
    { 
      id: 9, name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", 
      steps: [
        { id: "cs1", title: "Box Model", desc: "Layout basics.", subTopics: ["Margin", "Border", "Padding", "Content"] },
        { id: "cs2", title: "Flexbox", desc: "1D Layout.", subTopics: ["Justify Content", "Align Items", "Flex Direction"] },
        { id: "cs3", title: "Grid", desc: "2D Layout.", subTopics: ["Template Columns", "Grid Areas", "Gap"] },
        { id: "cs4", title: "Animations", desc: "Motion.", subTopics: ["Keyframes", "Transitions", "Transform"] }
      ]
    },
    { 
      id: 10, name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
      steps: [
        { id: "nd1", title: "Runtime", desc: "How Node works.", subTopics: ["Event Loop", "V8 Engine", "Non-blocking I/O"] },
        { id: "nd2", title: "Modules", desc: "File system.", subTopics: ["CommonJS vs ESM", "fs Module", "path Module", "OS Module"] },
        { id: "nd3", title: "Express.js", desc: "Web Framework.", subTopics: ["Routing", "Middleware", "Request/Response"] },
        { id: "nd4", title: "Auth", desc: "Security.", subTopics: ["JWT", "Passport.js", "Bcrypt", "Sessions"] }
      ]
    },
    { 
      id: 11, name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", 
      steps: [
        { id: "gt1", title: "Basics", desc: "Version control.", subTopics: ["init", "add", "commit", "status"] },
        { id: "gt2", title: "Branching", desc: "Parallel dev.", subTopics: ["branch", "checkout", "merge", "switch"] },
        { id: "gt3", title: "Collaboration", desc: "Remote repos.", subTopics: ["clone", "pull", "push", "Pull Requests"] },
        { id: "gt4", title: "Advanced", desc: "Fixing history.", subTopics: ["rebase", "cherry-pick", "stash", "reset"] }
      ]
    },
    { 
      id: 12, name: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", 
      steps: [
        { id: "ml1", title: "Data Prep", desc: "Cleaning data.", subTopics: ["NumPy", "Pandas", "Matplotlib", "Handling Nulls"] },
        { id: "ml2", title: "Supervised", desc: "Labeled learning.", subTopics: ["Linear Regression", "Logistic Regression", "Decision Trees"] },
        { id: "ml3", title: "Unsupervised", desc: "Pattern finding.", subTopics: ["K-Means Clustering", "PCA"] },
        { id: "ml4", title: "Deep Learning", desc: "Neural Networks.", subTopics: ["TensorFlow", "Keras", "CNNs", "RNNs"] }
      ]
    },
    { 
      id: 13, name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", 
      steps: [
        { id: "dk1", title: "Concepts", desc: "Containerization.", subTopics: ["Images vs Containers", "Daemon", "Registry"] },
        { id: "dk2", title: "Dockerfile", desc: "Blueprints.", subTopics: ["FROM", "RUN", "CMD", "COPY"] },
        { id: "dk3", title: "Compose", desc: "Orchestration.", subTopics: ["docker-compose.yml", "Services", "Volumes", "Networks"] }
      ]
    },
    { 
      id: 14, name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", 
      steps: [
        { id: "kb1", title: "Architecture", desc: "The cluster.", subTopics: ["Control Plane", "Worker Nodes", "Kubelet"] },
        { id: "kb2", title: "Objects", desc: "Core resources.", subTopics: ["Pods", "ReplicaSets", "Deployments", "Services"] },
        { id: "kb3", title: "Config", desc: "Settings.", subTopics: ["ConfigMaps", "Secrets", "Helm Charts"] }
      ]
    },
    { 
      id: 15, name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", 
      steps: [
        { id: "aw1", title: "Compute", desc: "Servers.", subTopics: ["EC2", "Lambda", "Elastic Beanstalk"] },
        { id: "aw2", title: "Storage", desc: "Data.", subTopics: ["S3", "EBS", "Glacier"] },
        { id: "aw3", title: "Database", desc: "Managed DB.", subTopics: ["RDS", "DynamoDB", "Aurora"] },
        { id: "aw4", title: "Network", desc: "Connectivity.", subTopics: ["VPC", "Route 53", "CloudFront"] }
      ]
    },
    { 
      id: 16, name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", 
      steps: [
        { id: "an1", title: "Kotlin", desc: "Language.", subTopics: ["Coroutines", "Null Safety", "Data Classes"] },
        { id: "an2", title: "UI", desc: "Layouts.", subTopics: ["Jetpack Compose", "XML Layouts", "Material Design"] },
        { id: "an3", title: "Architecture", desc: "Patterns.", subTopics: ["MVVM", "Clean Architecture", "ViewModel"] },
        { id: "an4", title: "Data", desc: "Persistence.", subTopics: ["Room DB", "Retrofit", "DataStore"] }
      ]
    },
    { 
      id: 17, name: "Swift (iOS)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg", 
      steps: [
        { id: "sw1", title: "Swift Basics", desc: "Language.", subTopics: ["Optionals", "Structs vs Classes", "Closures"] },
        { id: "sw2", title: "SwiftUI", desc: "Modern UI.", subTopics: ["Views", "State", "Binding", "Navigation"] },
        { id: "sw3", title: "Data", desc: "Storage.", subTopics: ["Core Data", "SwiftData", "UserDefaults"] },
        { id: "sw4", title: "Networking", desc: "API calls.", subTopics: ["URLSession", "Codable", "Async/Await"] }
      ]
    },
    { 
      id: 18, name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", 
      steps: [
        { id: "ts1", title: "Basics", desc: "Typing.", subTopics: ["Basic Types", "Interfaces", "Type Aliases"] },
        { id: "ts2", title: "Advanced", desc: "Power features.", subTopics: ["Generics", "Utility Types", "Enums"] },
        { id: "ts3", title: "Config", desc: "Setup.", subTopics: ["tsconfig.json", "Compiler Options", "Modules"] }
      ]
    },
    { 
      id: 19, name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", 
      steps: [
        { id: "mg1", title: "Document Model", desc: "JSON-like.", subTopics: ["Collections", "Documents", "BSON"] },
        { id: "mg2", title: "CRUD", desc: "Operations.", subTopics: ["Insert", "Find", "Update", "Delete"] },
        { id: "mg3", title: "Advanced", desc: "Performance.", subTopics: ["Aggregation Pipeline", "Indexing", "Sharding"] }
      ]
    },
    { 
      id: 20, name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", 
      steps: [
        { id: "fl1", title: "Dart", desc: "Language.", subTopics: ["Variables", "Functions", "OOP in Dart"] },
        { id: "fl2", title: "Widgets", desc: "UI building blocks.", subTopics: ["Stateless vs Stateful", "Scaffold", "Layouts"] },
        { id: "fl3", title: "State Mgmt", desc: "Data flow.", subTopics: ["Provider", "Riverpod", "Bloc"] }
      ]
    },
    { 
      id: 21, name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", 
      steps: [
        { id: "go1", title: "Basics", desc: "Syntax.", subTopics: ["Packages", "Variables", "Functions"] },
        { id: "go2", title: "Concurrency", desc: "Killer feature.", subTopics: ["Goroutines", "Channels", "WaitGroups"] },
        { id: "go3", title: "Web", desc: "Backend.", subTopics: ["net/http", "Gin/Fiber", "JSON Handling"] }
      ]
    },
    { 
      id: 22, name: "Rust", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg", 
      steps: [
        { id: "ru1", title: "Ownership", desc: "Memory safety.", subTopics: ["Move Semantics", "Borrowing", "Lifetimes"] },
        { id: "ru2", title: "Structure", desc: "Code org.", subTopics: ["Structs", "Enums", "Pattern Matching"] },
        { id: "ru3", title: "Systems", desc: "Low level.", subTopics: ["Concurrency", "Smart Pointers", "Unsafe Rust"] }
      ]
    },
    { 
      id: 23, name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", 
      steps: [
        { id: "gq1", title: "Schema", desc: "Definition.", subTopics: ["Types", "Queries", "Mutations"] },
        { id: "gq2", title: "Resolvers", desc: "Logic.", subTopics: ["Writing Resolvers", "Data Sources"] },
        { id: "gq3", title: "Client", desc: "Integration.", subTopics: ["Apollo Client", "Caching", "Fragments"] }
      ]
    },
    { 
      id: 24, name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", 
      steps: [
        { id: "lx1", title: "Terminal", desc: "CLI.", subTopics: ["Navigation (cd, ls)", "File Ops (cp, mv)", "Permissions"] },
        { id: "lx2", title: "Scripting", desc: "Automation.", subTopics: ["Bash Scripting", "Variables", "Loops"] },
        { id: "lx3", title: "Admin", desc: "System.", subTopics: ["Users/Groups", "Process Mgmt", "Networking"] }
      ]
    },
    { 
      id: 25, name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", 
      steps: [
        { id: "ng1", title: "Architecture", desc: "Structure.", subTopics: ["Modules", "Components", "Templates"] },
        { id: "ng2", title: "Data Binding", desc: "Communication.", subTopics: ["Interpolation", "Property Binding", "Event Binding"] },
        { id: "ng3", title: "Directives", desc: "DOM manipulation.", subTopics: ["*ngIf", "*ngFor", "Custom Directives"] }
      ]
    },
    { 
      id: 26, name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", 
      steps: [
        { id: "vu1", title: "Essentials", desc: "Core.", subTopics: ["Instance", "Template Syntax", "Computed Props"] },
        { id: "vu2", title: "Components", desc: "Building blocks.", subTopics: ["Props", "Events", "Slots"] },
        { id: "vu3", title: "Ecosystem", desc: "Tools.", subTopics: ["Vue Router", "Pinia", "Composition API"] }
      ]
    }
  ];

  return (
    <div className="p-4 md:p-6 font-mono text-slate-700 dark:text-slate-200 animate-fade-in">
      {selectedSkill ? (
        // --- CIRCUIT ROADMAP VIEW ---
        <div className="max-w-4xl mx-auto pb-16">
          <button 
            className="mb-8 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
            onClick={() => { setSelectedSkill(null); setExpandedStepId(null); }}
          >
            ← Back to Skills
          </button>
          
          <div className="flex items-center gap-6 mb-12 border-b border-dashed border-slate-300 dark:border-slate-700 pb-6">
            <div className="w-16 h-16 p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                <img src={selectedSkill.icon} alt={selectedSkill.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{selectedSkill.name} Protocol</h2>
              <p className="text-sm text-emerald-500 font-mono">Initializing learning sequence...</p>
            </div>
          </div>

          <div className="relative py-5 flex flex-col gap-10">
            {/* Main Vertical Trace */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700 -translate-x-1/2 z-0"></div>

            {selectedSkill.steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const isExpanded = expandedStepId === step.id;

              return (
                <div key={index} className={`relative z-10 flex w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Tech Chip Card */}
                  <div 
                    className={`w-[45%] md:w-[42%] cursor-pointer p-4 rounded-lg border border-slate-200 dark:border-slate-700 border-l-4 shadow-sm transition-all duration-300
                      ${isExpanded 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-emerald-500 shadow-md' 
                        : 'bg-white dark:bg-slate-800 border-l-emerald-500 hover:shadow-md'
                      }
                      ${isLeft ? 'mr-auto text-right' : 'ml-auto text-left'}
                    `}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className={`flex items-center justify-between mb-2 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-mono text-slate-400">0{index + 1}</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white m-0">{step.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.desc}</p>
                    
                    {/* Expandable Sub-Info */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <h5 className="text-xs text-indigo-500 font-bold uppercase mb-2">Key Concepts:</h5>
                            <ul className={`flex flex-col gap-1 ${isLeft ? 'items-end' : 'items-start'}`}>
                                {step.subTopics.map((topic, i) => (
                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300">• {topic}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Trace Connector */}
                    <div className={`absolute top-6 w-5 md:w-8 h-0.5 bg-slate-300 dark:bg-slate-700 ${isLeft ? '-right-5 md:-right-8' : '-left-5 md:-left-8'}`}></div>
                  </div>

                  {/* Connection Pad (Center Node) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 w-5 h-5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center rotate-45 z-20">
                    <div className="w-2 h-2 bg-indigo-500"></div>
                  </div>
                  
                </div>
              );
            })}
            
            <div className="mt-8 mx-auto w-32 h-8 bg-slate-100 dark:bg-slate-900 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded text-xs font-bold tracking-widest z-10 uppercase">
                Complete
            </div>
          </div>
        </div>
      ) : (
        // --- GRID VIEW ---
        <>
          <div className="mb-8 border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-1">Skill Modules</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a module to load the learning architecture.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {skillsData.map((skill) => (
              <div 
                key={skill.id} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="w-12 h-12 mb-4 transition-transform group-hover:scale-110">
                  <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">{skill.name}</h3>
                <div className="mt-auto w-full pt-3 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 tracking-wider">INITIALIZE &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLearningPath;