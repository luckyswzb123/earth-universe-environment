// 中国航天时间轴 JavaScript
class Timeline {
    constructor() {
        // 全局变量
        this.currentEvent = 0;
        this.autoplayInterval = null;
        this.isAutoplay = false;
        this.events = ['1970', '2003', '2013', '2020', '2022'];

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
        this.switchEvent('1970');
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
        // 时间轴节点点击事件
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => {
            if (this.isTouch) {
                node.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    const year = node.dataset.year;
                    this.switchEvent(year);
                    
                    // 停止自动播放
                    if (this.isAutoplay) {
                        this.toggleAutoplay();
                    }
                });
            } else {
                node.addEventListener('click', () => {
                    const year = node.dataset.year;
                    this.switchEvent(year);
                    
                    // 停止自动播放
                    if (this.isAutoplay) {
                        this.toggleAutoplay();
                    }
                });
            }
        });

        // 控制按钮
        const prevBtn = document.querySelector('[onclick="previousEvent()"]');
        const nextBtn = document.querySelector('[onclick="nextEvent()"]');
        const autoplayBtn = document.querySelector('[onclick="toggleAutoplay()"]');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousEvent());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextEvent());
        }
        
        if (autoplayBtn) {
            autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        }

        // 键盘控制
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        // 页面可见性改变时的处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isAutoplay) {
                this.toggleAutoplay();
            }
        });
    }

    // 设置响应式处理器
    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.adjustForDevice();
        });

        this.adjustForDevice();
    }

    // 根据设备调整
    adjustForDevice() {
        // 移动设备上的调整
        if (this.isMobile) {
            // 可以在这里添加移动设备特定的调整
            this.adjustAutoplaySpeed();
        }
    }

    // 调整自动播放速度
    adjustAutoplaySpeed() {
        if (this.isAutoplay && this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            const speed = this.isMobile ? 6000 : 5000; // 移动设备稍慢
            this.autoplayInterval = setInterval(() => this.nextEvent(), speed);
        }
    }

    // 切换事件
    switchEvent(year) {
        // 更新节点状态
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => {
            node.classList.remove('active');
            if (node.dataset.year === year) {
                node.classList.add('active');
            }
        });

        // 更新内容显示
        const items = document.querySelectorAll('.event-item');
        items.forEach(item => {
            item.style.display = 'none';
            if (item.dataset.year === year) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            }
        });

        // 更新当前事件索引
        this.currentEvent = this.events.indexOf(year);
    }

    // 上一个事件
    previousEvent() {
        this.currentEvent = (this.currentEvent - 1 + this.events.length) % this.events.length;
        this.switchEvent(this.events[this.currentEvent]);
    }

    // 下一个事件
    nextEvent() {
        this.currentEvent = (this.currentEvent + 1) % this.events.length;
        this.switchEvent(this.events[this.currentEvent]);
    }

    // 切换自动播放
    toggleAutoplay() {
        const indicator = document.getElementById('autoplayIndicator');
        const autoplayBtn = document.querySelector('[onclick="toggleAutoplay()"]');
        
        if (this.isAutoplay) {
            clearInterval(this.autoplayInterval);
            this.isAutoplay = false;
            if (indicator) {
                indicator.classList.remove('active');
            }
            if (autoplayBtn) {
                autoplayBtn.textContent = '自动播放';
            }
        } else {
            const speed = this.isMobile ? 6000 : 5000;
            this.autoplayInterval = setInterval(() => this.nextEvent(), speed);
            this.isAutoplay = true;
            if (indicator) {
                indicator.classList.add('active');
            }
            if (autoplayBtn) {
                autoplayBtn.textContent = '停止播放';
            }
        }
    }

    // 键盘控制
    onKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.previousEvent();
                break;
            case 'ArrowRight':
                this.nextEvent();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay();
                break;
        }
    }
}

// 添加淡入动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    window.timeline = new Timeline();
});

// 全局函数（供HTML调用）
window.previousEvent = function() {
    if (window.timeline) {
        window.timeline.previousEvent();
    }
};

window.nextEvent = function() {
    if (window.timeline) {
        window.timeline.nextEvent();
    }
};

window.toggleAutoplay = function() {
    if (window.timeline) {
        window.timeline.toggleAutoplay();
    }
};
