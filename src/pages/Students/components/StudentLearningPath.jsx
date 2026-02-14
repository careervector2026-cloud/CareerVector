import React, { useState } from "react";

const StudentLearningPath = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [expandedStepId, setExpandedStepId] = useState(null);
  
  // State to track completed skills
  const [completedSkills, setCompletedSkills] = useState([]);

  const toggleStep = (stepId) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const handleCompleteSkill = (skillId) => {
    if (!completedSkills.includes(skillId)) {
      setCompletedSkills([...completedSkills, skillId]);
      // Scroll to top to show recommendations
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // NEW: Ability to reset a course to "In Progress"
  const handleResetSkill = (skillId) => {
    setCompletedSkills(completedSkills.filter(id => id !== skillId));
  };

  // --- FULL DATABASE ---
  const skillsData = [
    // --- PROGRAMMING LANGUAGES ---
    { 
      id: 1, name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
      nextRecommendations: [6, 12], // -> Data Structures, ML
      steps: [
        { id: "p1", title: "Syntax", desc: "Variables & Types", subTopics: ["Indentation", "int/float/str", "Type Casting"] },
        { id: "p2", title: "Control Flow", desc: "Logic", subTopics: ["If/Else", "Loops", "Break/Continue"] },
        { id: "p3", title: "Data Structures", desc: "Containers", subTopics: ["Lists", "Dicts", "Sets", "Tuples"] },
        { id: "p4", title: "OOP", desc: "Classes", subTopics: ["Inheritance", "Polymorphism", "Encapsulation"] }
      ] 
    },
    { 
      id: 2, name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", 
      nextRecommendations: [6, 15], // -> Data Structures, AWS
      steps: [
        { id: "j1", title: "JVM", desc: "Internals", subTopics: ["Bytecode", "JDK vs JRE", "Memory Mgmt"] },
        { id: "j2", title: "OOP", desc: "Core Concepts", subTopics: ["Classes", "Interfaces", "Abstract Classes"] },
        { id: "j3", title: "Collections", desc: "Data Storage", subTopics: ["ArrayList", "HashMap", "HashSet"] },
        { id: "j4", title: "Spring Boot", desc: "Framework", subTopics: ["DI/IoC", "REST API", "JPA"] }
      ]
    },
    { 
      id: 3, name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
      nextRecommendations: [4, 18, 10], // -> React, TS, Node
      steps: [
        { id: "js1", title: "ES6+", desc: "Modern Syntax", subTopics: ["Arrow Fn", "Destructuring", "Spread"] },
        { id: "js2", title: "Async", desc: "Promises", subTopics: ["Async/Await", "Event Loop", "Callbacks"] },
        { id: "js3", title: "DOM", desc: "Browser", subTopics: ["Events", "Selectors", "Manipulation"] }
      ]
    },
    { 
      id: 5, name: "C Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", 
      nextRecommendations: [22, 24], // -> Rust, Linux
      steps: [
        { id: "c1", title: "Pointers", desc: "Memory Addr", subTopics: ["Dereferencing", "Pointer Arithmetic"] },
        { id: "c2", title: "Memory", desc: "Management", subTopics: ["malloc", "free", "Stack vs Heap"] },
        { id: "c3", title: "Structs", desc: "Custom Types", subTopics: ["typedef", "unions", "padding"] }
      ]
    },
    { id: 21, name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", nextRecommendations: [13, 14], steps: [{id:"g1", title:"Goroutines", desc:"Concurrency", subTopics:["Channels", "WaitGroups"]}, {id:"g2", title:"Microservices", desc:"Backend", subTopics:["gRPC", "Gin"]}] },
    { id: 22, name: "Rust", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg", nextRecommendations: [], steps: [{id:"ru1", title:"Ownership", desc:"Safety", subTopics:["Borrow Checker", "Lifetimes"]}, {id:"ru2", title:"Concurrency", desc:"Threads", subTopics:["Mutex", "Arc"]}] },
    { id: 17, name: "Swift", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg", nextRecommendations: [], steps: [{id:"sw1", title:"SwiftUI", desc:"Modern UI", subTopics:["State", "Views"]}, {id:"sw2", title:"ARC", desc:"Memory", subTopics:["Strong vs Weak", "Retain Cycles"]}] },
    
    // --- FRONTEND ---
    { 
      id: 8, name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", 
      nextRecommendations: [9], // -> CSS
      steps: [
        { id: "h1", title: "Semantic", desc: "Structure", subTopics: ["header", "nav", "article"] }, 
        { id: "h2", title: "Forms", desc: "Input", subTopics: ["Validation", "Types"] }
      ] 
    },
    { 
      id: 9, name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", 
      nextRecommendations: [3], // -> JS
      steps: [
        { id: "cs1", title: "Flexbox", desc: "Layout", subTopics: ["Justify", "Align", "Direction"] }, 
        { id: "cs2", title: "Grid", desc: "2D Layout", subTopics: ["Template Columns", "Areas"] }
      ] 
    },
    { 
      id: 4, name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
      nextRecommendations: [10], // -> Node
      steps: [
        { id: "r1", title: "Hooks", desc: "Logic", subTopics: ["useState", "useEffect", "useMemo"] },
        { id: "r2", title: "State", desc: "Global", subTopics: ["Redux Toolkit", "Context API"] }
      ] 
    },
    { id: 25, name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", nextRecommendations: [18], steps: [{id:"ng1", title:"Modules", desc:"Architecture", subTopics:["Components", "Services"]}, {id:"ng2", title:"RxJS", desc:"Reactive", subTopics:["Observables", "Subjects"]}] },
    { id: 26, name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", nextRecommendations: [], steps: [{id:"v1", title:"Directives", desc:"Template", subTopics:["v-if", "v-for"]}, {id:"v2", title:"Pinia", desc:"State", subTopics:["Stores", "Actions"]}] },
    { id: 18, name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", nextRecommendations: [4], steps: [{id:"ts1", title:"Interfaces", desc:"Contracts", subTopics:["Types vs Interfaces", "Extending"]}, {id:"ts2", title:"Generics", desc:"Reusable", subTopics:["Functions", "Classes"]}] },

    // --- BACKEND & DB ---
    { 
      id: 10, name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
      nextRecommendations: [19, 7], // -> Mongo, SQL
      steps: [
        { id: "n1", title: "Runtime", desc: "V8 Engine", subTopics: ["Event Loop", "Non-blocking I/O"] },
        { id: "n2", title: "Express", desc: "Framework", subTopics: ["Middleware", "Routing"] }
      ]
    },
    { id: 7, name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", nextRecommendations: [], steps: [{id:"s1", title:"Joins", desc:"Relational", subTopics:["Inner", "Outer", "Left"]}, {id:"s2", title:"Normalization", desc:"Design", subTopics:["1NF", "2NF", "3NF"]}] },
    { id: 19, name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", nextRecommendations: [], steps: [{id:"m1", title:"Documents", desc:"NoSQL", subTopics:["BSON", "Collections"]}, {id:"m2", title:"Aggregation", desc:"Querying", subTopics:["Pipelines", "Match/Group"]}] },
    { id: 23, name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", nextRecommendations: [], steps: [{id:"gq1", title:"Schema", desc:"Types", subTopics:["Query", "Mutation"]}, {id:"gq2", title:"Resolvers", desc:"Logic", subTopics:["Data Fetching", "Apollo"]}] },

    // --- DEVOPS & TOOLS ---
    { 
      id: 11, name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", 
      nextRecommendations: [24], // -> Linux
      steps: [
        { id: "g1", title: "Basics", desc: "Version Control", subTopics: ["Commit", "Push", "Pull"] },
        { id: "g2", title: "Branching", desc: "Workflow", subTopics: ["Merge", "Rebase", "Conflict"] }
      ]
    },
    { id: 13, name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", nextRecommendations: [14], steps: [{id:"d1", title:"Containers", desc:"Isolation", subTopics:["Images", "Dockerfile"]}, {id:"d2", title:"Compose", desc:"Multi-container", subTopics:["Services", "Volumes"]}] },
    { id: 14, name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", nextRecommendations: [15], steps: [{id:"k1", title:"Pods", desc:"Units", subTopics:["Deployments", "Services"]}, {id:"k2", title:"Cluster", desc:"Mgmt", subTopics:["Nodes", "Ingress"]}] },
    { id: 15, name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", nextRecommendations: [], steps: [{id:"a1", title:"EC2", desc:"Compute", subTopics:["Instances", "Security Groups"]}, {id:"a2", title:"S3", desc:"Storage", subTopics:["Buckets", "Policies"]}] },
    { id: 24, name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", nextRecommendations: [11], steps: [{id:"l1", title:"Bash", desc:"Scripting", subTopics:["Variables", "Loops"]}, {id:"l2", title:"Permissions", desc:"Security", subTopics:["Chmod", "Chown", "Users"]}] },

    // --- CORE & MOBILE ---
    { 
      id: 6, name: "Data Structures", icon: "https://cdn-icons-png.flaticon.com/512/3028/3028595.png", 
      nextRecommendations: [12], // -> ML
      steps: [
        { id: "ds1", title: "Arrays", desc: "Linear", subTopics: ["Traversal", "Sliding Window"] },
        { id: "ds2", title: "Trees", desc: "Hierarchical", subTopics: ["Binary Search Tree", "DFS/BFS"] }
      ]
    },
    { id: 12, name: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", nextRecommendations: [], steps: [{id:"ml1", title:"Pandas", desc:"Data Prep", subTopics:["Dataframes", "Cleaning"]}, {id:"ml2", title:"Neural Networks", desc:"Deep Learning", subTopics:["Layers", "Activation Fn"]}] },
    { id: 16, name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", nextRecommendations: [20], steps: [{id:"an1", title:"Kotlin", desc:"Language", subTopics:["Coroutines", "Flow"]}, {id:"an2", title:"Jetpack", desc:"Modern UI", subTopics:["Compose", "ViewModel"]}] },
    { id: 20, name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", nextRecommendations: [], steps: [{id:"f1", title:"Dart", desc:"Language", subTopics:["Widgets", "State"]}, {id:"f2", title:"Bloc", desc:"Architecture", subTopics:["Events", "States"]}] },
  ];

  // Helper to get recommended skill objects
  const getRecommendedSkills = (recommendationIds) => {
    if (!recommendationIds || recommendationIds.length === 0) return [];
    return skillsData.filter(skill => recommendationIds.includes(skill.id));
  };

  const isCompleted = completedSkills.includes(selectedSkill?.id);
  const recommendedSkills = selectedSkill ? getRecommendedSkills(selectedSkill.nextRecommendations) : [];

  return (
    <div className="p-4 md:p-6 font-mono text-slate-700 dark:text-slate-200 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      {selectedSkill ? (
        // --- CIRCUIT ROADMAP VIEW ---
        <div className="max-w-4xl mx-auto pb-16">
          <button 
            className="mb-8 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
            onClick={() => { setSelectedSkill(null); setExpandedStepId(null); }}
          >
            ← Back to Skills Library
          </button>
          
          <div className="flex items-center justify-between mb-12 border-b-2 border-dashed border-slate-300 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                    <img src={selectedSkill.icon} alt={selectedSkill.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{selectedSkill.name}</h2>
                  <p className={`text-sm font-bold font-mono mt-1 ${isCompleted ? 'text-emerald-500' : 'text-indigo-500'}`}>
                      {isCompleted ? "SYSTEM STATUS: COMPLETED" : "SYSTEM STATUS: ONLINE"}
                  </p>
                </div>
            </div>
            
            {/* Completion / Reset Trigger */}
            <div className="flex gap-3">
                {isCompleted ? (
                    <button 
                        onClick={() => handleResetSkill(selectedSkill.id)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold rounded-lg transition-all text-xs"
                    >
                        RESET PROGRESS
                    </button>
                ) : (
                    <button 
                        onClick={() => handleCompleteSkill(selectedSkill.id)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                        MARK MODULE COMPLETE
                    </button>
                )}
            </div>
          </div>

          {/* --- SMART RECOMMENDATION ENGINE (Only shows if completed AND has recommendations) --- */}
          {isCompleted && recommendedSkills.length > 0 && (
            <div className="mb-12 bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 p-6 rounded-xl animate-slide-up shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h3 className="text-lg font-black text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="text-2xl">⚡</span> Extension Protocols Found
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedSkills.map(recSkill => (
                        <div 
                            key={recSkill.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                            onClick={() => {
                                setSelectedSkill(recSkill);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <img src={recSkill.icon} alt={recSkill.name} className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all" />
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">{recSkill.name}</h4>
                                <span className="text-xs text-slate-400 group-hover:text-indigo-400">Initialize Extension →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* --- TIMELINE CIRCUIT --- */}
          <div className="relative py-5 flex flex-col gap-12">
            {/* Main Trace Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 z-0"></div>

            {selectedSkill.steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const isExpanded = expandedStepId === step.id;

              return (
                <div key={index} className={`relative z-10 flex w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Step Card */}
                  <div 
                    className={`w-[45%] md:w-[42%] cursor-pointer p-5 rounded-lg border-2 shadow-sm transition-all duration-300 relative group
                      ${isExpanded 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-emerald-500/10' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }
                      ${isLeft ? 'mr-auto text-right' : 'ml-auto text-left'}
                    `}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className={`flex items-center justify-between mb-3 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">0{index + 1}</span>
                        <div className={`w-3 h-3 rounded-sm ${isExpanded ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-500'} transition-colors`}></div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0 leading-tight">{step.title}</h4>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{step.desc}</p>
                    
                    {/* Expandable Content */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-dashed border-emerald-200 dark:border-emerald-900' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <h5 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Sub-Routines:</h5>
                            <ul className={`flex flex-col gap-1.5 ${isLeft ? 'items-end' : 'items-start'}`}>
                                {step.subTopics && step.subTopics.map((topic, i) => (
                                    <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                                      {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Horizontal Connector */}
                    <div className={`absolute top-8 w-6 md:w-10 h-0.5 bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-400 transition-colors ${isLeft ? '-right-6 md:-right-10' : '-left-6 md:-left-10'}`}></div>
                  </div>

                  {/* Center Node */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-7 w-4 h-4 bg-slate-100 dark:bg-slate-950 border-2 flex items-center justify-center rotate-45 z-20 transition-colors
                    ${isExpanded ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-700'}
                  `}>
                    <div className={`w-1.5 h-1.5 ${isExpanded ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`}></div>
                  </div>
                  
                </div>
              );
            })}
            
            {/* Endpoint */}
            <div className={`mt-8 mx-auto px-6 py-2 border-2 text-xs font-black tracking-[0.2em] uppercase rounded flex items-center justify-center z-10 bg-slate-50 dark:bg-slate-950
                ${isCompleted ? 'border-emerald-500 text-emerald-600' : 'border-slate-300 text-slate-400'}
            `}>
                End Of Line
            </div>
          </div>
        </div>
      ) : (
        // --- GRID DASHBOARD VIEW ---
        <>
          <div className="mb-10 pl-6 border-l-8 border-indigo-600">
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2">Skill Matrix</h2>
            <p className="text-sm font-mono text-slate-500 dark:text-slate-400">Select a module to load learning architecture.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {skillsData.map((skill) => {
              const completed = completedSkills.includes(skill.id);
              return (
                <div 
                  key={skill.id} 
                  className={`bg-white dark:bg-slate-900 border-2 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden
                      ${completed 
                        ? 'border-emerald-500/50 shadow-emerald-500/10' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500'
                      }
                  `}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${completed ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`}></div>

                  <div className="w-14 h-14 mb-5 transition-transform group-hover:scale-110 grayscale group-hover:grayscale-0">
                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-6 uppercase tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{skill.name}</h3>
                  
                  <div className="mt-auto w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className={`text-[10px] font-black tracking-widest uppercase
                        ${completed ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-500'}
                      `}>
                          {completed ? 'REVIEW DATA' : 'INITIALIZE >'}
                      </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLearningPath;