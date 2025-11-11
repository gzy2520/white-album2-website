/* 欢迎弹窗 (1) */
window.addEventListener('DOMContentLoaded', () => {
    alert('欢迎访问白色相簿2专题站！');
});

/* 关闭提示 (2) */
window.onbeforeunload = function(e) {
    e.preventDefault();
    e.returnValue = '确定要离开吗？';
};

/* 防沉迷计时器 (6) 和页面时钟 (7) - 修复版 */
// 确保页面时钟元素存在
const clock = document.getElementById('page-clock') || document.createElement('li');
clock.id = 'page-clock';
clock.style.cssText = `
    display: inline-block;
    padding: 0 15px;
    color: #fff;
    font-size: 14px;
`;

// 创建防沉迷计时器元素
const studyTimerDiv = document.createElement('li');
studyTimerDiv.id = 'study-timer';
studyTimerDiv.style.cssText = `
    display: inline-block;
    padding: 0 15px;
    color: #fff;
    font-size: 14px;
`;

// 插入到登录栏
const loginbar = document.querySelector('.top .loginbar');
if (loginbar) {
    // 确保时钟元素在DOM中
if (!document.getElementById('page-clock')) {
    loginbar.insertBefore(clock, loginbar.children[1]); // 插入到第二个位置
  }
    
// 插入防沉迷计时器
  loginbar.insertBefore(studyTimerDiv, loginbar.children[2] || null); // 插入到第三个位置
}

/* 防沉迷计时器功能 */
let studyTimer;
let studyTime = 60 * 60; // 1小时（秒）

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startStudyTimer() {
    // 初始显示
    studyTimerDiv.textContent = `浏览时间: ${formatTime(studyTime)}`;
    
    studyTimer = setInterval(() => {
        studyTime--;
        studyTimerDiv.textContent = `浏览时间: ${formatTime(studyTime)}`;
        
        if (studyTime <= 0) {
            clearInterval(studyTimer);
            // 弹出警告框
            alert('您已经连续浏览1小时，请注意休息，保护视力！');
            // 重置计时器（可选）
            studyTime = 60 * 60;
            startStudyTimer();
        }
    }, 1000);
}

/* 实时时钟功能 */
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleString('zh-CN', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
}

// 启动两个计时器
startStudyTimer();
setInterval(updateClock, 1000);
updateClock();

/* 鼠标轨迹动画 (9) */
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: rgba(9, 210, 254, 0.5);
        border-radius: 50%;
        pointer-events: none;
        left: ${e.pageX - 5}px;
        top: ${e.pageY - 5}px;
        animation: trail 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
});

// 处理浏览器自动播放限制
document.addEventListener('DOMContentLoaded', function() {
    const bgm = document.getElementById('bgm');
    
    // 尝试自动播放
    const playPromise = bgm.play();
    
    // 处理播放被拦截的情况
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // 添加点击事件监听
            document.body.addEventListener('click', function() {
                bgm.play();
            }, { once: true });
            
            // 显示提示信息
            const tip = document.createElement('div');
            tip.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                background: rgba(9,210,254,0.9);
                color: white;
                border-radius: 5px;
                z-index: 10000;
            `;
            tip.textContent = '点击页面任意位置启用背景音乐';
            document.body.appendChild(tip);
            
            setTimeout(() => tip.remove(), 3000);
        });
    }
});

// 初始化特定页面的功能
function initializePage(pageName) {
    switch(pageName) {
        case 'appreciate':
            initMusicPlayer(); // 初始化音乐播放器
            break;
        case 'others':
            // 初始化地图或其他功能
            break;
        // 其他页面的初始化代码...
    }
}

// AJAX加载页面内容的核心函数
function loadPage(pageName) {
    // 显示加载动画
    $('#loader').show();
    $('#page-content').hide();
    
    // 根据页面名称确定要加载的URL
    const pageMap = {
        'index': 'index.html',
        'role': 'role.html',
        'appreciate': 'appreciate.html',
        'story': 'story.html',
        'others': 'others.html'
    };
    
    const url = pageMap[pageName] || 'index.html';
    
    // 使用AJAX加载页面内容
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            // 提取目标页面中我们关心的内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            
            // 获取目标页面中的容器内容
            const content = doc.querySelector('.container') || 
                            doc.querySelector('#content-container') || 
                            doc.createElement('div');
            
            // 设置内容区域并添加动画效果
            setTimeout(function() {
                $('#page-content').html(content.innerHTML);
                $('#loader').hide();
                $('#page-content').fadeIn(600);
                
                // 添加页面特定的初始化代码
                initializePage(pageName);
            }, 600);
        },
        error: function() {
            $('#loader').hide();
            $('#page-content').html('<div class="error-message"><h3>页面加载失败</h3><p>请稍后再试或选择其他页面</p></div>').fadeIn();
        }
    });
}
// 初始化特定页面的功能
function initializePage(pageName) {
    switch(pageName) {
        case 'appreciate':
            initMusicPlayer(); // 初始化音乐播放器
            break;
        case 'others':
            // 初始化地图或其他功能
            break;
        // 其他页面的初始化代码...
    }
}