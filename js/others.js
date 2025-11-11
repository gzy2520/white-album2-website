//canvas脚本
// 初始化Canvas环境
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const coordDisplay = document.getElementById('pos');
const clearBtn = document.getElementById('clearBtn');
const initBtn = document.getElementById('initBtn');

// 初始化绘制基础图形
function initDraw() {
    // 纯白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    
    // 绘制蓝色三角形
    ctx.fillStyle = '#09d2fe';
    ctx.beginPath();
    ctx.moveTo(100, 0);  
    ctx.lineTo(0, 200);  
    ctx.lineTo(200, 200);  
    ctx.closePath();
    ctx.fill();
    
    // 绘制文字
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('White Album', 100, 200);
}

// 交互绘图功能
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// 按钮事件监听
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
});

initBtn.addEventListener('click', initDraw);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if(!isDrawing) return;
    
    // 实时更新坐标显示
    coordDisplay.textContent = `(${e.offsetX}, ${e.offsetY})`;
    
    // 固定蓝色画笔
    ctx.strokeStyle = '#09d2fe'; // 蓝色
    ctx.lineWidth = 4; // 固定线宽
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 开始绘制路径
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    // 更新坐标点
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 初始化画布
initDraw();



 // 百度地图功能实现
    let map = null;
    let geolocation = null;
    
    // 初始化地图
    function initMap() {
        // 创建地图实例
        map = new BMap.Map("map-container");
        
        // 创建初始点（北京）
        const point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 12);
        
        // 添加缩放控件
        map.addControl(new BMap.NavigationControl());
        
        // 添加比例尺控件
        map.addControl(new BMap.ScaleControl());
        
        // 添加地图类型控件
        map.addControl(new BMap.MapTypeControl());
        
        // 启用滚轮缩放
        map.enableScrollWheelZoom(true);
        
        // 监听地图缩放事件
        map.addEventListener("zoomend", function() {
            console.log("当前缩放级别: " + map.getZoom());
        });
        
        // 尝试获取用户位置
        geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                const pt = r.point;
                map.panTo(pt);
                
                // 添加标记
                const marker = new BMap.Marker(pt);
                map.addOverlay(marker);
                
                // 显示位置信息
                document.getElementById("current-location").textContent = "定位成功";
                document.getElementById("coordinates").textContent = 
                    `经度: ${pt.lng.toFixed(6)}, 纬度: ${pt.lat.toFixed(6)}`;
            } else {
                document.getElementById("current-location").textContent = "定位失败";
            }
        });
    }
    
    // 定位按钮事件
    document.getElementById("locate-btn").addEventListener("click", function() {
        if (geolocation) {
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    const pt = r.point;
                    map.panTo(pt);
                    map.setZoom(15);
                    
                    // 清除旧标记
                    map.clearOverlays();
                    
                    // 添加新标记
                    const marker = new BMap.Marker(pt);
                    map.addOverlay(marker);
                    
                    // 显示位置信息
                    document.getElementById("current-location").textContent = "定位成功";
                    document.getElementById("coordinates").textContent = 
                        `经度: ${pt.lng.toFixed(6)}, 纬度: ${pt.lat.toFixed(6)}`;
                } else {
                    document.getElementById("current-location").textContent = "定位失败";
                }
            });
        }
    });
    
    // 重置地图视图
    document.getElementById("reset-map").addEventListener("click", function() {
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
        map.clearOverlays();
        document.getElementById("current-location").textContent = "已重置";
        document.getElementById("coordinates").textContent = "-";
    });
    
    // 初始化地图
    window.onload = function() {
        initMap();
    };



// others.js 文件内容
document.addEventListener('DOMContentLoaded', function() {
    // 获取相关DOM元素
    const searchForm = document.getElementById('entrezSearchForm');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsList = document.getElementById('resultsList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const pagination = document.getElementById('pagination');
    const deepMining = document.getElementById('deepMining');
    
    let currentMode = 'get'; // 默认模式
    
    // 模式切换功能
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
        });
    });
    
    // 表单提交处理
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const db = document.getElementById('databaseSelect').value;
        const term = document.getElementById('searchTerm').value.trim();
        
        if (!term) {
            showError('请输入搜索关键词');
            return;
        }
        
        // 清空之前的结果
        resultsList.innerHTML = '';
        pagination.innerHTML = '';
        deepMining.style.display = 'none';
        hideError();
        showLoading();
        
        // 根据当前模式调用不同的搜索方法
        switch(currentMode) {
            case 'get':
                searchWithGet(db, term);
                break;
            case 'post':
                searchWithPost(db, term);
                break;
            case 'session':
                searchWithSession(db, term);
                break;
        }
    });
    
    // 显示加载指示器
    function showLoading() {
        loadingIndicator.style.display = 'block';
        resultsContainer.style.display = 'none';
    }
    
    // 隐藏加载指示器
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    // 显示错误信息
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // 隐藏错误信息
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    // GET模式搜索
    function searchWithGet(db, term) {
        // 构造GET请求URL
        const url = `entrez_get.php?db=${encodeURIComponent(db)}&term=${encodeURIComponent(term)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('网络响应错误');
                return response.text();
            })
            .then(xmlData => {
                processResults(xmlData, db);
            })
            .catch(error => {
                hideLoading();
                showError(`GET模式搜索失败: ${error.message}`);
            });
    }
    
    // POST模式搜索
    function searchWithPost(db, term) {
        const formData = new FormData();
        formData.append('db', db);
        formData.append('term', term);
        
        fetch('entrez_post.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('网络响应错误');
            return response.text();
        })
        .then(xmlData => {
            processResults(xmlData, db);
        })
        .catch(error => {
            hideLoading();
            showError(`POST模式搜索失败: ${error.message}`);
        });
    }
    
    // SESSION模式搜索
    function searchWithSession(db, term) {
        const formData = new FormData();
        formData.append('db', db);
        formData.append('term', term);
        
        fetch('Entrez_do.php?mode=session', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('网络响应错误');
            return response.text();
        })
        .then(xmlData => {
            processResults(xmlData, db);
        })
        .catch(error => {
            hideLoading();
            showError(`SESSION模式搜索失败: ${error.message}`);
        });
    }
    
    // 处理并显示结果
    function processResults(xmlData, db) {
        hideLoading();
        
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "text/xml");
            
            // 检查是否有错误
            const errorNode = xmlDoc.querySelector('ERROR');
            if (errorNode) {
                showError(`NCBI返回错误: ${errorNode.textContent}`);
                return;
            }
            
            // 获取结果计数
            const countNode = xmlDoc.querySelector('Count');
            const resultCount = countNode ? parseInt(countNode.textContent) : 0;
            
            if (resultCount === 0) {
                resultsList.innerHTML = '<div class="result-item">未找到匹配结果</div>';
                resultsContainer.style.display = 'block';
                return;
            }
            
            // 更新结果计数
            document.getElementById('resultsCount').textContent = `找到 ${resultCount} 条结果`;
            
            // 获取ID列表
            const idNodes = xmlDoc.querySelectorAll('IdList Id');
            const ids = Array.from(idNodes).map(node => node.textContent);
            
            // 显示前10个结果
            displayResults(ids.slice(0, 10), db, resultCount);
            
            // 显示分页
            if (resultCount > 10) {
                createPagination(resultCount);
            }
            
            // 显示深度挖掘工具
            deepMining.style.display = 'block';
            
        } catch (error) {
            showError(`结果解析失败: ${error.message}`);
        }
    }
    
    // 显示结果列表
    function displayResults(ids, db, totalCount) {
        resultsList.innerHTML = '';
        
        ids.forEach(id => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // 根据数据库类型构造链接
            let link;
            switch(db) {
                case 'pubmed':
                    link = `https://pubmed.ncbi.nlm.nih.gov/${id}/`;
                    break;
                case 'nucleotide':
                    link = `https://www.ncbi.nlm.nih.gov/nuccore/${id}`;
                    break;
                case 'protein':
                    link = `https://www.ncbi.nlm.nih.gov/protein/${id}`;
                    break;
                default:
                    link = `https://www.ncbi.nlm.nih.gov/search/all/?term=${id}`;
            }
            
            resultItem.innerHTML = `
                <a href="${link}" target="_blank" class="result-title">文献 ID: ${id}</a>
                <div class="result-meta">
                    <span>数据库: ${db}</span>
                    <span>ID: ${id}</span>
                </div>
            `;
            resultsList.appendChild(resultItem);
        });
        
        resultsContainer.style.display = 'block';
    }
    
    // 创建分页控件
    function createPagination(totalCount) {
        const pageCount = Math.ceil(totalCount / 10);
        pagination.innerHTML = '';
        
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                // 在实际应用中，这里应该加载对应页面的结果
                alert(`加载第 ${i} 页结果 (实际应用中会发送新请求)`);
            });
            pagination.appendChild(pageButton);
        }
    }
    
    // 深度挖掘工具事件处理
    document.querySelectorAll('.tool-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.dataset.tool;
            alert(`执行深度挖掘: ${tool} (实际应用中会发送请求)`);
        });
    });
    
    // 其他页面功能（画布、地图等）保持不变...
    // 这里保留您原有的画布和地图功能代码
    // ...
});