import type { AppItem } from '@/types/app';

export const demoApp: AppItem = {
  id: "demo-math-app-001",
  name: "乘法教学3",
  title: "数学小超人：乘除法大冒险",
  description: "适合7岁小朋友的乘除法学习游戏，包含积木工厂、糖果商店、口诀探险和冒险挑战四个模块",
  thumbnail: null,
  htmlContent: `乘法教学3
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数学小超人：乘除法大冒险</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Comic Sans MS', '微软雅黑', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            color: white;
            padding: 30px 0;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        h1 {
            font-size: 3em;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 1.3em;
            opacity: 0.95;
        }

        .nav-tabs {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .tab-btn {
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.2em;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .tab-btn.active {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .tab-btn:nth-child(1) { background: #ff6b6b; color: white; }
        .tab-btn:nth-child(2) { background: #4ecdc4; color: white; }
        .tab-btn:nth-child(3) { background: #ffe66d; color: #333; }
        .tab-btn:nth-child(4) { background: #a8e6cf; color: #333; }

        .tab-btn:hover {
            transform: translateY(-3px);
        }

        .game-section {
            display: none;
            background: white;
            border-radius: 30px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: fadeIn 0.5s;
        }

        .game-section.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .section-title {
            color: #5a67d8;
            font-size: 2em;
            margin-bottom: 20px;
            text-align: center;
        }

        /* 积木工厂样式 */
        .block-factory {
            text-align: center;
        }

        .controls {
            margin: 20px 0;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .input-group label {
            font-weight: bold;
            color: #555;
        }

        input[type="number"] {
            width: 80px;
            padding: 10px;
            font-size: 1.5em;
            text-align: center;
            border: 3px solid #ddd;
            border-radius: 15px;
            transition: border-color 0.3s;
        }

        input[type="number"]:focus {
            outline: none;
            border-color: #667eea;
        }

        .btn-primary {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.2em;
            border-radius: 30px;
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: bold;
            margin: 10px;
        }

        .btn-primary:hover {
            transform: scale(1.05);
        }

        .blocks-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin: 30px 0;
            min-height: 200px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 20px;
            border: 3px dashed #cbd5e0;
        }

        .group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            padding: 10px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .block {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2em;
            color: white;
            animation: popIn 0.3s;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .block:hover {
            transform: rotate(5deg) scale(1.1);
        }

        @keyframes popIn {
            0% { transform: scale(0); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .explanation {
            background: #e6fffa;
            border-left: 5px solid #38b2ac;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            font-size: 1.2em;
            line-height: 1.6;
        }

        .math-formula {
            font-size: 2em;
            color: #5a67d8;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            font-family: 'Courier New', monospace;
        }

        /* 糖果商店样式 */
        .candy-shop {
            text-align: center;
        }

        .shop-scene {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 40px;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .shelf {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .candy-jar {
            width: 120px;
            height: 150px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
            border: 4px solid #ffb6c1;
            border-radius: 20px 20px 40px 40px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s;
        }

        .candy-jar:hover {
            transform: scale(1.05);
        }

        .candy {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            position: absolute;
            animation: float 3s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .customer {
            font-size: 4em;
            animation: wiggle 2s infinite;
        }

        @keyframes wiggle {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }

        .speech-bubble {
            background: white;
            border: 3px solid #333;
            border-radius: 20px;
            padding: 15px;
            position: relative;
            max-width: 250px;
            font-size: 1.1em;
            margin-bottom: 10px;
        }

        .speech-bubble::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 10px 10px 0;
            border-style: solid;
            border-color: #333 transparent transparent;
        }

        .price-tag {
            background: #ffe66d;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 5px;
        }

        /* 口诀探险样式 */
        .memory-game {
            text-align: center;
        }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e2e8f0;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #48bb78, #38a169);
            width: 0%;
            transition: width 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            max-width: 800px;
            margin: 30px auto;
        }

        .memory-card {
            aspect-ratio: 1;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            transform-style: preserve-3d;
            position: relative;
        }

        .memory-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .memory-card.flipped {
            background: white;
            color: #333;
            border: 3px solid #667eea;
        }

        .memory-card.matched {
            background: #48bb78;
            animation: pulse 0.5s;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* 冒险挑战样式 */
        .adventure-game {
            text-align: center;
        }

        .level-selector {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .level-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 4px solid #ddd;
            background: white;
            font-size: 1.5em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .level-btn.unlocked {
            border-color: #48bb78;
            background: #c6f6d5;
        }

        .level-btn.current {
            border-color: #667eea;
            background: #667eea;
            color: white;
            animation: glow 1.5s infinite;
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px #667eea; }
            50% { box-shadow: 0 0 20px #667eea, 0 0 40px #667eea; }
        }

        .question-box {
            background: linear-gradient(135deg, #f6f8fb, #e9edf5);
            border-radius: 20px;
            padding: 40px;
            margin: 30px 0;
            border: 3px solid #cbd5e0;
        }

        .question-text {
            font-size: 2em;
            color: #2d3748;
            margin-bottom: 30px;
        }

        .answer-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            max-width: 500px;
            margin: 0 auto;
        }

        .option-btn {
            padding: 20px;
            font-size: 1.5em;
            border: 3px solid #cbd5e0;
            background: white;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .option-btn:hover {
            background: #e6fffa;
            border-color: #38b2ac;
            transform: translateY(-2px);
        }

        .option-btn.correct {
            background: #c6f6d5;
            border-color: #48bb78;
            animation: correct 0.5s;
        }

        .option-btn.wrong {
            background: #fed7d7;
            border-color: #f56565;
            animation: shake 0.5s;
        }

        @keyframes correct {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .stars {
            font-size: 2em;
            margin: 20px 0;
        }

        .hint-box {
            background: #fffaf0;
            border: 2px solid #f6ad55;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            display: none;
        }

        .hint-box.show {
            display: block;
            animation: fadeIn 0.5s;
        }

        /* 打赏区域样式 */
        .donate-section {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            border-radius: 30px;
            padding: 40px;
            margin: 40px 0;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border: 4px dashed #ff8c69;
            position: relative;
            overflow: hidden;
        }

        .donate-section::before {
            content: '☕';
            position: absolute;
            top: -20px;
            right: -20px;
            font-size: 100px;
            opacity: 0.1;
            transform: rotate(15deg);
        }

        .donate-title {
            font-size: 2em;
            color: #e8532d;
            margin-bottom: 15px;
            font-weight: bold;
            text-shadow: 2px 2px 0px rgba(255,255,255,0.5);
        }

        .donate-desc {
            font-size: 1.2em;
            color: #744210;
            margin-bottom: 25px;
            line-height: 1.6;
        }

        .donate-btn {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 20px 50px;
            font-size: 1.4em;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4);
            position: relative;
            overflow: hidden;
            animation: pulse-btn 2s infinite;
        }

        @keyframes pulse-btn {
            0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(238, 90, 36, 0.6); }
        }

        .donate-btn:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 10px 40px rgba(238, 90, 36, 0.5);
        }

        .donate-btn::after {
            content: '🥤';
            margin-left: 10px;
            font-size: 1.2em;
        }

        .donate-features {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 25px;
            flex-wrap: wrap;
        }

        .feature-item {
            background: rgba(255,255,255,0.6);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.95em;
            color: #744210;
            font-weight: bold;
        }

        /* 感谢动画模态框 */
        .thanks-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .thanks-modal.show {
            display: flex;
            animation: fadeIn 0.5s;
        }

        .thanks-content {
            background: white;
            border-radius: 40px;
            padding: 50px;
            max-width: 600px;
            text-align: center;
            position: relative;
            animation: slideUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border: 5px solid #ffd93d;
        }

        @keyframes slideUp {
            from { transform: translateY(100px) scale(0.8); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .thanks-emoji {
            font-size: 5em;
            margin-bottom: 20px;
            animation: crazy-dance 1s infinite;
        }

        @keyframes crazy-dance {
            0%, 100% { transform: rotate(-10deg) scale(1); }
            25% { transform: rotate(10deg) scale(1.2); }
            50% { transform: rotate(-10deg) scale(1); }
            75% { transform: rotate(10deg) scale(1.2); }
        }

        .thanks-title {
            font-size: 2.5em;
            color: #e8532d;
            margin-bottom: 20px;
            font-weight: bold;
            text-shadow: 3px 3px 0px #ffeaa7;
        }

        .thanks-text {
            font-size: 1.3em;
            color: #2d3436;
            line-height: 1.8;
            margin-bottom: 30px;
        }

        .thanks-joke {
            background: #fff5f5;
            border-left: 5px solid #ff6b6b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 15px;
            font-size: 1.1em;
            color: #d63031;
            font-style: italic;
            text-align: left;
        }

        .close-thanks {
            background: linear-gradient(45deg, #00b894, #00cec9);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.2em;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }

        .close-thanks:hover {
            transform: scale(1.1);
        }

        .flying-cola {
            position: absolute;
            font-size: 3em;
            animation: fly-around 3s linear infinite;
            pointer-events: none;
        }

        @keyframes fly-around {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(100px, -100px) rotate(90deg); }
            50% { transform: translate(0, -200px) rotate(180deg); }
            75% { transform: translate(-100px, -100px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            h1 { font-size: 2em; }
            .section-title { font-size: 1.5em; }
            .tab-btn { padding: 10px 20px; font-size: 1em; }
            .blocks-container { gap: 10px; }
            .block { width: 40px; height: 40px; font-size: 1em; }
            .donate-title { font-size: 1.5em; }
            .thanks-content { padding: 30px 20px; margin: 20px; }
            .thanks-title { font-size: 1.8em; }
        }

        /* 庆祝动画 */
        .celebration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            display: none;
        }

        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #f0f;
            animation: fall linear forwards;
        }

        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }

        .score-board {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-weight: bold;
            font-size: 1.2em;
            color: #5a67d8;
            z-index: 100;
        }
    </style>
</head>
<body>
    <div class="score-board">⭐ 积分: <span id="totalScore">0</span></div>
    
    <div class="container">
        <header>
            <h1> 数学小超人</h1>
            <p class="subtitle">乘除法大冒险 · 适合7岁小朋友</p>
        </header>

        <div class="nav-tabs">
            <button class="tab-btn active" onclick="switchTab('blocks')"> 积木工厂</button>
            <button class="tab-btn" onclick="switchTab('candy')"> 糖果商店</button>
            <button class="tab-btn" onclick="switchTab('memory')">🧠 口诀探险</button>
            <button class="tab-btn" onclick="switchTab('adventure')">⚔️ 冒险挑战</button>
        </div>

        <!-- 积木工厂：理解乘法本质 -->
        <section id="blocks" class="game-section active">
            <h2 class="section-title"> 积木工厂：乘法是"几个几"</h2>
            <div class="block-factory">
                <p style="font-size: 1.2em; color: #666; margin-bottom: 20px;">
                    小朋友，我们来玩积木！<br>
                    选择<strong>每堆几个</strong>和<strong>有几堆</strong>，看看乘法是怎么算的～
                </p>
                
                <div class="controls">
                    <div class="input-group">
                        <label>每堆几个？</label>
                        <input type="number" id="blockPerGroup" min="1" max="9" value="3">
                    </div>
                    <div style="font-size: 2em; color: #999;">×</div>
                    <div class="input-group">
                        <label>有几堆？</label>
                        <input type="number" id="groupCount" min="1" max="9" value="4">
                    </div>
                    <div style="font-size: 2em; color: #999;">=</div>
                    <div class="input-group">
                        <label>总共？</label>
                        <input type="number" id="totalBlocks" readonly style="background: #f0f0f0;">
                    </div>
                </div>

                <button class="btn-primary" onclick="generateBlocks()">生成积木！</button>
                
                <div class="blocks-container" id="blocksContainer"></div>
                
                <div class="explanation" id="blockExplanation" style="display: none;">
                    <strong> 小发现：</strong>
                    <span id="explanationText"></span>
                </div>

                <div class="math-formula" id="blockFormula"></div>
            </div>
        </section>

        <!-- 糖果商店：生活场景应用 -->
        <section id="candy" class="game-section">
            <h2 class="section-title"> 糖果商店：乘法的用处</h2>
            <div class="candy-shop">
                <p style="font-size: 1.2em; color: #666; margin-bottom: 20px;">
                    小熊来买糖啦！帮它算一算需要多少钱？
                </p>

                <div class="shop-scene">
                    <div class="shelf">
                        <div class="candy-jar" id="candyJar" onclick="shakeJar()">
                            <!-- 糖果由JS生成 -->
                        </div>
                        <div class="price-tag">每个 <span id="candyPrice">2</span> 元</div>
                    </div>
                    
                    <div style="font-size: 3em; color: #999;">×</div>
                    
                    <div class="customer-area">
                        <div class="speech-bubble" id="customerSpeech">
                            我要买 <strong id="wantCount">5</strong> 个糖果！<br>
                            一共需要多少钱？
                        </div>
                        <div class="customer"></div>
                    </div>
                </div>

                <div class="controls">
                    <button class="btn-primary" onclick="checkCandyAnswer()" id="calcBtn">算一算</button>
                    <button class="btn-primary" onclick="newCandyProblem()" style="background: linear-gradient(45deg, #f093fb, #f5576c);">下一题</button>
                </div>

                <div class="explanation" id="candyExplanation" style="display: none;">
                    <strong> 解题思路：</strong>
                    <div id="candySolution"></div>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #fff5f5; border-radius: 15px;">
                    <h3 style="color: #e53e3e; margin-bottom: 10px;"> 游戏玩法：</h3>
                    <p>1. 点击糖果罐数一数有多少个糖果</p>
                    <p>2. 每个糖果的价格 × 个数 = 总价格</p>
                    <p>3. 这就是乘法在生活中的用法！</p>
                </div>
            </div>
        </section>

        <!-- 口诀探险：记忆游戏 -->
        <section id="memory" class="game-section">
            <h2 class="section-title">🧠 口诀探险：找朋友</h2>
            <div class="memory-game">
                <p style="font-size: 1.2em; color: #666; margin-bottom: 20px;">
                    翻开卡片，找到算式和答案的配对！<br>
                    比如 "3×4" 和 "12" 是好朋友～
                </p>

                <div class="progress-bar">
                    <div class="progress-fill" id="memoryProgress">0%</div>
                </div>

                <div class="card-grid" id="memoryGrid"></div>

                <div class="controls">
                    <button class="btn-primary" onclick="initMemoryGame()">重新开始</button>
                    <select id="memoryLevel" onchange="initMemoryGame()" style="padding: 10px; font-size: 1.1em; border-radius: 10px; border: 2px solid #ddd;">
                        <option value="easy">简单 (1-5口诀)</option>
                        <option value="medium">中等 (1-7口诀)</option>
                        <option value="hard">困难 (1-9口诀)</option>
                    </select>
                </div>

                <div class="hint-box" id="memoryHint">
                     <strong>记忆小窍门：</strong> 先记住你会的，比如2×5=10（像手指），5×5=25（五五二十五）！
                </div>
            </div>
        </section>

        <!-- 冒险挑战：综合练习 -->
        <section id="adventure" class="game-section">
            <h2 class="section-title">⚔️ 冒险挑战：小勇士试炼</h2>
            <div class="adventure-game">
                <p style="font-size: 1.2em; color: #666; margin-bottom: 20px;">
                    闯过10关，成为乘除法小超人！
                </p>

                <div class="level-selector" id="levelSelector"></div>

                <div class="question-box" id="questionBox">
                    <div class="question-text" id="questionText">点击上面的关卡开始冒险！</div>
                    <div class="answer-options" id="answerOptions"></div>
                </div>

                <div class="hint-box" id="adventureHint">
                     <strong>提示：</strong> <span id="hintText"></span>
                </div>

                <div class="stars" id="starDisplay"></div>
            </div>
        </section>

        <!-- 打赏区域 -->
        <section class="donate-section">
            <div class="donate-title">🥤 请作者喝个可乐！</div>
            <div class="donate-desc">
                如果这个工具帮到了你家小宝贝<br>
                3块钱，让作者熬夜写代码的手不再颤抖～<br>
                <small style="color: #999;">（或者让小朋友用刚学的乘法算算：1瓶可乐3元，作者想喝2瓶要多少钱？）</small>
            </div>
            
            <button class="donate-btn" onclick="openDonate()">
                3元请作者喝个可乐
            </button>
            
            <div class="donate-features">
                <div class="feature-item"> 永久免费使用</div>
                <div class="feature-item"> 持续更新内容</div>
                <div class="feature-item">❤️ 支持教育公益</div>
            </div>
        </section>

        <footer style="text-align: center; color: rgba(255,255,255,0.8); padding: 20px; font-size: 0.9em;">
            <p>Made with 🧡 for 7-year-old math heroes | 让数学变得好玩起来</p>
        </footer>
    </div>

    <!-- 感谢动画模态框 -->
    <div class="thanks-modal" id="thanksModal" onclick="closeThanks(event)">
        <div class="thanks-content" onclick="event.stopPropagation()">
            <div class="thanks-emoji">🥤🥤</div>
            <div class="thanks-title">哇！真的假的！</div>
            <div class="thanks-text">
                <strong>这位家长/小朋友，您太客气了！</strong><br><br>
                您的3元巨款已收到！<br>
                作者正在飞奔去便利店买可乐...<br>
                <em style="color: #e8532d; font-size: 0.9em;">（如果便利店关门了，我就买瓶矿泉水假装是可乐）</em>
            </div>
            
            <div class="thanks-joke">
                <strong> 冷知识：</strong><br>
                您刚才的打赏动作，比小朋友算对一道乘法题还快！<br>
                建议让小朋友算一下：如果每天3个人打赏，作者一周能买几瓶可乐？<br>
                <small>（答案：21瓶，会喝撑的，建议分我一点）</small>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 15px; font-size: 1em; color: #2e7d32;">
                <strong> 特别承诺：</strong><br>
                您的支持将用于：<br>
                1. 购买更多咖啡因 ☕<br>
                2. 修复bug时保持清醒 <br>
                3. 给服务器续命（它快饿死了）️
            </div>

            <button class="close-thanks" onclick="closeThanks()">
                关闭（作者去喝可乐了）‍♂️
            </button>

            <div style="margin-top: 20px; font-size: 0.9em; color: #999;">
                <em>P.S. 如果小朋友问"为什么要给钱"，您可以告诉他：<br>
                "这是给努力工作的程序员的奖励，就像你考100分妈妈给你买玩具一样！"</em>
            </div>
        </div>
        
        <!-- 飞舞的可乐 -->
        <div class="flying-cola" style="top: 10%; left: 10%; animation-delay: 0s;">🥤</div>
        <div class="flying-cola" style="top: 20%; right: 15%; animation-delay: 0.5s;">🥤</div>
        <div class="flying-cola" style="bottom: 30%; left: 20%; animation-delay: 1s;">🥤</div>
        <div class="flying-cola" style="bottom: 20%; right: 10%; animation-delay: 1.5s;">🥤</div>
        <div class="flying-cola" style="top: 50%; left: 5%; animation-delay: 2s;">🥤</div>
        <div class="flying-cola" style="top: 60%; right: 5%; animation-delay: 2.5s;">🥤</div>
    </div>

    <div class="celebration" id="celebration"></div>

    <script>
        // 全局状态
        let totalScore = 0;
        let currentLevel = 1;
        let unlockedLevels = 1;
        let memoryPairs = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let hasDonated = false;

        // 切换标签页
        function switchTab(tabName) {
            document.querySelectorAll('.game-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            
            if (tabName === 'memory') initMemoryGame();
            if (tabName === 'adventure') initAdventure();
        }

        // 更新积分
        function addScore(points) {
            totalScore += points;
            document.getElementById('totalScore').textContent = totalScore;
            celebrate();
        }

        // 庆祝动画
        function celebrate() {
            const celebration = document.getElementById('celebration');
            celebration.style.display = 'block';
            celebration.innerHTML = '';
            
            const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'];
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                celebration.appendChild(confetti);
            }
            
            setTimeout(() => {
                celebration.style.display = 'none';
            }, 3000);
        }

        // ========== 打赏功能 ==========
        function openDonate() {
            // 跳转到公众号文章（打赏链接）
            window.open('https://mp.weixin.qq.com/s/VAOGD69Vl9f_VHsfgiwStw', '_blank');
            
            // 模拟检测是否完成打赏（实际项目中可以通过回调或轮询检测）
            // 这里为了演示效果，3秒后显示感谢动画
            setTimeout(() => {
                showThanks();
            }, 3000);
        }

        function showThanks() {
            const modal = document.getElementById('thanksModal');
            modal.classList.add('show');
            hasDonated = true;
            
            // 播放庆祝动画
            celebrate();
            
            // 添加额外的可乐雨效果
            createColaRain();
        }

        function closeThanks(e) {
            if (e && e.target !== e.currentTarget && !e.target.classList.contains('close-thanks')) return;
            document.getElementById('thanksModal').classList.remove('show');
        }

        function createColaRain() {
            const modal = document.getElementById('thanksModal');
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const cola = document.createElement('div');
                    cola.textContent = '🥤';
                    cola.style.position = 'absolute';
                    cola.style.left = Math.random() * 100 + '%';
                    cola.style.top = '-50px';
                    cola.style.fontSize = '2em';
                    cola.style.animation = 'fall 3s linear forwards';
                    cola.style.zIndex = '2001';
                    modal.appendChild(cola);
                    
                    setTimeout(() => cola.remove(), 3000);
                }, i * 200);
            }
        }

        // ========== 积木工厂逻辑 ==========
        function generateBlocks() {
            const perGroup = parseInt(document.getElementById('blockPerGroup').value);
            const groups = parseInt(document.getElementById('groupCount').value);
            const container = document.getElementById('blocksContainer');
            const total = perGroup * groups;
            
            document.getElementById('totalBlocks').value = total;
            container.innerHTML = '';
            
            const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#c7ceea', '#ffd93d', '#6bcf7f', '#4d96ff'];
            
            for (let g = 0; g < groups; g++) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                
                for (let i = 0; i < perGroup; i++) {
                    const block = document.createElement('div');
                    block.className = 'block';
                    block.style.background = colors[g % colors.length];
                    block.textContent = i + 1;
                    block.style.animationDelay = (g * perGroup + i) * 0.05 + 's';
                    groupDiv.appendChild(block);
                }
                
                const label = document.createElement('div');
                label.style.cssText = 'font-weight: bold; color: #666; margin-top: 5px;';
                label.textContent = `第${g + 1}堆`;
                groupDiv.appendChild(label);
                
                container.appendChild(groupDiv);
            }
            
            // 显示解释
            const explanation = document.getElementById('blockExplanation');
            const text = document.getElementById('explanationText');
            const formula = document.getElementById('blockFormula');
            
            explanation.style.display = 'block';
            text.innerHTML = `我们有 <strong>${groups}堆</strong> 积木，每堆 <strong>${perGroup}个</strong>。<br>
                用加法算是：${Array(groups).fill(perGroup).join('+')} = ${total}<br>
                用乘法算就简单多了：${perGroup} × ${groups} = ${total}`;
            
            formula.innerHTML = `${perGroup} × ${groups} = ${total} <span style="font-size: 0.5em; color: #999;">（${groups}个${perGroup}）</span>`;
            
            addScore(10);
        }

        // ========== 糖果商店逻辑 ==========
        let currentCandy = { price: 2, count: 5 };
        
        function initCandyShop() {
            newCandyProblem();
        }
        
        function newCandyProblem() {
            currentCandy.price = Math.floor(Math.random() * 4) + 2; // 2-5元
            currentCandy.count = Math.floor(Math.random() * 6) + 3; // 3-8个
            
            document.getElementById('candyPrice').textContent = currentCandy.price;
            document.getElementById('wantCount').textContent = currentCandy.count;
            document.getElementById('candyExplanation').style.display = 'none';
            
            // 生成糖果
            const jar = document.getElementById('candyJar');
            jar.innerHTML = '';
            const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];
            
            for (let i = 0; i < currentCandy.count; i++) {
                const candy = document.createElement('div');
                candy.className = 'candy';
                candy.style.background = colors[i % colors.length];
                candy.style.left = (20 + Math.random() * 60) + '%';
                candy.style.bottom = (10 + i * 12) + '%';
                candy.style.animationDelay = Math.random() * 2 + 's';
                jar.appendChild(candy);
            }
        }
        
        function shakeJar() {
            const jar = document.getElementById('candyJar');
            jar.style.animation = 'shake 0.5s';
            setTimeout(() => jar.style.animation = '', 500);
        }
        
        function checkCandyAnswer() {
            const total = currentCandy.price * currentCandy.count;
            const explanation = document.getElementById('candyExplanation');
            const solution = document.getElementById('candySolution');
            
            explanation.style.display = 'block';
            solution.innerHTML = `
                <div style="font-size: 1.3em; margin: 10px 0;">
                    每个糖果 ${currentCandy.price} 元，买 ${currentCandy.count} 个<br>
                    = ${currentCandy.price} × ${currentCandy.count}<br>
                    = <strong style="color: #e53e3e; font-size: 1.5em;">${total} 元</strong>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #e6fffa; border-radius: 10px;">
                     答对了！这就是乘法的用处，比一个一个加快多了！
                </div>
            `;
            
            addScore(20);
        }

        // ========== 口诀探险逻辑 ==========
        function initMemoryGame() {
            const level = document.getElementById('memoryLevel').value;
            const grid = document.getElementById('memoryGrid');
            grid.innerHTML = '';
            flippedCards = [];
            matchedPairs = 0;
            
            let maxNum = level === 'easy' ? 5 : level === 'medium' ? 7 : 9;
            let pairs = [];
            
            // 生成配对
            for (let i = 1; i <= maxNum; i++) {
                for (let j = 1; j <= (i <= 5 ? 5 : 3); j++) {
                    if (pairs.length < 8) { // 限制卡片数量
                        pairs.push({
                            id: pairs.length,
                            equation: `${i}×${j}`,
                            answer: (i * j).toString(),
                            pairId: pairs.length
                        });
                        pairs.push({
                            id: pairs.length,
                            equation: (i * j).toString(),
                            answer: `${i}×${j}`,
                            pairId: pairs.length - 1
                        });
                    }
                }
            }
            
            // 随机选择8对
            const selected = pairs.slice(0, 16);
            memoryPairs = selected.sort(() => Math.random() - 0.5);
            
            memoryPairs.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.index = index;
                card.dataset.pairId = item.pairId;
                card.textContent = '?';
                card.onclick = () => flipCard(card, item);
                grid.appendChild(card);
            });
            
            updateProgress();
        }
        
        function flipCard(card, item) {
            if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            card.classList.add('flipped');
            card.textContent = item.equation;
            flippedCards.push({ card, item });
            
            if (flippedCards.length === 2) {
                checkMatch();
            }
        }
        
        function checkMatch() {
            const [first, second] = flippedCards;
            const match = first.item.equation === second.item.answer || second.item.equation === first.item.answer;
            
            setTimeout(() => {
                if (match) {
                    first.card.classList.add('matched');
                    second.card.classList.add('matched');
                    matchedPairs++;
                    addScore(15);
                    
                    if (matchedPairs === 8) {
                        setTimeout(() => {
                            alert(' 太棒了！你记住了所有口诀！');
                            celebrate();
                        }, 500);
                    }
                } else {
                    first.card.classList.remove('flipped');
                    second.card.classList.remove('flipped');
                    first.card.textContent = '?';
                    second.card.textContent = '?';
                }
                flippedCards = [];
                updateProgress();
            }, 1000);
        }
        
        function updateProgress() {
            const progress = (matchedPairs / 8) * 100;
            document.getElementById('memoryProgress').style.width = progress + '%';
            document.getElementById('memoryProgress').textContent = Math.round(progress) + '%';
        }

        // ========== 冒险挑战逻辑 ==========
        const levels = [
            { type: 'mul', a: 2, b: 3, hint: '2个3相加：3+3=6' },
            { type: 'mul', a: 3, b: 4, hint: '3个4相加：4+4+4=12' },
            { type: 'div', a: 12, b: 3, hint: '12里面有几个3？想乘法：3×?=12' },
            { type: 'mul', a: 5, b: 5, hint: '五五二十五，记住这个特殊的！' },
            { type: 'div', a: 20, b: 4, hint: '20分成4份，每份几个？' },
            { type: 'mul', a: 4, b: 6, hint: '4个6：6+6+6+6=24' },
            { type: 'div', a: 18, b: 3, hint: '18里面有几个3？' },
            { type: 'mul', a: 7, b: 2, hint: '7个2：2+2+2+2+2+2+2=14' },
            { type: 'div', a: 15, b: 5, hint: '15分成5份，每份3个' },
            { type: 'mix', a: 3, b: 8, hint: '3×8=24，记住三八二十四！' }
        ];
        
        function initAdventure() {
            const selector = document.getElementById('levelSelector');
            selector.innerHTML = '';
            
            for (let i = 1; i <= 10; i++) {
                const btn = document.createElement('button');
                btn.className = 'level-btn';
                btn.textContent = i;
                
                if (i <= unlockedLevels) btn.classList.add('unlocked');
                if (i === currentLevel) btn.classList.add('current');
                
                btn.onclick = () => loadLevel(i);
                selector.appendChild(btn);
            }
        }
        
        function loadLevel(level) {
            if (level > unlockedLevels) return;
            currentLevel = level;
            
            const q = levels[level - 1];
            const questionBox = document.getElementById('questionText');
            const optionsBox = document.getElementById('answerOptions');
            const hintBox = document.getElementById('adventureHint');
            const hintText = document.getElementById('hintText');
            
            initAdventure(); // 刷新按钮状态
            
            let question, answer, wrongAnswers;
            
            if (q.type === 'mul') {
                question = `${q.a} × ${q.b} = ?`;
                answer = q.a * q.b;
            } else if (q.type === 'div') {
                question = `${q.a} ÷ ${q.b} = ?`;
                answer = q.a / q.b;
            } else {
                question = Math.random() > 0.5 ? `${q.a} × ${q.b} = ?` : `${q.a * q.b} ÷ ${q.a} = ?`;
                answer = q.b;
            }
            
            wrongAnswers = [answer + 1, answer - 1, answer + 2].filter(a => a > 0 && a !== answer);
            wrongAnswers = wrongAnswers.slice(0, 3);
            const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            questionBox.innerHTML = `<span style="color: #667eea;">第 ${level} 关</span><br>${question}`;
            optionsBox.innerHTML = '';
            hintText.textContent = q.hint;
            hintBox.classList.remove('show');
            
            allOptions.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => checkAnswer(btn, opt === answer, level);
                optionsBox.appendChild(btn);
            });
            
            // 3秒后显示提示
            setTimeout(() => hintBox.classList.add('show'), 3000);
        }
        
        function checkAnswer(btn, isCorrect, level) {
            if (isCorrect) {
                btn.classList.add('correct');
                addScore(50);
                
                setTimeout(() => {
                    if (level === currentLevel && level < 10) {
                        unlockedLevels = Math.max(unlockedLevels, level + 1);
                        loadLevel(level + 1);
                    } else if (level === 10) {
                        document.getElementById('questionText').innerHTML = 
                            ' 恭喜你！<br>你已经成为乘除法小超人了！<br>⭐⭐⭐';
                        document.getElementById('answerOptions').innerHTML = '';
                        celebrate();
                    }
                }, 1000);
            } else {
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 500);
            }
        }

        // 初始化
        window.onload = () => {
            generateBlocks();
            initCandyShop();
        };
    </script>
</body>
</html>`,
  shareCount: 5,
  isPublic: false,  // 👈 添加这一行
  createdAt: 1700000000000,
  updatedAt: 1700000000000
};