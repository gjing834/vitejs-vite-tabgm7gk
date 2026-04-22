import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Edit3, Settings, Repeat, ShieldAlert, CheckCircle2, 
  PlayCircle, RefreshCcw, AlertTriangle, Bot, Sparkles, Loader2,
  ChevronRight, Lightbulb, Activity, MonitorPlay, Info, Zap
} from 'lucide-react';

export default function ElectricalCourseSystem() {
  // --- 平台全局状态 ---
  const [activeModule, setActiveModule] = useState('home'); 
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // --- AI 助教状态 ---
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("你好！我是本课程的 ✨AI 专属助教。我可以帮你解答当前页面的知识点，或者对你的实验操作进行诊断。请随时提问或点击快捷按钮！");
  const [userQuestion, setUserQuestion] = useState("");

  // --- 原理互动 状态 ---
  const [prin1Switched, setPrin1Switched] = useState(false);
  const [prin2Switched, setPrin2Switched] = useState(false);
  const [prin3Switched, setPrin3Switched] = useState(false);
  const [prin4Switched, setPrin4Switched] = useState(false);
  const [prin5Switched, setPrin5Switched] = useState(false);
  const [prin6Switched, setPrin6Switched] = useState(false);
  const [prin7Switched, setPrin7Switched] = useState(false);
  const [prin8Switched, setPrin8Switched] = useState(false);
  const [prin9Switched, setPrin9Switched] = useState(false);

  // --- 仿真实验 1：自锁控制 状态 ---
  const [sl_qf, setSl_qf] = useState(false);
  const [sl_sb1, setSl_sb1] = useState(false); 
  const [sl_sb2, setSl_sb2] = useState(false); 
  const [sl_fr, setSl_fr] = useState(false);   
  const [sl_km, setSl_km] = useState(false);   

  // --- 仿真实验 2：正反转双重联锁 状态 ---
  const [fr_qf, setFr_qf] = useState(false);
  const [fr_sb1, setFr_sb1] = useState(false); 
  const [fr_sb2, setFr_sb2] = useState(false); 
  const [fr_sb3, setFr_sb3] = useState(false); 
  const [fr_fr, setFr_fr] = useState(false);   
  const [fr_km1, setFr_km1] = useState(false); 
  const [fr_km2, setFr_km2] = useState(false); 

  // --- 核心逻辑引擎：自锁控制 ---
  useEffect(() => {
    if (!sl_qf || sl_fr || sl_sb1) {
      setSl_km(false);
      return;
    }
    if (sl_sb2 || sl_km) {
      setSl_km(true);
    }
  }, [sl_qf, sl_fr, sl_sb1, sl_sb2, sl_km]);

  // --- 核心逻辑引擎：正反转双重联锁 ---
  useEffect(() => {
    if (!fr_qf || fr_fr || fr_sb1) {
      setFr_km1(false);
      setFr_km2(false);
      return;
    }
    if (fr_sb2) {
      setFr_km2(false); 
      setFr_km1(true);  
    } else if (fr_sb3) {
      setFr_km1(false); 
      setFr_km2(true);  
    }
  }, [fr_qf, fr_fr, fr_sb1, fr_sb2, fr_sb3]);

  // --- 元件字典 ---
  const elementDict: Record<string, { name: string; desc: string }> = {
    'QF': { name: '低压断路器 (QF)', desc: '主电源开关。提供短路和严重过载保护，合闸后全系统带电。' },
    'FU1': { name: '主电路熔断器 (FU1)', desc: '大电流短路保护。当电机或主线路发生严重短路时瞬间熔断。' },
    'FU2': { name: '控制电路熔断器 (FU2)', desc: '小电流短路保护。保护按钮、线圈等控制元件免受短路损坏。' },
    'FR_MAIN': { name: '热继电器热元件 (FR)', desc: '串联在主电路。电流过载时，内部双金属片受热弯曲，推动控制电路中的常闭触点断开。' },
    'FR_AUX': { name: '热继电器常闭触点 (FR)', desc: '串接于控制回路起点。过载跳闸时此处断开，切断所有接触器线圈电源。' },
    'SB1': { name: '停止按钮 (SB1)', desc: '常闭按钮。按下即断开控制回路，使所有接触器释放，电机停转。' },
    'SB2_NO': { name: '正转启动按钮 (SB2 常开)', desc: '按下接通正转(KM1)线圈回路。' },
    'SB2_NC': { name: '正转机械联锁触点 (SB2 常闭)', desc: '与启动按钮联动。按下SB2时此处断开，强制切断反转(KM2)回路，防止短路。' },
    'SB3_NO': { name: '反转启动按钮 (SB3 常开)', desc: '按下接通反转(KM2)线圈回路。' },
    'SB3_NC': { name: '反转机械联锁触点 (SB3 常闭)', desc: '与反转按钮联动。按下SB3时此处断开，强制切断正转(KM1)回路。' },
    'KM1_MAIN': { name: '正转主触点 (KM1)', desc: '吸合后将L1,L2,L3按顺序接入电机，电机正转。' },
    'KM2_MAIN': { name: '反转主触点 (KM2)', desc: '吸合后将L1和L3对调接入电机，产生反向旋转磁场，电机反转。' },
    'KM1_COIL': { name: '正转接触器线圈 (KM1)', desc: '得电后产生磁力，吸合所有KM1的常开触点，断开常闭触点。' },
    'KM2_COIL': { name: '反转接触器线圈 (KM2)', desc: '得电后产生磁力，吸合所有KM2的常开触点，断开常闭触点。' },
    'KM1_NO': { name: '正转自锁触点 (KM1 常开)', desc: '与SB2并联。吸合后即使松开SB2也能维持供电。' },
    'KM2_NO': { name: '反转自锁触点 (KM2 常开)', desc: '与SB3并联。吸合后维持反转供电。' },
    'KM1_NC': { name: '正转电气联锁触点 (KM1 常闭)', desc: '串接在反转回路中。KM1吸合时此处断开，确保KM2无法吸合。' },
    'KM2_NC': { name: '反转电气联锁触点 (KM2 常闭)', desc: '串接在正转回路中。KM2吸合时此处断开，确保KM1无法吸合。' },
    'MOTOR': { name: '三相异步电动机 (M)', desc: '将电能转化为机械能。改变任意两相电源的接入顺序即可改变转向。' }
  };

  const callGeminiAPI = async (prompt: string, systemInstructionText: string) => {
    // 实际部署时请确保在环境变量中配置 API Key
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] }
    };
    
    if(!apiKey) return "API Key 暂未配置，AI 助教处于离线状态。请在代码中配置您的 Gemini API Key。";

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error!`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 思考中遇到了问题。";
    } catch (error) {
      return "抱歉，AI 助教网络连接失败，请稍后再试。";
    }
  };

  const handleAiInteraction = async (type: string, customPrompt = "") => {
    setAiLoading(true);
    setAiResponse("");
    
    let userPrompt = "";
    const systemPrompt = "你是一个风趣幽默的高校电气工程教授。回答要精炼、生动，排版清晰，多用比喻。";

    const moduleContext = {
      'principles': "学生正在学习'电气控制线路的九大设计原则'。",
      'sim-selflock': `学生正在操作'自锁控制仿真'。状态：断路器${sl_qf ? '闭合' : '断开'}，热继电器${sl_fr ? '跳闸' : '正常'}，接触器${sl_km ? '吸合' : '释放'}。`,
      'sim-fwdrev': `学生正在操作'正反转双重联锁仿真'。状态：正转接触器${fr_km1 ? '吸合' : '释放'}，反转接触器${fr_km2 ? '吸合' : '释放'}。`
    }[activeModule] || "学生正在浏览电气课程主页。";

    if (type === 'quiz') {
      userPrompt = `${moduleContext} 请基于此出一个单项选择题，考查核心原理，并附带A/B/C/D选项和答案解析。`;
    } else if (type === 'diagnostic') {
      userPrompt = `${moduleContext} 请根据当前状态，告诉学生电路发生了什么，如果是仿真实验，指出电流走向并给出下一步操作建议。`;
    } else if (type === 'custom') {
      userPrompt = `${moduleContext} 学生的提问是：“${customPrompt}”。请详细解答。`;
    }

    const response = await callGeminiAPI(userPrompt, systemPrompt);
    setAiResponse(response);
    setAiLoading(false);
    setUserQuestion("");
  };

  const navItems = [
    { id: 'home', icon: <BookOpen size={20}/>, title: '课程导览' },
    { id: 'principles', icon: <Edit3 size={20}/>, title: '制图与设计原则' },
    { id: 'sim-selflock', icon: <PlayCircle size={20}/>, title: '实验：自锁控制' },
    { id: 'sim-fwdrev', icon: <Repeat size={20}/>, title: '实验：双重联锁正反转' },
    { id: 'advanced', icon: <Activity size={20}/>, title: '制动与机床应用' },
  ];

  const HoverInfoPanel = () => (
    <div className={`absolute top-4 right-4 w-72 bg-white/95 backdrop-blur-sm border border-blue-200 p-4 rounded-xl shadow-xl pointer-events-none transition-all duration-200 z-50 ${hoveredElement ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      {hoveredElement && elementDict[hoveredElement] && (
        <>
          <div className="flex items-center gap-2 mb-2 text-blue-700">
            <Info size={18}/>
            <h4 className="font-bold">{elementDict[hoveredElement].name}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-blue-50 p-2 rounded border border-blue-100">
            {elementDict[hoveredElement].desc}
          </p>
        </>
      )}
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3"><MonitorPlay /> 继电器-接触器控制系统全景学堂</h1>
        <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
          欢迎进入《第二章》学习平台。本系统将抽象的电路原理图转化为<span className="font-bold text-yellow-300">可交互的数字沙盘</span>。
          结合右侧的 AI 助教，您可以通过“做中学”掌握开关量自动控制的核心奥秘。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Edit3 className="text-blue-500"/> 核心理论：九大原则</h3>
          <p className="text-slate-600 mb-4">掌握“不能串联线圈”、“避免飞弧”、“双重联锁”等设计心法，这是设计一切复杂电路的基石。</p>
          <button onClick={() => setActiveModule('principles')} className="text-blue-600 font-medium flex items-center gap-1 hover:underline">立即学习 <ChevronRight size={16}/></button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Settings className="text-green-500"/> 仿真沙盘：动手实践</h3>
          <p className="text-slate-600 mb-4">内置高拟真度SVG电路引擎，支持自锁控制、正反转互锁等经典电路的完整通断电推演。</p>
          <button onClick={() => setActiveModule('sim-selflock')} className="text-green-600 font-medium flex items-center gap-1 hover:underline">进入实验室 <ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );

  const renderPrinciples = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-500 pl-4">电气控制系统的设计原则</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 原理 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 overflow-hidden relative xl:col-span-2">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">重点互动</div>
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 1. 不能串接两个线圈
          </h3>
          <p className="text-slate-600 mb-4">线圈阻抗不同会导致分压不均，使接触器无法正常吸合，甚至烧毁。必须采用并联接法。</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col items-center">
             <div className="flex gap-12 w-full justify-center mb-6">
               <div className="flex flex-col items-center">
                 <h4 className="text-red-500 font-bold mb-2 flex items-center gap-1"><AlertTriangle size={16}/> 错误：串联 (分压)</h4>
                 <svg width="150" height="150" viewBox="0 0 150 150">
                    <line x1="20" y1="20" x2="130" y2="20" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="20" y1="130" x2="130" y2="130" stroke="#3b82f6" strokeWidth="2"/>
                    <line x1="75" y1="20" x2="75" y2="40" stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="40" x2={prin1Switched ? 75 : 60} y2="60" stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="60" x2="75" y2="70" stroke="#333" strokeWidth="2"/>
                    <rect x="65" y="70" width="20" height="20" fill={prin1Switched ? "#fecaca" : "white"} stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="90" x2="75" y2="100" stroke="#333" strokeWidth="2"/>
                    <rect x="65" y="100" width="20" height="20" fill={prin1Switched ? "#fecaca" : "white"} stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="120" x2="75" y2="130" stroke="#333" strokeWidth="2"/>
                 </svg>
                 <span className={`text-xs mt-2 px-2 py-1 rounded ${prin1Switched ? 'bg-red-100 text-red-700' : 'text-slate-400'}`}>
                   {prin1Switched ? '电压不足，无法吸合！' : '等待通电'}
                 </span>
               </div>
               
               <div className="flex flex-col items-center">
                 <h4 className="text-green-600 font-bold mb-2 flex items-center gap-1"><CheckCircle2 size={16}/> 正确：并联 (足压)</h4>
                 <svg width="150" height="150" viewBox="0 0 150 150">
                    <line x1="20" y1="20" x2="130" y2="20" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="20" y1="130" x2="130" y2="130" stroke="#3b82f6" strokeWidth="2"/>
                    <line x1="75" y1="20" x2="75" y2="40" stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="40" x2={prin1Switched ? 75 : 60} y2="60" stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="60" x2="75" y2="70" stroke="#333" strokeWidth="2"/>
                    <line x1="45" y1="70" x2="105" y2="70" stroke="#333" strokeWidth="2"/>
                    <line x1="45" y1="70" x2="45" y2="85" stroke="#333" strokeWidth="2"/>
                    <rect x="35" y="85" width="20" height="20" fill={prin1Switched ? "#86efac" : "white"} stroke="#333" strokeWidth="2"/>
                    <line x1="45" y1="105" x2="45" y2="120" stroke="#333" strokeWidth="2"/>
                    <line x1="105" y1="70" x2="105" y2="85" stroke="#333" strokeWidth="2"/>
                    <rect x="95" y="85" width="20" height="20" fill={prin1Switched ? "#86efac" : "white"} stroke="#333" strokeWidth="2"/>
                    <line x1="105" y1="105" x2="105" y2="120" stroke="#333" strokeWidth="2"/>
                    <line x1="45" y1="120" x2="105" y2="120" stroke="#333" strokeWidth="2"/>
                    <line x1="75" y1="120" x2="75" y2="130" stroke="#333" strokeWidth="2"/>
                 </svg>
                 <span className={`text-xs mt-2 px-2 py-1 rounded ${prin1Switched ? 'bg-green-100 text-green-700' : 'text-slate-400'}`}>
                   {prin1Switched ? '满压工作，强力吸合！' : '等待通电'}
                 </span>
               </div>
             </div>
             <button 
                onClick={() => setPrin1Switched(!prin1Switched)} 
                className={`px-6 py-2 rounded-full font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 ${prin1Switched ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-500'}`}
             >
                <Zap size={18}/> {prin1Switched ? '断开电路' : '闭合电路，观察现象'}
             </button>
          </div>
        </div>

        {/* 原理 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 2. 考虑飞弧影响
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">合理安排触头位置，避免相邻触头断开高压大电流时，电弧引发相间短路。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-around items-center h-36">
             <div className="text-center">
               <h4 className="text-red-500 font-bold mb-2 text-xs">错误：触头间距小</h4>
               <svg width="120" height="80" viewBox="0 0 120 80">
                 <line x1="40" y1="10" x2="40" y2="30" stroke="#333" strokeWidth="3"/>
                 <line x1="80" y1="10" x2="80" y2="30" stroke="#333" strokeWidth="3"/>
                 <line x1="40" y1="30" x2={prin2Switched ? 25 : 40} y2="50" stroke="#333" strokeWidth="3" className="transition-all duration-300"/>
                 <line x1="80" y1="30" x2={prin2Switched ? 95 : 80} y2="50" stroke="#333" strokeWidth="3" className="transition-all duration-300"/>
                 <line x1="40" y1="50" x2="40" y2="70" stroke="#333" strokeWidth="3"/>
                 <line x1="80" y1="50" x2="80" y2="70" stroke="#333" strokeWidth="3"/>
                 {prin2Switched && <path d="M 30 40 Q 60 20 90 40" fill="none" stroke="red" strokeWidth="2" strokeDasharray="4"/>}
                 {prin2Switched && <text x="60" y="35" fill="red" fontSize="10" textAnchor="middle">电弧短路!</text>}
               </svg>
             </div>
             <div className="text-center">
               <h4 className="text-green-600 font-bold mb-2 text-xs">正确：加装灭弧罩或隔开</h4>
               <svg width="120" height="80" viewBox="0 0 120 80">
                 <line x1="40" y1="10" x2="40" y2="30" stroke="#333" strokeWidth="3"/>
                 <line x1="80" y1="10" x2="80" y2="30" stroke="#333" strokeWidth="3"/>
                 <rect x="58" y="20" width="4" height="40" fill="#94a3b8" />
                 <line x1="40" y1="30" x2={prin2Switched ? 25 : 40} y2="50" stroke="#333" strokeWidth="3" className="transition-all duration-300"/>
                 <line x1="80" y1="30" x2={prin2Switched ? 95 : 80} y2="50" stroke="#333" strokeWidth="3" className="transition-all duration-300"/>
                 <line x1="40" y1="50" x2="40" y2="70" stroke="#333" strokeWidth="3"/>
                 <line x1="80" y1="50" x2="80" y2="70" stroke="#333" strokeWidth="3"/>
               </svg>
             </div>
          </div>
          <button onClick={() => setPrin2Switched(!prin2Switched)} className={`mt-4 px-4 py-2 text-white rounded text-sm font-bold w-full transition-colors ${prin2Switched ? 'bg-slate-500' : 'bg-red-500 hover:bg-red-600'}`}>{prin2Switched ? '复位开关' : '模拟带载断开'}</button>
        </div>

        {/* 原理 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 3. 避免触头竞争
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">避免多个继电器依次接通才能启动负载（增加延迟和故障率），应尽量并行或直接控制。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-around h-36 items-center">
             <div className="text-center w-1/2 border-r border-slate-200 pr-2">
               <h4 className="text-red-500 font-bold mb-2 text-xs">错误：多级串联触发</h4>
               <div className="flex flex-col items-center gap-1 mt-2">
                 <div className={`w-full py-0.5 border text-xs ${prin3Switched ? 'bg-green-100' : 'bg-white'}`}>输入信号</div>
                 <div className={`w-full py-0.5 border text-xs transition-colors duration-500 ${prin3Switched ? 'bg-green-100 delay-300' : 'bg-white'}`}>继电器1</div>
                 <div className={`w-full py-0.5 border text-xs transition-colors duration-500 ${prin3Switched ? 'bg-green-100 delay-700' : 'bg-white'}`}>继电器2</div>
                 <div className={`w-full py-0.5 border text-xs transition-colors duration-500 ${prin3Switched ? 'bg-green-500 text-white delay-1000' : 'bg-white'}`}>最终负载</div>
               </div>
             </div>
             <div className="text-center w-1/2 pl-2">
               <h4 className="text-green-600 font-bold mb-2 text-xs">正确：并行触发</h4>
               <div className="flex flex-col items-center gap-1 mt-2">
                 <div className={`w-full py-0.5 border text-xs ${prin3Switched ? 'bg-green-100' : 'bg-white'}`}>输入信号</div>
                 <div className="flex w-full gap-1">
                   <div className={`flex-1 py-0.5 border text-[10px] transition-colors duration-100 ${prin3Switched ? 'bg-green-100' : 'bg-white'}`}>继电器1</div>
                   <div className={`flex-1 py-0.5 border text-[10px] transition-colors duration-100 ${prin3Switched ? 'bg-green-100' : 'bg-white'}`}>继电器2</div>
                 </div>
                 <div className={`w-full py-0.5 border text-xs transition-colors duration-100 ${prin3Switched ? 'bg-green-500 text-white' : 'bg-white'}`}>最终负载</div>
               </div>
             </div>
          </div>
          <button onClick={() => setPrin3Switched(!prin3Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">{prin3Switched ? '重置' : '触发信号对比速度'}</button>
        </div>

        {/* 原理 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 4. 触点容量匹配
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">小容量的开关（如按钮）不能直接驱动大功率负载，必须通过中间继电器/接触器扩容。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-around h-36 items-center">
             <div className="text-center">
               <h4 className="text-red-500 font-bold mb-4 text-xs">错误：小牛拉大车</h4>
               <div className="flex items-center gap-1">
                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] ${prin4Switched ? 'bg-red-500 text-white border-red-700' : 'bg-white'}`}>开关</div>
                 <div className={`h-1 w-8 ${prin4Switched ? 'bg-red-400' : 'bg-slate-400'}`}></div>
                 <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-slate-700 bg-slate-200 text-xs">大电机</div>
               </div>
               <div className="text-xs text-red-500 mt-2 font-bold">{prin4Switched ? '火花/烧毁!' : ''}</div>
             </div>
             <div className="text-center">
               <h4 className="text-green-600 font-bold mb-4 text-xs">正确：继电器扩容</h4>
               <div className="flex items-center gap-1">
                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] ${prin4Switched ? 'bg-green-500 text-white border-green-700' : 'bg-white'}`}>开关</div>
                 <div className="h-1 w-6 bg-slate-400"></div>
                 <div className={`px-1 py-2 border-2 text-[10px] ${prin4Switched ? 'bg-blue-200 border-blue-500' : 'bg-white'}`}>接触器</div>
                 <div className="h-1 w-6 bg-slate-400 border-t-2 border-dashed"></div>
                 <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs ${prin4Switched ? 'bg-green-200 border-green-500 text-green-800' : 'bg-slate-200 text-slate-700'}`}>大电机</div>
               </div>
               <div className="text-xs text-green-600 mt-2 font-bold">{prin4Switched ? '平稳运行' : ''}</div>
             </div>
          </div>
          <button onClick={() => setPrin4Switched(!prin4Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">{prin4Switched ? '停止' : '启动大电机'}</button>
        </div>

        {/* 原理 5 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 5. 逻辑精简
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">在完成控制要求的前提下，尽量减少使用的电器元件与触头数量，提取公共触点。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-36 flex items-center">
             <div className="flex justify-between items-center w-full px-2">
               <div className="text-center">
                 <h4 className="text-red-500 font-bold mb-2 text-xs">未精简 (4个触点)</h4>
                 <div className="font-mono text-[10px] mb-2 text-slate-500">KA1·KM + KA2·KM</div>
                 <svg width="100" height="50" viewBox="0 0 100 50" className="mx-auto">
                   <line x1="0" y1="10" x2="20" y2="10" stroke="#333" strokeWidth="1.5"/>
                   <rect x="20" y="2" width="16" height="16" fill="white" stroke="#333"/> <text x="23" y="13" fontSize="8">KA1</text>
                   <line x1="36" y1="10" x2="50" y2="10" stroke="#333" strokeWidth="1.5"/>
                   <rect x="50" y="2" width="16" height="16" fill="white" stroke="#333"/> <text x="53" y="13" fontSize="8">KM</text>
                   <line x1="66" y1="10" x2="86" y2="10" stroke="#333" strokeWidth="1.5"/>

                   <line x1="0" y1="40" x2="20" y2="40" stroke="#333" strokeWidth="1.5"/>
                   <rect x="20" y="32" width="16" height="16" fill="white" stroke="#333"/> <text x="23" y="43" fontSize="8">KA2</text>
                   <line x1="36" y1="40" x2="50" y2="40" stroke="#333" strokeWidth="1.5"/>
                   <rect x="50" y="32" width="16" height="16" fill={prin5Switched ? "#fecaca" : "white"} stroke={prin5Switched ? "red" : "#333"} strokeDasharray={prin5Switched ? "2" : "0"}/> <text x="53" y="43" fontSize="8" fill={prin5Switched ? "red" : "black"}>KM</text>
                   <line x1="66" y1="40" x2="86" y2="40" stroke="#333" strokeWidth="1.5"/>

                   <line x1="0" y1="10" x2="0" y2="40" stroke="#333" strokeWidth="1.5"/>
                   <line x1="86" y1="10" x2="86" y2="40" stroke="#333" strokeWidth="1.5"/>
                 </svg>
               </div>
               <div className="text-xl text-slate-400 px-2">➔</div>
               <div className="text-center">
                 <h4 className="text-green-600 font-bold mb-2 text-xs">精简后 (3个触点)</h4>
                 <div className="font-mono text-[10px] mb-2 text-slate-500">(KA1 + KA2)·KM</div>
                 <svg width="100" height="50" viewBox="0 0 100 50" className="mx-auto">
                   <line x1="0" y1="10" x2="10" y2="10" stroke="#333" strokeWidth="1.5"/>
                   <rect x="10" y="2" width="16" height="16" fill="white" stroke="#333"/> <text x="13" y="13" fontSize="8">KA1</text>
                   <line x1="26" y1="10" x2="40" y2="10" stroke="#333" strokeWidth="1.5"/>

                   <line x1="0" y1="40" x2="10" y2="40" stroke="#333" strokeWidth="1.5"/>
                   <rect x="10" y="32" width="16" height="16" fill="white" stroke="#333"/> <text x="13" y="43" fontSize="8">KA2</text>
                   <line x1="26" y1="40" x2="40" y2="40" stroke="#333" strokeWidth="1.5"/>

                   <line x1="0" y1="10" x2="0" y2="40" stroke="#333" strokeWidth="1.5"/>
                   <line x1="40" y1="10" x2="40" y2="40" stroke="#333" strokeWidth="1.5"/>

                   <line x1="40" y1="25" x2="50" y2="25" stroke="#333" strokeWidth="1.5"/>
                   <rect x="50" y="17" width="16" height="16" fill={prin5Switched ? "#bbf7d0" : "white"} stroke={prin5Switched ? "green" : "#333"}/> <text x="53" y="28" fontSize="8">KM</text>
                   <line x1="66" y1="25" x2="86" y2="25" stroke="#333" strokeWidth="1.5"/>
                 </svg>
               </div>
             </div>
          </div>
          <button onClick={() => setPrin5Switched(!prin5Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">对比提取公共触点 (KM)</button>
        </div>

        {/* 原理 6 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 6. 优化连线
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">尽量减少控制柜到操作台（远距离）的连接导线根数，降低成本和故障率。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between h-36 items-center">
            <div className="text-center w-1/2 border-r border-slate-200">
               <h4 className="text-red-500 font-bold mb-2 text-xs">错误：独立走线 (4根)</h4>
               <svg width="120" height="70" viewBox="0 0 120 70" className="mx-auto mt-2">
                 <rect x="10" y="5" width="25" height="60" fill="#e2e8f0" stroke="#64748b"/>
                 <text x="12" y="25" fontSize="8">按1</text>
                 <text x="12" y="55" fontSize="8">按2</text>
                 <line x1="35" y1="15" x2="90" y2="15" stroke={prin6Switched ? "red" : "#333"} strokeWidth="1.5"/>
                 <line x1="35" y1="25" x2="90" y2="25" stroke="#333" strokeWidth="1.5"/>
                 <line x1="35" y1="45" x2="90" y2="45" stroke={prin6Switched ? "red" : "#333"} strokeWidth="1.5"/>
                 <line x1="35" y1="55" x2="90" y2="55" stroke="#333" strokeWidth="1.5"/>
                 <rect x="90" y="5" width="20" height="60" fill="#cbd5e1" stroke="#64748b"/>
                 <text x="92" y="40" fontSize="8">电柜</text>
               </svg>
            </div>
            <div className="text-center w-1/2">
               <h4 className="text-green-600 font-bold mb-2 text-xs">正确：共用线段 (3根)</h4>
               <svg width="120" height="70" viewBox="0 0 120 70" className="mx-auto mt-2">
                 <rect x="10" y="5" width="25" height="60" fill="#e2e8f0" stroke="#64748b"/>
                 <text x="12" y="25" fontSize="8">按1</text>
                 <text x="12" y="55" fontSize="8">按2</text>
                 <line x1="30" y1="15" x2="30" y2="45" stroke={prin6Switched ? "green" : "#333"} strokeWidth="1.5"/>
                 <line x1="30" y1="30" x2="90" y2="30" stroke={prin6Switched ? "green" : "#333"} strokeWidth="1.5"/>
                 <line x1="35" y1="25" x2="90" y2="25" stroke="#333" strokeWidth="1.5"/>
                 <line x1="35" y1="55" x2="90" y2="55" stroke="#333" strokeWidth="1.5"/>
                 <rect x="90" y="5" width="20" height="60" fill="#cbd5e1" stroke="#64748b"/>
                 <text x="92" y="40" fontSize="8">电柜</text>
               </svg>
            </div>
          </div>
          <button onClick={() => setPrin6Switched(!prin6Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">高亮多余线段</button>
        </div>

        {/* 原理 7 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 7. 触头动作顺序
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">电器动作有机械延迟。若逻辑极度依赖同时动作的触点，极易发生“竞争与冒险”导致误动作。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-36 flex flex-col justify-center">
             <div className="flex w-full justify-between px-4 text-xs font-mono mb-2 text-slate-500">
               <span>常开(NO) 闭合</span>
               <span>常闭(NC) 断开</span>
             </div>
             <div className="w-full h-10 bg-slate-200 rounded relative overflow-hidden shadow-inner border border-slate-300">
               <div className={`absolute top-0 left-0 h-5 bg-blue-500 transition-all ease-linear ${prin7Switched ? 'w-full duration-1000' : 'w-0 duration-300'}`}></div>
               <div className={`absolute bottom-0 left-0 h-5 bg-red-500 transition-all ease-linear ${prin7Switched ? 'w-0 duration-1000' : 'w-full duration-300'}`}></div>
             </div>
             <p className="text-[10px] mt-4 text-slate-500 text-center leading-relaxed">
               观察动画：常闭先断开，常开后闭合。<br/>中间存在 <span className="text-orange-500 font-bold">双方都处于断开状态的“死区时间”</span>。
             </p>
          </div>
          <button onClick={() => setPrin7Switched(!prin7Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">慢动作演示触头切换</button>
        </div>

        {/* 原理 8 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 8. 防止寄生电路
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">线路故障时（如某处断路），电流可能通过指示灯等元件形成意外接通的反向回路。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between h-36 items-center">
            <div className="text-center w-1/2 border-r border-slate-200">
               <h4 className="text-red-500 font-bold mb-2 text-xs">错误：指示灯跨接</h4>
               <svg width="120" height="70" viewBox="0 0 120 70" className="mx-auto">
                 <line x1="20" y1="15" x2="100" y2="15" stroke="#333" strokeWidth="2"/>
                 <text x="5" y="18" fontSize="8">L</text>
                 <rect x="40" y="5" width="20" height="20" fill="white" stroke="#333"/> <text x="42" y="18" fontSize="8">KM</text>
                 <line x1="70" y1="15" x2={prin8Switched ? 85 : 90} y2={prin8Switched ? 5 : 15} stroke="#333" strokeWidth="2"/>
                 <text x="73" y="8" fontSize="8">FR断路</text>
                 <text x="105" y="18" fontSize="8">N</text>
                 
                 <line x1="30" y1="15" x2="30" y2="45" stroke="#333" strokeWidth="2"/>
                 <circle cx="30" cy="45" r="6" fill="yellow" stroke="#333"/> <text x="40" y="48" fontSize="8">指示灯</text>
                 <line x1="30" y1="51" x2="30" y2="60" stroke="#333" strokeWidth="2"/>
                 <line x1="30" y1="60" x2="80" y2="60" stroke="#333" strokeWidth="2"/>
                 <line x1="80" y1="60" x2="80" y2="15" stroke="#333" strokeWidth="2"/>
                 
                 {prin8Switched && <path d="M 20 60 L 80 60 L 80 15 L 60 15" fill="none" stroke="red" strokeWidth="2" strokeDasharray="3" className="animate-pulse"/>}
               </svg>
               <div className="text-[10px] mt-1 text-red-500 h-4 font-bold">{prin8Switched ? '电流反向流过指示灯点亮KM' : ''}</div>
            </div>
            <div className="text-center w-1/2">
               <h4 className="text-green-600 font-bold mb-2 text-xs">正确：独立接地</h4>
               <svg width="120" height="70" viewBox="0 0 120 70" className="mx-auto">
                 <line x1="20" y1="15" x2="100" y2="15" stroke="#333" strokeWidth="2"/>
                 <rect x="40" y="5" width="20" height="20" fill="white" stroke="#333"/> <text x="42" y="18" fontSize="8">KM</text>
                 <line x1="70" y1="15" x2={prin8Switched ? 85 : 90} y2={prin8Switched ? 5 : 15} stroke="#333" strokeWidth="2"/>
                 <text x="73" y="8" fontSize="8">FR断路</text>
                 
                 <line x1="30" y1="15" x2="30" y2="45" stroke="#333" strokeWidth="2"/>
                 <circle cx="30" cy="45" r="6" fill="yellow" stroke="#333"/>
                 <line x1="30" y1="51" x2="30" y2="60" stroke="#333" strokeWidth="2"/>
                 <line x1="30" y1="60" x2="100" y2="60" stroke="#333" strokeWidth="2"/> 
                 <line x1="100" y1="15" x2="100" y2="60" stroke="#333" strokeWidth="2"/>
               </svg>
               <div className="text-[10px] mt-1 text-green-600 h-4 font-bold">{prin8Switched ? '直接接 N 线，无寄生通路' : ''}</div>
            </div>
          </div>
          <button onClick={() => setPrin8Switched(!prin8Switched)} className={`mt-4 px-4 py-2 text-white rounded text-sm font-bold w-full transition-colors ${prin8Switched ? 'bg-slate-500' : 'bg-red-500 hover:bg-red-600'}`}>{prin8Switched ? '修复线路' : '模拟主干路 FR 故障跳闸'}</button>
        </div>

        {/* 原理 9 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20}/> 9. 必须有双重联锁
          </h3>
          <p className="text-slate-600 mb-4 text-sm h-10">频繁可逆线路中，正反转接触器如果同时吸合会造成主电源相间短路，必须加装双重联锁。</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between h-36 items-center">
            <div className="text-center w-1/2 border-r border-slate-200">
               <h4 className="text-red-500 font-bold mb-4 text-xs">无联锁：极度危险</h4>
               <svg width="120" height="60" viewBox="0 0 120 60" className="mx-auto">
                 <rect x="20" y="10" width="30" height="20" fill={prin9Switched ? "#fecaca" : "white"} stroke="#333" className="transition-colors duration-200"/> <text x="25" y="23" fontSize="8">正转KM1</text>
                 <rect x="70" y="10" width="30" height="20" fill={prin9Switched ? "#fecaca" : "white"} stroke="#333" className="transition-colors duration-200"/> <text x="75" y="23" fontSize="8">反转KM2</text>
                 {prin9Switched && <text x="60" y="50" fill="red" fontSize="14" fontWeight="bold" textAnchor="middle" className="animate-bounce">💥 相间短路</text>}
               </svg>
            </div>
            <div className="text-center w-1/2">
               <h4 className="text-green-600 font-bold mb-4 text-xs">双重联锁：绝对安全</h4>
               <svg width="120" height="60" viewBox="0 0 120 60" className="mx-auto">
                 <rect x="20" y="10" width="30" height="20" fill={prin9Switched ? "#bbf7d0" : "white"} stroke="#333" className="transition-colors duration-200"/> <text x="25" y="23" fontSize="8">正转KM1</text>
                 <rect x="70" y="10" width="30" height="20" fill="white" stroke="#333"/> <text x="75" y="23" fontSize="8">反转KM2</text>
                 <line x1="50" y1="20" x2="70" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2"/>
                 {prin9Switched && <text x="60" y="45" fill="green" fontSize="8" textAnchor="middle">正转运行期间</text>}
                 {prin9Switched && <text x="60" y="55" fill="green" fontSize="8" textAnchor="middle" fontWeight="bold">机械/电气强制切断反转</text>}
               </svg>
            </div>
          </div>
          <button onClick={() => setPrin9Switched(!prin9Switched)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold w-full">模拟“同时按下正反转”误操作</button>
        </div>

      </div>
    </div>
  );

  const renderSimSelfLock = () => {
    const isPowered = sl_qf && !sl_fr && !sl_sb1 && sl_km;
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 relative">
        <HoverInfoPanel />
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><PlayCircle className="text-green-500"/> 单向全压启动（长动自锁）原理图</h3>
          <div className="flex gap-2">
            <button onClick={() => setSl_qf(!sl_qf)} className={`px-4 py-1.5 rounded-full text-sm font-bold text-white transition-colors ${sl_qf ? 'bg-blue-600' : 'bg-slate-400'}`}>QF {sl_qf ? '已合闸' : '已断开'}</button>
            <button onClick={() => setSl_fr(!sl_fr)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${sl_fr ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>FR {sl_fr ? '过载跳闸' : '正常'}</button>
          </div>
        </div>
        <div className="flex-1 p-6 relative flex justify-center items-center bg-slate-50 overflow-auto">
           <svg width="600" height="450" viewBox="0 0 600 450" className="max-w-full h-auto drop-shadow-md bg-white rounded p-4" onMouseLeave={() => setHoveredElement(null)}>
             <text x="30" y="30" className="font-bold fill-slate-700">L1,L2,L3主电路</text>
             <text x="280" y="30" className="font-bold fill-slate-700">控制电路</text>
             
             {/* Power Lines */}
             <line x1="50" y1="50" x2="550" y2="50" stroke={sl_qf ? "#ef4444" : "#9ca3af"} strokeWidth="3" />
             <text x="25" y="55" fontWeight="bold">L1</text>
             <line x1="50" y1="400" x2="550" y2="400" stroke={sl_qf ? "#3b82f6" : "#9ca3af"} strokeWidth="3" />
             <text x="25" y="405" fontWeight="bold">N</text>

             {/* Control Circuit Branch */}
             <line x1="300" y1="50" x2="300" y2="80" stroke={sl_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
             
             {/* FU2 */}
             <g transform="translate(300, 80)" onMouseEnter={() => setHoveredElement('FU2')}>
               <rect x="-8" y="0" width="16" height="30" fill="white" stroke={hoveredElement === 'FU2' ? "#3b82f6" : "#333"} strokeWidth="2" />
               <text x="15" y="20" fontSize="12">FU2</text>
               <line x1="0" y1="30" x2="0" y2="60" stroke={sl_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
             </g>
             
             {/* FR Aux */}
             <g transform="translate(300, 140)" onMouseEnter={() => setHoveredElement('FR_AUX')}>
               <rect x="-20" y="0" width="40" height="30" fill="white" stroke={hoveredElement === 'FR_AUX' ? "#3b82f6" : (sl_fr ? "#ef4444" : "#333")} strokeWidth="2" />
               <text x="25" y="20" fontSize="12" fill={sl_fr ? "#ef4444" : "#333"}>FR 常闭</text>
               <line x1="0" y1="0" x2={sl_fr ? 15 : 0} y2="30" stroke="#333" strokeWidth="3" />
               <line x1="0" y1="30" x2="0" y2="60" stroke={sl_qf && !sl_fr ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
             </g>

             {/* SB1 Stop */}
             <g transform="translate(300, 200)" onMouseEnter={() => setHoveredElement('SB1')}>
               <rect x="-20" y="0" width="40" height="30" fill={sl_sb1 ? "#fee2e2" : "white"} stroke={hoveredElement === 'SB1' ? "#3b82f6" : "#333"} strokeWidth="2" />
               <text x="25" y="20" fontSize="12">SB1 停止</text>
               <line x1="0" y1="0" x2={sl_sb1 ? 15 : 0} y2="30" stroke="#333" strokeWidth="3" />
               <line x1="0" y1="30" x2="0" y2="60" stroke={sl_qf && !sl_fr && !sl_sb1 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
             </g>

             {/* Split for SB2 and KM Aux */}
             <line x1="230" y1="260" x2="370" y2="260" stroke={sl_qf && !sl_fr && !sl_sb1 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
             
             {/* SB2 Start */}
             <g transform="translate(230, 260)" onMouseEnter={() => setHoveredElement('SB2_NO')}>
               <line x1="0" y1="0" x2="0" y2="20" stroke={sl_qf && !sl_fr && !sl_sb1 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               <rect x="-20" y="20" width="40" height="30" fill={sl_sb2 ? "#dcfce7" : "white"} stroke={hoveredElement === 'SB2_NO' ? "#3b82f6" : "#333"} strokeWidth="2" />
               <text x="-70" y="40" fontSize="12">SB2 启动</text>
               <line x1="0" y1="20" x2={sl_sb2 ? 0 : 15} y2="50" stroke="#333" strokeWidth="3" />
               <line x1="0" y1="50" x2="0" y2="70" stroke={sl_sb2 && sl_qf && !sl_fr && !sl_sb1 ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
             </g>

             {/* KM Aux */}
             <g transform="translate(370, 260)" onMouseEnter={() => setHoveredElement('KM1_NO')}>
               <line x1="0" y1="0" x2="0" y2="20" stroke={sl_qf && !sl_fr && !sl_sb1 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               <rect x="-20" y="20" width="40" height="30" fill={sl_km ? "#dbeafe" : "white"} stroke={hoveredElement === 'KM1_NO' ? "#3b82f6" : "#333"} strokeWidth="2" />
               <text x="25" y="40" fontSize="12">KM 自锁</text>
               <line x1="0" y1="20" x2={sl_km ? 0 : 15} y2="50" stroke="#333" strokeWidth="3" />
               <line x1="0" y1="50" x2="0" y2="70" stroke={sl_km && sl_qf && !sl_fr && !sl_sb1 ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
             </g>

             {/* Join back */}
             <line x1="230" y1="330" x2="370" y2="330" stroke={isPowered ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
             <line x1="300" y1="330" x2="300" y2="350" stroke={isPowered ? "#22c55e" : "#9ca3af"} strokeWidth="2" />

             {/* KM Coil */}
             <g transform="translate(300, 350)" onMouseEnter={() => setHoveredElement('KM1_COIL')}>
               <rect x="-25" y="0" width="50" height="30" fill={sl_km ? "#3b82f6" : "white"} stroke={hoveredElement === 'KM1_COIL' ? "#2563eb" : "#333"} strokeWidth="2" />
               <text x="35" y="20" fontSize="12" fontWeight="bold">KM 线圈</text>
               <line x1="0" y1="30" x2="0" y2="50" stroke={isPowered ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
             </g>
             
             {/* Motor Indicator */}
             <g transform="translate(100, 250)" onMouseEnter={() => setHoveredElement('MOTOR')}>
               <circle cx="0" cy="0" r="40" fill={sl_km ? "#bbf7d0" : "#f1f5f9"} stroke={hoveredElement === 'MOTOR' ? "#3b82f6" : "#333"} strokeWidth="4" />
               <text x="0" y="8" textAnchor="middle" fontSize="24" fontWeight="bold">M</text>
               {sl_km && (
                  <path d="M -25 0 A 25 25 0 0 1 25 0" fill="none" stroke="#16a34a" strokeWidth="4" className="animate-spin" style={{transformOrigin: '0px 0px'}} />
               )}
               <text x="0" y="60" textAnchor="middle" fontSize="14" fill={sl_km ? "#16a34a" : "#64748b"}>{sl_km ? "运转中" : "停止"}</text>
             </g>
           </svg>
        </div>
        <div className="p-4 bg-slate-100 flex justify-center gap-6 border-t border-slate-200">
           <button onMouseDown={() => setSl_sb2(true)} onMouseUp={() => setSl_sb2(false)} onMouseLeave={() => setSl_sb2(false)} className={`px-8 py-3 rounded font-bold text-white shadow transition-all active:scale-95 ${sl_sb2 ? 'bg-green-700' : 'bg-green-500'}`}>长按启动 (SB2)</button>
           <button onMouseDown={() => setSl_sb1(true)} onMouseUp={() => setSl_sb1(false)} onMouseLeave={() => setSl_sb1(false)} className={`px-8 py-3 rounded font-bold text-white shadow transition-all active:scale-95 ${sl_sb1 ? 'bg-red-700' : 'bg-red-500'}`}>长按停止 (SB1)</button>
        </div>
      </div>
    );
  };

  const renderSimFwdRev = () => {
    const isControlPowered = fr_qf && !fr_fr && !fr_sb1;

    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 relative">
        <HoverInfoPanel />
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 z-10">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Repeat className="text-purple-500"/> 可逆运行（双重联锁）完整原理图</h3>
          <div className="flex gap-2">
            <button onClick={() => setFr_qf(!fr_qf)} className={`px-4 py-1.5 rounded-full text-sm font-bold text-white transition-colors ${fr_qf ? 'bg-blue-600' : 'bg-slate-400'}`}>QF {fr_qf ? '已合闸' : '已断开'}</button>
            <button onClick={() => setFr_fr(!fr_fr)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${fr_fr ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>FR {fr_fr ? '过载跳闸' : '正常'}</button>
          </div>
        </div>
        <div className="flex-1 p-2 relative flex justify-center items-center bg-slate-50 overflow-auto">
            <svg width="800" height="500" viewBox="0 0 800 500" className="w-full h-auto drop-shadow-md bg-white rounded-lg border border-slate-200" onMouseLeave={() => setHoveredElement(null)}>
               <defs>
                 <marker id="arrowFwd" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
                 <marker id="arrowRev" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" /></marker>
               </defs>

               <text x="20" y="30" className="font-bold fill-slate-700 text-sm">主电路 (换相逻辑)</text>
               <text x="450" y="30" className="font-bold fill-slate-700 text-sm">控制电路 (双重联锁)</text>
               
               {/* ================= 主电路 ================= */}
               <line x1="50" y1="50" x2="50" y2="80" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="3" />
               <line x1="90" y1="50" x2="90" y2="80" stroke={fr_qf ? "#22c55e" : "#9ca3af"} strokeWidth="3" />
               <line x1="130" y1="50" x2="130" y2="80" stroke={fr_qf ? "#eab308" : "#9ca3af"} strokeWidth="3" />
               <text x="45" y="45" fontSize="12" fontWeight="bold">L1</text>
               <text x="85" y="45" fontSize="12" fontWeight="bold">L2</text>
               <text x="125" y="45" fontSize="12" fontWeight="bold">L3</text>

               <g transform="translate(0, 80)" onMouseEnter={() => setHoveredElement('FU1')}>
                 <rect x="42" y="0" width="16" height="25" fill="white" stroke="#333" strokeWidth="2" />
                 <rect x="82" y="0" width="16" height="25" fill="white" stroke="#333" strokeWidth="2" />
                 <rect x="122" y="0" width="16" height="25" fill="white" stroke="#333" strokeWidth="2" />
                 <text x="15" y="18" fontSize="12">FU1</text>
               </g>

               <g transform="translate(0, 105)">
                 <line x1="50" y1="0" x2="50" y2="40" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="90" y1="0" x2="90" y2="40" stroke={fr_qf ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="130" y1="0" x2="130" y2="40" stroke={fr_qf ? "#eab308" : "#9ca3af"} strokeWidth="2" />
                 
                 <line x1="50" y1="20" x2="210" y2="20" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="90" y1="25" x2="250" y2="25" stroke={fr_qf ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="130" y1="30" x2="290" y2="30" stroke={fr_qf ? "#eab308" : "#9ca3af"} strokeWidth="2" />
                 <circle cx="50" cy="20" r="3" fill="#333" />
                 <circle cx="90" cy="25" r="3" fill="#333" />
                 <circle cx="130" cy="30" r="3" fill="#333" />
                 
                 <line x1="210" y1="20" x2="210" y2="40" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="250" y1="25" x2="250" y2="40" stroke={fr_qf ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="290" y1="30" x2="290" y2="40" stroke={fr_qf ? "#eab308" : "#9ca3af"} strokeWidth="2" />
               </g>

               <g transform="translate(50, 145)" onMouseEnter={() => setHoveredElement('KM1_MAIN')}>
                 <rect x="-10" y="0" width="100" height="30" fill={fr_km1 ? "#dbeafe" : "transparent"} stroke={hoveredElement === 'KM1_MAIN' ? "#3b82f6" : "none"} strokeDasharray="2" strokeWidth="2" />
                 <text x="-35" y="20" fontSize="12" fontWeight="bold">KM1</text>
                 {[0, 40, 80].map((x, i) => (
                   <g key={i}>
                     <line x1={x} y1="0" x2={fr_km1 ? x : x+10} y2="30" stroke="#333" strokeWidth="3" />
                     <circle cx={x} cy="0" r="3" fill="#333" /> 
                     <circle cx={x} cy="30" r="3" fill="#333" />
                   </g>
                 ))}
               </g>

               <g transform="translate(210, 145)" onMouseEnter={() => setHoveredElement('KM2_MAIN')}>
                 <rect x="-10" y="0" width="100" height="30" fill={fr_km2 ? "#f3e8ff" : "transparent"} stroke={hoveredElement === 'KM2_MAIN' ? "#a855f7" : "none"} strokeDasharray="2" strokeWidth="2" />
                 <text x="90" y="20" fontSize="12" fontWeight="bold">KM2</text>
                 {[0, 40, 80].map((x, i) => (
                   <g key={i}>
                     <line x1={x} y1="0" x2={fr_km2 ? x : x+10} y2="30" stroke="#333" strokeWidth="3" />
                     <circle cx={x} cy="0" r="3" fill="#333" /> 
                     <circle cx={x} cy="30" r="3" fill="#333" />
                   </g>
                 ))}
               </g>

               <g transform="translate(0, 175)">
                 <line x1="50" y1="0" x2="50" y2="70" stroke={fr_km1 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="90" y1="0" x2="90" y2="70" stroke={fr_km1 ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="130" y1="0" x2="130" y2="70" stroke={fr_km1 ? "#eab308" : "#9ca3af"} strokeWidth="2" />
                 
                 <line x1="210" y1="0" x2="210" y2="20" stroke={fr_km2 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="210" y1="20" x2="130" y2="20" stroke={fr_km2 ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="130" y1="20" x2="130" y2="70" stroke={fr_km2 ? "#ef4444" : (fr_km1 ? "#eab308" : "#9ca3af")} strokeWidth="2" />
                 <circle cx="130" cy="20" r="3" fill="#333" />

                 <line x1="250" y1="0" x2="250" y2="30" stroke={fr_km2 ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="250" y1="30" x2="90" y2="30" stroke={fr_km2 ? "#22c55e" : "#9ca3af"} strokeWidth="2" />
                 <line x1="90" y1="30" x2="90" y2="70" stroke={fr_km2 ? "#22c55e" : (fr_km1 ? "#22c55e" : "#9ca3af")} strokeWidth="2" />
                 <circle cx="90" cy="30" r="3" fill="#333" />

                 <line x1="290" y1="0" x2="290" y2="40" stroke={fr_km2 ? "#eab308" : "#9ca3af"} strokeWidth="2" />
                 <line x1="290" y1="40" x2="50" y2="40" stroke={fr_km2 ? "#eab308" : "#9ca3af"} strokeWidth="2" />
                 <line x1="50" y1="40" x2="50" y2="70" stroke={fr_km2 ? "#eab308" : (fr_km1 ? "#ef4444" : "#9ca3af")} strokeWidth="2" />
                 <circle cx="50" cy="40" r="3" fill="#333" />
               </g>

               <g transform="translate(0, 245)" onMouseEnter={() => setHoveredElement('FR_MAIN')}>
                 <rect x="40" y="0" width="100" height="20" fill="transparent" stroke={hoveredElement === 'FR_MAIN' ? "#3b82f6" : "none"} strokeWidth="2" />
                 <text x="15" y="15" fontSize="12">FR</text>
                 {[50, 90, 130].map(x => (
                   <path key={x} d={`M ${x-6} 0 L ${x+6} 0 L ${x+6} 10 L ${x-6} 10 L ${x-6} 20 L ${x+6} 20`} fill="none" stroke="#333" strokeWidth="2" />
                 ))}
               </g>

               <g transform="translate(90, 320)" onMouseEnter={() => setHoveredElement('MOTOR')}>
                 <line x1="-40" y1="-55" x2="-40" y2="-30" stroke={fr_km2 ? "#eab308" : (fr_km1 ? "#ef4444" : "#9ca3af")} strokeWidth="3" />
                 <line x1="0" y1="-55" x2="0" y2="-30" stroke={fr_km2 ? "#22c55e" : (fr_km1 ? "#22c55e" : "#9ca3af")} strokeWidth="3" />
                 <line x1="40" y1="-55" x2="40" y2="-30" stroke={fr_km2 ? "#ef4444" : (fr_km1 ? "#eab308" : "#9ca3af")} strokeWidth="3" />
                 <circle cx="0" cy="0" r="35" fill={fr_km1 ? "#dbeafe" : fr_km2 ? "#f3e8ff" : "#f1f5f9"} stroke={hoveredElement === 'MOTOR' ? "#3b82f6" : "#333"} strokeWidth="3" />
                 <text x="0" y="5" textAnchor="middle" fontSize="20" fontWeight="bold">M</text>
                 {fr_km1 && <path d="M -20 -10 A 22 22 0 0 1 20 -10" fill="none" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrowFwd)" className="animate-[spin_1s_linear_infinite]" style={{transformOrigin: '0px 0px'}} />}
                 {fr_km2 && <path d="M -20 10 A 22 22 0 0 0 20 10" fill="none" stroke="#a855f7" strokeWidth="4" markerEnd="url(#arrowRev)" className="animate-[spin_1s_linear_infinite_reverse]" style={{transformOrigin: '0px 0px'}} />}
               </g>

               {/* ================= 控制电路 ================= */}
               <line x1="50" y1="65" x2="520" y2="65" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               <circle cx="50" cy="65" r="3" fill="#333" />
               <line x1="130" y1="460" x2="680" y2="460" stroke={fr_qf ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
               <circle cx="130" cy="460" r="3" fill="#333" />
               <text x="690" y="465" fontSize="12" fontWeight="bold">N</text>

               <g transform="translate(520, 65)" onMouseEnter={() => setHoveredElement('FU2')}>
                 <rect x="-8" y="0" width="16" height="25" fill="white" stroke={hoveredElement === 'FU2' ? "#3b82f6" : "#333"} strokeWidth="2" />
                 <text x="-35" y="18" fontSize="12">FU2</text>
                 <line x1="0" y1="25" x2="0" y2="45" stroke={fr_qf ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               </g>

               <g transform="translate(520, 110)" onMouseEnter={() => setHoveredElement('FR_AUX')}>
                 <rect x="-20" y="0" width="40" height="25" fill="white" stroke={hoveredElement === 'FR_AUX' ? "#3b82f6" : (fr_fr ? "#ef4444" : "#333")} strokeWidth="2" />
                 <text x="-55" y="18" fontSize="12" fill={fr_fr ? "#ef4444" : "#333"}>FR常闭</text>
                 <line x1="0" y1="0" x2={fr_fr ? 15 : 0} y2="25" stroke="#333" strokeWidth="3" />
                 <line x1="0" y1="25" x2="0" y2="45" stroke={fr_qf && !fr_fr ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               </g>

               <g transform="translate(520, 155)" onMouseEnter={() => setHoveredElement('SB1')}>
                 <rect x="-20" y="0" width="40" height="25" fill={fr_sb1 ? "#fee2e2" : "white"} stroke={hoveredElement === 'SB1' ? "#3b82f6" : "#333"} strokeWidth="2" />
                 <text x="-65" y="18" fontSize="12">SB1 停止</text>
                 <line x1="0" y1="0" x2={fr_sb1 ? 15 : 0} y2="25" stroke="#333" strokeWidth="3" />
                 <line x1="0" y1="25" x2="0" y2="45" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               </g>

               <line x1="450" y1="200" x2="650" y2="200" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
               <circle cx="520" cy="200" r="3" fill="#333" />
               
               {/* ------ 正转分支 (左边) ------ */}
               <g transform="translate(450, 200)">
                 <line x1="0" y1="0" x2="0" y2="20" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="-30" y1="20" x2="30" y2="20" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 
                 <g transform="translate(-30, 20)" onMouseEnter={() => setHoveredElement('SB2_NO')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_sb2 ? "#dbeafe" : "white"} stroke={hoveredElement === 'SB2_NO' ? "#3b82f6" : "#333"} strokeWidth="2" />
                   <text x="-55" y="15" fontSize="10">SB2</text>
                   <line x1="0" y1="0" x2={fr_sb2 ? 0 : 12} y2="25" stroke="#333" strokeWidth="3" />
                 </g>
                 
                 <g transform="translate(30, 20)" onMouseEnter={() => setHoveredElement('KM1_NO')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_km1 ? "#dbeafe" : "white"} stroke={hoveredElement === 'KM1_NO' ? "#3b82f6" : "#333"} strokeWidth="2" />
                   <text x="20" y="15" fontSize="10">KM1自锁</text>
                   <line x1="0" y1="0" x2={fr_km1 ? 0 : 12} y2="25" stroke="#333" strokeWidth="3" />
                 </g>

                 <line x1="-30" y1="45" x2="30" y2="45" stroke={(fr_sb2 || fr_km1) && isControlPowered ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
                 <line x1="0" y1="45" x2="0" y2="60" stroke={(fr_sb2 || fr_km1) && isControlPowered ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />

                 <g transform="translate(0, 60)" onMouseEnter={() => setHoveredElement('SB3_NC')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_sb3 ? "#fee2e2" : "white"} stroke={hoveredElement === 'SB3_NC' ? "#ef4444" : "#333"} strokeWidth="2" />
                   <text x="-70" y="15" fontSize="10" fill={fr_sb3 ? "#ef4444" : "#333"}>SB3 常闭</text>
                   <line x1="0" y1="0" x2={fr_sb3 ? 12 : 0} y2="25" stroke="#333" strokeWidth="3" />
                   <line x1="0" y1="25" x2="0" y2="45" stroke={(fr_sb2 || fr_km1) && !fr_sb3 && isControlPowered ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
                 </g>

                 <g transform="translate(0, 105)" onMouseEnter={() => setHoveredElement('KM2_NC')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_km2 ? "#fee2e2" : "white"} stroke={hoveredElement === 'KM2_NC' ? "#ef4444" : "#333"} strokeWidth="2" />
                   <text x="20" y="15" fontSize="10" fill={fr_km2 ? "#ef4444" : "#333"}>KM2 常闭</text>
                   <line x1="0" y1="0" x2={fr_km2 ? 12 : 0} y2="25" stroke="#333" strokeWidth="3" />
                   <line x1="0" y1="25" x2="0" y2="45" stroke={(fr_sb2 || fr_km1) && !fr_sb3 && !fr_km2 && isControlPowered ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
                 </g>

                 <g transform="translate(0, 150)" onMouseEnter={() => setHoveredElement('KM1_COIL')}>
                   <rect x="-20" y="0" width="40" height="30" fill={fr_km1 ? "#3b82f6" : "white"} stroke={hoveredElement === 'KM1_COIL' ? "#2563eb" : "#333"} strokeWidth="2" />
                   <text x="-45" y="20" fontSize="12" fontWeight="bold">KM1</text>
                   <line x1="0" y1="30" x2="0" y2="110" stroke={fr_km1 ? "#3b82f6" : "#9ca3af"} strokeWidth="2" />
                 </g>
               </g>

               {/* ------ 反转分支 (右边) ------ */}
               <g transform="translate(650, 200)">
                 <line x1="0" y1="0" x2="0" y2="20" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 <line x1="-30" y1="20" x2="30" y2="20" stroke={isControlPowered ? "#ef4444" : "#9ca3af"} strokeWidth="2" />
                 
                 <g transform="translate(-30, 20)" onMouseEnter={() => setHoveredElement('SB3_NO')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_sb3 ? "#f3e8ff" : "white"} stroke={hoveredElement === 'SB3_NO' ? "#a855f7" : "#333"} strokeWidth="2" />
                   <text x="-40" y="15" fontSize="10">SB3</text>
                   <line x1="0" y1="0" x2={fr_sb3 ? 0 : 12} y2="25" stroke="#333" strokeWidth="3" />
                 </g>
                 
                 <g transform="translate(30, 20)" onMouseEnter={() => setHoveredElement('KM2_NO')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_km2 ? "#f3e8ff" : "white"} stroke={hoveredElement === 'KM2_NO' ? "#a855f7" : "#333"} strokeWidth="2" />
                   <text x="20" y="15" fontSize="10">KM2自锁</text>
                   <line x1="0" y1="0" x2={fr_km2 ? 0 : 12} y2="25" stroke="#333" strokeWidth="3" />
                 </g>

                 <line x1="-30" y1="45" x2="30" y2="45" stroke={(fr_sb3 || fr_km2) && isControlPowered ? "#a855f7" : "#9ca3af"} strokeWidth="2" />
                 <line x1="0" y1="45" x2="0" y2="60" stroke={(fr_sb3 || fr_km2) && isControlPowered ? "#a855f7" : "#9ca3af"} strokeWidth="2" />

                 <g transform="translate(0, 60)" onMouseEnter={() => setHoveredElement('SB2_NC')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_sb2 ? "#fee2e2" : "white"} stroke={hoveredElement === 'SB2_NC' ? "#ef4444" : "#333"} strokeWidth="2" />
                   <text x="20" y="15" fontSize="10" fill={fr_sb2 ? "#ef4444" : "#333"}>SB2 常闭</text>
                   <line x1="0" y1="0" x2={fr_sb2 ? 12 : 0} y2="25" stroke="#333" strokeWidth="3" />
                   <line x1="0" y1="25" x2="0" y2="45" stroke={(fr_sb3 || fr_km2) && !fr_sb2 && isControlPowered ? "#a855f7" : "#9ca3af"} strokeWidth="2" />
                 </g>

                 <g transform="translate(0, 105)" onMouseEnter={() => setHoveredElement('KM1_NC')}>
                   <rect x="-15" y="0" width="30" height="25" fill={fr_km1 ? "#fee2e2" : "white"} stroke={hoveredElement === 'KM1_NC' ? "#ef4444" : "#333"} strokeWidth="2" />
                   <text x="-75" y="15" fontSize="10" fill={fr_km1 ? "#ef4444" : "#333"}>KM1 常闭</text>
                   <line x1="0" y1="0" x2={fr_km1 ? 12 : 0} y2="25" stroke="#333" strokeWidth="3" />
                   <line x1="0" y1="25" x2="0" y2="45" stroke={(fr_sb3 || fr_km2) && !fr_sb2 && !fr_km1 && isControlPowered ? "#a855f7" : "#9ca3af"} strokeWidth="2" />
                 </g>

                 <g transform="translate(0, 150)" onMouseEnter={() => setHoveredElement('KM2_COIL')}>
                   <rect x="-20" y="0" width="40" height="30" fill={fr_km2 ? "#a855f7" : "white"} stroke={hoveredElement === 'KM2_COIL' ? "#9333ea" : "#333"} strokeWidth="2" />
                   <text x="30" y="20" fontSize="12" fontWeight="bold">KM2</text>
                   <line x1="0" y1="30" x2="0" y2="110" stroke={fr_km2 ? "#a855f7" : "#9ca3af"} strokeWidth="2" />
                 </g>
               </g>

               {/* 虚线：表示机械联锁联动 (纯视觉辅助) */}
               <path d="M 420 220 Q 480 240 650 272" fill="none" stroke="#94a3b8" strokeDasharray="4" strokeWidth="1" />
               <path d="M 620 220 Q 560 240 450 272" fill="none" stroke="#94a3b8" strokeDasharray="4" strokeWidth="1" />

            </svg>
        </div>
        <div className="p-4 bg-slate-100 flex justify-center gap-4 border-t border-slate-200 z-10">
           <button onMouseDown={() => setFr_sb2(true)} onMouseUp={() => setFr_sb2(false)} onMouseLeave={() => setFr_sb2(false)} className={`px-6 py-3 rounded font-bold text-white shadow transition-all active:scale-95 flex items-center gap-1 ${fr_sb2 ? 'bg-blue-700' : 'bg-blue-500'}`}>正转启动 (SB2)</button>
           <button onMouseDown={() => setFr_sb1(true)} onMouseUp={() => setFr_sb1(false)} onMouseLeave={() => setFr_sb1(false)} className={`px-6 py-3 rounded font-bold text-white shadow transition-all active:scale-95 flex items-center gap-1 ${fr_sb1 ? 'bg-red-700' : 'bg-red-500'}`}>总停止 (SB1)</button>
           <button onMouseDown={() => setFr_sb3(true)} onMouseUp={() => setFr_sb3(false)} onMouseLeave={() => setFr_sb3(false)} className={`px-6 py-3 rounded font-bold text-white shadow transition-all active:scale-95 flex items-center gap-1 ${fr_sb3 ? 'bg-purple-700' : 'bg-purple-500'}`}>反转启动 (SB3)</button>
        </div>
      </div>
    );
  };

  const renderAdvanced = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-purple-500 pl-4">制动技术与机床应用</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><ShieldAlert className="text-orange-500"/> 电机制动方式</h3>
          <ul className="space-y-4 text-slate-600">
            <li className="p-3 bg-orange-50 rounded-lg">
              <strong className="text-orange-700 block mb-1">反接制动 (Reverse Current Braking)</strong>
              改变电源相序，产生反向旋转磁场。制动力矩大，停机快，但冲击大。需使用**速度继电器(KS)**，当转速接近零时切断反向电源，防止反向启动。
            </li>
            <li className="p-3 bg-blue-50 rounded-lg">
              <strong className="text-blue-700 block mb-1">能耗制动 (Dynamic Braking)</strong>
              切断三相交流电源后，给定子绕组通入直流电，产生静止磁场。转子切割静止磁场产生制动力矩。制动平稳，能耗小。
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><Settings className="text-indigo-500"/> 典型机床应用分析</h3>
          <ul className="space-y-4 text-slate-600">
            <li className="border-b pb-3">
              <strong className="text-slate-800">C650 普通车床</strong>
              <p className="mt-1 text-sm">主电动机控制：正反转长动、点动对刀（串电阻低速）、反接制动停机。包含刀架快速移动控制和冷却泵控制。</p>
            </li>
            <li>
              <strong className="text-slate-800">Z3040 摇臂钻床</strong>
              <p className="mt-1 text-sm">拥有4台电机。涉及复杂的机械与电气配合：摇臂上升需先“液压松开”，移动到位后“液压夹紧”。</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* ================= 侧边栏 ================= */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-xl z-10">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="bg-blue-600 text-white p-2 rounded-lg"><Lightbulb size={24}/></div>
          <h2 className="text-lg font-bold text-white tracking-wide">PLC与控制导学</h2>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeModule === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-slate-600 text-center border-t border-slate-800">
          可视化教学系统 v3.0
        </div>
      </div>

      {/* ================= 主内容区 ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-700">
            {navItems.find(i => i.id === activeModule)?.title}
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">第2章：继电器-接触器控制</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          <div className="flex-[2] overflow-y-auto pr-2 pb-10 custom-scrollbar relative">
            {activeModule === 'home' && renderHome()}
            {activeModule === 'principles' && renderPrinciples()}
            {activeModule === 'sim-selflock' && renderSimSelfLock()}
            {activeModule === 'sim-fwdrev' && renderSimFwdRev()}
            {activeModule === 'advanced' && renderAdvanced()}
          </div>

          {/* 右侧始终驻留的 AI 助教面板 */}
          <div className="w-96 flex flex-col bg-white rounded-xl shadow-lg border border-indigo-100 shrink-0 overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex items-center gap-3">
              <Bot size={24} />
              <div>
                <h3 className="font-bold text-lg leading-tight">AI 智能导师</h3>
                <p className="text-indigo-200 text-xs mt-0.5">Gemini 大模型强力驱动</p>
              </div>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 text-slate-700 text-sm leading-relaxed border-b border-slate-100">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-70">
                   <Loader2 className="animate-spin text-indigo-500" size={32} />
                   <span>AI 正在思考中，请稍候...</span>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  {aiResponse.split('\n').map((line, idx) => {
                     if (!line.trim()) return <br key={idx}/>;
                     if (line.startsWith('**') || line.startsWith('##')) return <strong key={idx} className="block text-indigo-900 mt-3 mb-1 text-base">{line.replace(/[*#]/g, '')}</strong>;
                     return <p key={idx}>{line}</p>;
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-white">
              <div className="flex gap-2 mb-3">
                <button 
                  onClick={() => handleAiInteraction('diagnostic')}
                  disabled={aiLoading}
                  className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 py-2 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Activity size={14}/> 分析当前状态
                </button>
                <button 
                  onClick={() => handleAiInteraction('quiz')}
                  disabled={aiLoading}
                  className="flex-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 py-2 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Sparkles size={14}/> 考考我
                </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={userQuestion}
                  onChange={e => setUserQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && userQuestion && handleAiInteraction('custom', userQuestion)}
                  placeholder="向 AI 助教提问..." 
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={aiLoading}
                />
                <button 
                  onClick={() => userQuestion && handleAiInteraction('custom', userQuestion)}
                  disabled={!userQuestion || aiLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 全局样式 */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}