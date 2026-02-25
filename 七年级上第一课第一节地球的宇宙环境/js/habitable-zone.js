// 宜居带演示器 JavaScript
class HabitableZone {
    constructor() {
        // 全局变量
        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;

        // 响应式变量
        this.isMobile = this.detectMobile();
        this.isTouch = 'ontouchstart' in window;

        this.init();
    }

    // 检测移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && this.isTouch);
    }

    // 初始化
    init() {
        this.createStars();
        this.setupEventListeners();
        this.updateZoneInfo();
        this.setupResponsiveHandlers();
    }

    // 生成星空背景
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        const numberOfStars = this.isMobile ? 100 : 150;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = Math.random() * 2 + 0.5;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            star.style.animationDelay = Math.random() * 4 + 's';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            starsContainer.appendChild(star);
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        const earth = document.getElementById('earth');
        const habitableZone = document.getElementById('habitableZone');
        
        if (!earth || !habitableZone) return;

        // 根据设备类型设置事件
        if (this.isTouch) {
            // 触摸事件
            earth.addEventListener('touchstart', (e) => this.dragStart(e));
            document.addEventListener('touchmove', (e) => this.drag(e));
            document.addEventListener('touchend', (e) => this.dragEnd(e));
        } else {
            // 鼠标事件
            earth.addEventListener('mousedown', (e) => this.dragStart(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', (e) => this.dragEnd(e));
        }

        // 控制按钮
        const resetBtn = document.querySelector('[onclick="resetEarth()"]');
        const helpBtn = document.querySelector('[onclick="showHelp()"]');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetEarth());
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelp());
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        // 防止文本选择
        document.addEventListener('selectstart', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        });
    }

    // 设置响应式处理器
    setupResponsiveHandlers() {
        // 窗口大小变化时重新检测设备类型
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.adjustForDevice();
        });

        // 初始调整
        this.adjustForDevice();
    }

    // 根据设备调整
    adjustForDevice() {
        const earth = document.getElementById('earth');
        if (!earth) return;

        // 移动设备上调整地球大小
        if (this.isMobile) {
            earth.style.width = '30px';
            earth.style.height = '30px';
        } else {
            earth.style.width = '40px';
            earth.style.height = '40px';
        }
    }

    // 拖拽开始
    dragStart(e) {
        const earth = document.getElementById('earth');
        if (!earth) return;

        if (e.target === earth) {
            this.isDragging = true;
            earth.classList.add('dragging');

            // 获取初始位置
            if (this.isTouch) {
                const touch = e.touches[0];
                this.initialX = touch.clientX - this.xOffset;
                this.initialY = touch.clientY - this.yOffset;
            } else {
                this.initialX = e.clientX - this.xOffset;
                this.initialY = e.clientY - this.yOffset;
            }
        }
    }

    // 拖拽中
    drag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        // 计算当前位置
        if (this.isTouch) {
            const touch = e.touches[0];
            this.currentX = touch.clientX - this.initialX;
            this.currentY = touch.clientY - this.initialY;
        } else {
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
        }

        this.xOffset = this.currentX;
        this.yOffset = this.currentY;

        // 限制在宜居带区域内
        this.constrainEarthPosition();
        
        // 更新区域信息
        this.updateZoneInfo();
    }

    // 拖拽结束
    dragEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        const earth = document.getElementById('earth');
        if (earth) {
            earth.classList.remove('dragging');
        }

        this.initialX = this.currentX;
        this.initialY = this.currentY;
    }

    // 限制地球位置
    constrainEarthPosition() {
        const habitableZone = document.getElementById('habitableZone');
        const earth = document.getElementById('earth');
        
        if (!habitableZone || !earth) return;

        const rect = habitableZone.getBoundingClientRect();
        const earthRect = earth.getBoundingClientRect();
        
        let newX = this.currentX;
        let newY = this.currentY;
        
        // X轴限制
        if (earthRect.left < rect.left + 20) {
            newX = rect.left + 20 - earth.offsetLeft;
        } else if (earthRect.right > rect.right - 20) {
            newX = rect.right - 20 - earth.offsetLeft - earth.offsetWidth;
        }
        
        // Y轴限制
        if (earthRect.top < rect.top + 20) {
            newY = rect.top + 20 - earth.offsetTop;
        } else if (earthRect.bottom > rect.bottom - 20) {
            newY = rect.bottom - 20 - earth.offsetTop - earth.offsetHeight;
        }

        // 应用位置
        earth.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px))`;
        
        this.currentX = newX;
        this.currentY = newY;
    }

    // 更新区域信息
    updateZoneInfo() {
        const habitableZone = document.getElementById('habitableZone');
        const earth = document.getElementById('earth');
        
        if (!habitableZone || !earth) return;

        const rect = habitableZone.getBoundingClientRect();
        const earthRect = earth.getBoundingClientRect();
        
        // 计算地球中心位置
        const earthCenterX = earthRect.left + earthRect.width / 2;
        const earthCenterY = earthRect.top + earthRect.height / 2;
        
        // 计算与太阳的距离
        const sunCenterX = rect.left + rect.width / 2;
        const sunCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(earthCenterX - sunCenterX, 2) + 
            Math.pow(earthCenterY - sunCenterY, 2)
        );
        
        // 计算相对位置 (0-1)
        const relativeDistance = distance / (rect.width / 2);
        
        // 计算温度 (简化公式)
        const temp = Math.round(100 - relativeDistance * 300);
        
        // 确定区域
        let zone, zoneClass, waterState, conclusion, zoneDesc, waterDesc, conclusionDesc;
        
        if (relativeDistance < 0.25) {
            zone = '太热';
            zoneClass = 'zone-hot';
            waterState = '气态';
            conclusion = '不适合';
            zoneDesc = '距离太阳太近，温度过高';
            waterDesc = '水以气态形式存在，无法形成液态海洋';
            conclusionDesc = '高温环境不适合生命存在';
        } else if (relativeDistance < 0.75) {
            zone = '宜居';
            zoneClass = 'zone-habitable';
            waterState = '液态';
            conclusion = '适合生命';
            zoneDesc = '适合生命存在的理想区域';
            waterDesc = '水以液态形式存在，可以形成海洋';
            conclusionDesc = '温度适中，有利于生命繁衍';
        } else {
            zone = '太冷';
            zoneClass = 'zone-cold';
            waterState = '固态';
            conclusion = '不适合';
            zoneDesc = '距离太阳太远，温度过低';
            waterDesc = '水以固态形式存在，形成冰雪';
            conclusionDesc = '低温环境不适合复杂生命存在';
        }
        
        // 更新显示
        this.updateDisplay(zone, zoneClass, temp, waterState, conclusion, zoneDesc, waterDesc, conclusionDesc);
    }

    // 更新显示
    updateDisplay(zone, zoneClass, temp, waterState, conclusion, zoneDesc, waterDesc, conclusionDesc) {
        const currentZoneEl = document.getElementById('currentZone');
        const currentTempEl = document.getElementById('currentTemp');
        const waterStateEl = document.getElementById('waterState');
        const conclusionEl = document.getElementById('conclusion');
        const zoneDescriptionEl = document.getElementById('zoneDescription');
        const waterDescriptionEl = document.getElementById('waterDescription');
        const conclusionDescriptionEl = document.getElementById('conclusionDescription');
        
        if (currentZoneEl) {
            currentZoneEl.textContent = zone;
            currentZoneEl.className = 'info-value ' + zoneClass;
        }
        
        if (zoneDescriptionEl) {
            zoneDescriptionEl.textContent = zoneDesc;
        }
        
        if (currentTempEl) {
            currentTempEl.textContent = temp + '℃';
        }
        
        if (waterStateEl) {
            waterStateEl.textContent = waterState;
        }
        
        if (waterDescriptionEl) {
            waterDescriptionEl.textContent = waterDesc;
        }
        
        if (conclusionEl) {
            conclusionEl.textContent = conclusion;
        }
        
        if (conclusionDescriptionEl) {
            conclusionDescriptionEl.textContent = conclusionDesc;
        }
        
        // 更新温度计
        this.updateThermometer(temp);
    }

    // 更新温度计
    updateThermometer(temp) {
        const thermometerFill = document.getElementById('thermometerFill');
        if (!thermometerFill) return;
        
        // 温度范围 -200℃ 到 100℃，映射到 0% 到 100%
        const percentage = Math.max(0, Math.min(100, (temp + 200) / 300 * 100));
        thermometerFill.style.height = percentage + '%';
    }

    // 重置地球位置
    resetEarth() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        const earth = document.getElementById('earth');
        if (earth) {
            earth.style.transform = 'translate(-50%, -50%)';
        }
        
        this.updateZoneInfo();
    }

    // 显示帮助
    showHelp() {
        const helpText = '使用说明：\n\n' +
                       '1. 拖拽地球到不同位置\n' +
                       '2. 观察温度和区域变化\n' +
                       '3. 了解宜居带的科学原理\n\n' +
                       '宜居带是指恒星周围适合生命存在的区域范围。';
        
        // 移动设备使用alert，桌面使用自定义对话框
        if (this.isMobile) {
            alert(helpText);
        } else {
            this.showCustomDialog('使用帮助', helpText);
        }
    }

    // 显示自定义对话框
    showCustomDialog(title, message) {
        // 创建对话框元素
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #e6b800;
            border-radius: 15px;
            padding: 30px;
            z-index: 10000;
            max-width: 400px;
            color: white;
            backdrop-filter: blur(10px);
        `;
        
        dialog.innerHTML = `
            <h3 style="color: #e6b800; margin-bottom: 15px;">${title}</h3>
            <p style="line-height: 1.6; white-space: pre-line;">${message}</p>
            <button onclick="this.parentElement.remove()" style="
                background: #e6b800;
                color: #0a0a15;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
                font-weight: 600;
            ">确定</button>
        `;
        
        document.body.appendChild(dialog);
    }

    // 键盘事件
    onKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.xOffset -= 10;
                this.constrainEarthPosition();
                this.updateZoneInfo();
                break;
            case 'ArrowRight':
                this.xOffset += 10;
                this.constrainEarthPosition();
                this.updateZoneInfo();
                break;
            case 'ArrowUp':
                this.yOffset -= 10;
                this.constrainEarthPosition();
                this.updateZoneInfo();
                break;
            case 'ArrowDown':
                this.yOffset += 10;
                this.constrainEarthPosition();
                this.updateZoneInfo();
                break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                this.resetEarth();
                break;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.habitableZone = new HabitableZone();
});

// 全局函数（供HTML调用）
window.resetEarth = function() {
    if (window.habitableZone) {
        window.habitableZone.resetEarth();
    }
};

window.showHelp = function() {
    if (window.habitableZone) {
        window.habitableZone.showHelp();
    }
};
