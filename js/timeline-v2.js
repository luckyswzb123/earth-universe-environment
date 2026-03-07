// 中国航天时间轴 V2 - 紧凑版
class TimelineV2 {
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
        const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const smallScreen = window.innerWidth <= 768;
        
        return userAgent || (touchDevice && smallScreen);
    }

    // 初始化
    init() {
        this.createStars();
        this.setupEventListeners();
        this.switchEvent('1970');
        this.setupResponsiveHandlers();
        this.preventDoubleClickZoom();
    }

    // 防止双击缩放
    preventDoubleClickZoom() {
        if (!this.isTouch) return;
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // 生成星空背景
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        const numberOfStars = this.isMobile ? 80 : 120;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = Math.random() * 2 + 0.5;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            starsContainer.appendChild(star);
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 时间轴节点点击事件
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => {
            // 为所有设备添加点击事件，移动设备会自动处理
            node.addEventListener('click', (e) => {
                e.preventDefault();
                const year = node.dataset.year;
                this.switchEvent(year);
                
                // 停止自动播放
                if (this.isAutoplay) {
                    this.toggleAutoplay();
                }
            });
            
            // 移动设备专用触摸事件
            if (this.isTouch) {
                node.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    node.style.transform = 'scale(1.1)';
                });
                
                node.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    node.style.transform = 'scale(1)';
                    const year = node.dataset.year;
                    this.switchEvent(year);
                    
                    // 停止自动播放
                    if (this.isAutoplay) {
                        this.toggleAutoplay();
                    }
                });
                
                // 防止触摸滑动时误触
                node.addEventListener('touchmove', (e) => {
                    e.preventDefault();
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

        // 图片加载错误处理
        this.setupImageErrorHandling();
    }

    // 设置图片错误处理
    setupImageErrorHandling() {
        const images = document.querySelectorAll('.event-image');
        images.forEach(img => {
            // 强制设置图片可见
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            
            // 添加加载开始的处理
            img.addEventListener('load', () => {
                console.log(`图片加载成功: ${img.src}`);
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            });
            
            // 添加加载错误的处理
            img.addEventListener('error', () => {
                console.log(`图片加载失败: ${img.src}`);
                // 如果图片加载失败，使用占位符
                img.src = this.generatePlaceholderImage(img.alt);
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            });
            
            // 检查图片当前状态
            if (img.complete && img.naturalHeight !== 0) {
                console.log(`图片已加载: ${img.src}`);
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            } else if (img.complete && img.naturalHeight === 0) {
                console.log(`图片加载失败，使用占位符: ${img.src}`);
                img.src = this.generatePlaceholderImage(img.alt);
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            } else {
                console.log(`图片开始加载: ${img.src}`);
            }
        });
    }

    // 生成占位符图片
    generatePlaceholderImage(text) {
        // 根据设备类型调整尺寸
        const width = this.isMobile ? 300 : 400;
        const height = this.isMobile ? 150 : 200;
        const fontSize = this.isMobile ? 14 : 16;
        
        // 创建一个简单的SVG占位符
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1a2e"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" fill="#e6b800" text-anchor="middle" dy=".3em">
                    ${text}
                </text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }

    // 设置响应式处理器
    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            // 如果设备类型发生变化，重新调整
            if (wasMobile !== this.isMobile) {
                this.adjustForDevice();
            }
        });

        // 屏幕方向变化时重新调整
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.adjustForDevice();
            }, 100);
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
            const speed = this.isMobile ? 5000 : 4000; // 移动设备稍慢
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
                
                // 重新处理当前显示项的图片
                const currentImages = item.querySelectorAll('.event-image');
                currentImages.forEach(img => {
                    // 强制设置图片可见
                    img.style.display = 'block';
                    img.style.visibility = 'visible';
                    img.style.opacity = '1';
                    
                    console.log(`切换事件，处理图片: ${img.src}`);
                    
                    // 如果图片已经加载完成，直接显示
                    if (img.complete && img.naturalHeight !== 0) {
                        console.log(`图片已加载，直接显示: ${img.src}`);
                    } else if (img.complete && img.naturalHeight === 0) {
                        // 图片加载失败，使用占位符
                        console.log(`图片加载失败，使用占位符: ${img.src}`);
                        img.src = this.generatePlaceholderImage(img.alt);
                    } else {
                        console.log(`图片未加载，等待加载: ${img.src}`);
                    }
                });
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
            const speed = this.isMobile ? 5000 : 4000;
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
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    window.timelineV2 = new TimelineV2();
});

// 全局函数（供HTML调用）
window.previousEvent = function() {
    if (window.timelineV2) {
        window.timelineV2.previousEvent();
    }
};

window.nextEvent = function() {
    if (window.timelineV2) {
        window.timelineV2.nextEvent();
    }
};

window.toggleAutoplay = function() {
    if (window.timelineV2) {
        window.timelineV2.toggleAutoplay();
    }
};
