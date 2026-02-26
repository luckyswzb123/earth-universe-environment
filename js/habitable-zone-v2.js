// 宜居带演示器 V2 - 科学版
class HabitableZoneV2 {
    constructor() {
        // 天文常数
        this.AU = 149597870.7; // 1天文单位 = 公里
        this.SOLAR_LUMINOSITY = 3.828e26; // 太阳光度 (瓦特)
        this.STEFAN_BOLTZMANN = 5.67e-8; // 斯特藩-玻尔兹曼常数
        this.EARTH_ALBEDO = 0.306; // 地球反照率
        this.GREENHOUSE_EFFECT = 1.2; // 温室效应因子
        
        // 行星真实数据
        this.planetsData = {
            mercury: {
                name: '水星',
                distance: 0.387, // AU
                radius: 2439.7, // km
                albedo: 0.088,
                greenhouse: 0.0,
                color: '#8c7853',
                description: '最靠近太阳的行星，昼夜温差极大'
            },
            venus: {
                name: '金星',
                distance: 0.723, // AU
                radius: 6051.8, // km
                albedo: 0.770,
                greenhouse: 500.0, // 极强的温室效应
                color: '#ffd700',
                description: '浓厚的二氧化碳大气，表面温度极高'
            },
            earth: {
                name: '地球',
                distance: 1.000, // AU
                radius: 6371.0, // km
                albedo: 0.306,
                greenhouse: 1.2,
                color: '#2196f3',
                description: '完美的距离，液态水，适宜生命'
            },
            mars: {
                name: '火星',
                distance: 1.524, // AU
                radius: 3389.5, // km
                albedo: 0.250,
                greenhouse: 1.0,
                color: '#ff5722',
                description: '距离较远，温度低，水以冰形式存在'
            }
        };
        
        // 全局变量
        this.isDragging = false;
        this.currentDistance = 1.0; // AU
        this.currentPlanet = 'earth';
        this.particles = [];
        this.isMobile = this.detectMobile();
        
        this.init();
    }

    // 检测移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }

    // 初始化
    init() {
        this.createStars();
        this.setupEventListeners();
        this.updateEnvironment();
        this.createParticles();
        this.setupResponsiveHandlers();
    }

    // 创建星空背景
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        const numberOfStars = this.isMobile ? 100 : 200;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            star.style.animationDelay = Math.random() * 4 + 's';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            starsContainer.appendChild(star);
        }
    }

    // 计算温度（基于真实物理公式）
    calculateTemperature(distance, albedo, greenhouse) {
        // 使用简化版的能量平衡方程
        // T = ((L(1-A) / (16πσD²))^(1/4)) * Greenhouse^(1/4)
        const distanceKm = distance * this.AU;
        const term1 = (this.SOLAR_LUMINOSITY * (1 - albedo)) / (16 * Math.PI * this.STEFAN_BOLTZMANN * Math.pow(distanceKm * 1000, 2));
        const temperature = Math.pow(term1, 0.25) * Math.pow(greenhouse, 0.25);
        
        return temperature - 273.15; // 转换为摄氏度
    }

    // 确定宜居带区域
    determineHabitableZone(temperature) {
        if (temperature > 100) {
            return {
                zone: '过热区',
                zoneClass: 'too-hot',
                waterState: '水蒸气',
                lifeSuitability: '不适合',
                description: '温度过高，水完全蒸发'
            };
        } else if (temperature >= 0 && temperature <= 50) {
            return {
                zone: '宜居带',
                zoneClass: 'habitable',
                waterState: '液态水',
                lifeSuitability: '适合生命',
                description: '温度适中，液态水存在'
            };
        } else if (temperature > -50 && temperature < 0) {
            return {
                zone: '寒冷区',
                zoneClass: 'cold',
                waterState: '冰',
                lifeSuitability: '可能存在',
                description: '温度较低，水以冰形式存在'
            };
        } else {
            return {
                zone: '极寒区',
                zoneClass: 'extreme-cold',
                waterState: '固态冰',
                lifeSuitability: '不适合',
                description: '温度极低，环境恶劣'
            };
        }
    }

    // 更新环境显示
    updateEnvironment() {
        const planet = this.planetsData[this.currentPlanet];
        const temperature = this.calculateTemperature(
            this.currentDistance, 
            planet.albedo, 
            planet.greenhouse
        );
        
        const zone = this.determineHabitableZone(temperature);
        
        this.updateDisplay(zone, temperature, planet);
        this.updateBackground(zone.zoneClass);
        this.updateParticles(zone.waterState);
    }

    // 更新显示
    updateDisplay(zone, temperature, planet) {
        // 更新区域信息
        document.getElementById('currentZone').textContent = zone.zone;
        document.getElementById('currentZone').className = `info-value zone-${zone.zoneClass}`;
        
        // 更新温度
        document.getElementById('currentTemp').textContent = `${Math.round(temperature)}°C`;
        
        // 更新距离
        document.getElementById('currentDistance').textContent = `${this.currentDistance.toFixed(2)} AU`;
        
        // 更新水状态
        document.getElementById('waterState').textContent = zone.waterState;
        
        // 更新生命适宜性
        document.getElementById('lifeSuitability').textContent = zone.lifeSuitability;
        document.getElementById('lifeSuitability').className = `info-value zone-${zone.zoneClass}`;
        
        // 更新描述
        document.getElementById('zoneDescription').textContent = zone.description;
        
        // 更新行星信息
        document.getElementById('planetName').textContent = planet.name;
        document.getElementById('planetInfo').textContent = planet.description;
        
        // 更新科学数据
        this.updateScientificData(temperature, planet);
    }

    // 更新科学数据
    updateScientificData(temperature, planet) {
        const solarFlux = this.SOLAR_LUMINOSITY / (4 * Math.PI * Math.pow(this.currentDistance * this.AU * 1000, 2));
        const equilibriumTemp = this.calculateTemperature(this.currentDistance, planet.albedo, 1.0);
        const greenhouseEffect = Math.round((temperature - equilibriumTemp) / equilibriumTemp * 100);
        
        document.getElementById('solarFlux').textContent = `${solarFlux.toFixed(1)} W/m²`;
        document.getElementById('albedo').textContent = planet.albedo.toFixed(3);
        document.getElementById('greenhouseEffect').textContent = `${greenhouseEffect}%`;
        document.getElementById('equilibriumTemp').textContent = `${Math.round(equilibriumTemp)}°C`;
    }

    // 更新背景
    updateBackground(zoneClass) {
        const container = document.getElementById('habitableZone');
        if (!container) return;
        
        // 根据区域改变背景渐变
        const gradients = {
            'too-hot': 'linear-gradient(90deg, #ff4444 0%, #ff6b6b 30%, #ffaa00 60%, #ff4444 100%)',
            'habitable': 'linear-gradient(90deg, #ff6b6b 0%, #4caf50 30%, #2196f3 60%, #4caf50 100%)',
            'cold': 'linear-gradient(90deg, #2196f3 0%, #64b5f6 30%, #1976d2 60%, #2196f3 100%)',
            'extreme-cold': 'linear-gradient(90deg, #1976d2 0%, #0d47a1 30%, #0d47a1 60%, #1976d2 100%)'
        };
        
        container.style.background = gradients[zoneClass] || gradients['habitable'];
    }

    // 创建粒子效果
    createParticles() {
        const container = document.getElementById('particleContainer');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // 更新粒子效果
    updateParticles(waterState) {
        const particleStyles = {
            '水蒸气': {
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))',
                transform: 'scale(1.5)',
                filter: 'blur(1px)'
            },
            '液态水': {
                background: 'radial-gradient(circle, rgba(33, 150, 243, 0.6), rgba(33, 150, 243, 0.2))',
                transform: 'scale(1.2)',
                filter: 'blur(0.5px)'
            },
            '冰': {
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(200, 230, 255, 0.4))',
                transform: 'scale(1.0)',
                filter: 'blur(0.2px)'
            },
            '固态冰': {
                background: 'radial-gradient(circle, rgba(200, 230, 255, 0.7), rgba(150, 200, 255, 0.3))',
                transform: 'scale(0.8)',
                filter: 'blur(0.1px)'
            }
        };
        
        this.particles.forEach(particle => {
            const style = particleStyles[waterState] || particleStyles['液态水'];
            Object.assign(particle.style, style);
        });
    }

    // 设置事件监听器
    setupEventListeners() {
        const earth = document.getElementById('earth');
        const zone = document.getElementById('habitableZone');
        
        if (!earth || !zone) return;

        // 拖拽事件
        if (this.isMobile) {
            earth.addEventListener('touchstart', (e) => this.dragStart(e));
            document.addEventListener('touchmove', (e) => this.drag(e));
            document.addEventListener('touchend', (e) => this.dragEnd(e));
        } else {
            earth.addEventListener('mousedown', (e) => this.dragStart(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', (e) => this.dragEnd(e));
        }

        // 控制按钮
        document.getElementById('resetEarth')?.addEventListener('click', () => this.resetToEarth());
        document.getElementById('showVenus')?.addEventListener('click', () => this.jumpToVenus());
        document.getElementById('showMars')?.addEventListener('click', () => this.jumpToMars());
        document.getElementById('scientificMode')?.addEventListener('click', () => this.toggleScientificMode());

        // 键盘控制
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    // 拖拽开始
    dragStart(e) {
        const earth = document.getElementById('earth');
        if (e.target === earth || e.target.parentElement === earth) {
            this.isDragging = true;
            earth.classList.add('dragging');
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const rect = earth.getBoundingClientRect();
            
            this.dragStartX = clientX - rect.left - rect.width / 2;
            this.dragStartY = clientY - rect.top - rect.height / 2;
        }
    }

    // 拖拽中
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const zone = document.getElementById('habitableZone');
        const rect = zone.getBoundingClientRect();
        
        let newX = clientX - rect.left - this.dragStartX;
        let newY = clientY - rect.top - this.dragStartY;
        
        // 限制在区域内
        newX = Math.max(50, Math.min(rect.width - 50, newX));
        newY = Math.max(50, Math.min(rect.height - 50, newY));
        
        // 计算距离 (0.5 AU 到 2.0 AU)
        const distanceX = (newX / rect.width) * 1.5 + 0.5;
        const distanceY = (newY / rect.height) * 1.5 + 0.5;
        this.currentDistance = Math.max(0.5, Math.min(2.0, Math.sqrt(distanceX * distanceX + distanceY * distanceY)));
        
        // 更新地球位置
        const earth = document.getElementById('earth');
        earth.style.left = newX + 'px';
        earth.style.top = newY + 'px';
        
        // 更新环境
        this.updateEnvironment();
    }

    // 拖拽结束
    dragEnd(e) {
        this.isDragging = false;
        const earth = document.getElementById('earth');
        if (earth) {
            earth.classList.remove('dragging');
        }
    }

    // 重置到地球位置
    resetToEarth() {
        this.currentDistance = 1.0;
        this.currentPlanet = 'earth';
        
        const zone = document.getElementById('habitableZone');
        const earth = document.getElementById('earth');
        
        if (zone && earth) {
            earth.style.left = '50%';
            earth.style.top = '50%';
            earth.style.transform = 'translate(-50%, -50%)';
        }
        
        this.updateEnvironment();
    }

    // 跳转到金星
    jumpToVenus() {
        this.currentDistance = 0.723;
        this.currentPlanet = 'venus';
        this.updateEarthPosition();
        this.updateEnvironment();
    }

    // 跳转到火星
    jumpToMars() {
        this.currentDistance = 1.524;
        this.currentPlanet = 'mars';
        this.updateEarthPosition();
        this.updateEnvironment();
    }

    // 更新地球位置
    updateEarthPosition() {
        const zone = document.getElementById('habitableZone');
        const earth = document.getElementById('earth');
        
        if (!zone || !earth) return;
        
        const rect = zone.getBoundingClientRect();
        const relativeDistance = (this.currentDistance - 0.5) / 1.5;
        const x = relativeDistance * rect.width;
        const y = rect.height / 2;
        
        earth.style.left = x + 'px';
        earth.style.top = y + 'px';
        earth.style.transform = 'translate(-50%, -50%)';
    }

    // 切换科学模式
    toggleScientificMode() {
        const panel = document.getElementById('scientificPanel');
        const button = document.getElementById('scientificMode');
        
        if (panel && button) {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            button.textContent = isVisible ? '显示科学模式' : '隐藏科学模式';
        }
    }

    // 键盘控制
    onKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.currentDistance = Math.max(0.5, this.currentDistance - 0.05);
                this.updateEarthPosition();
                this.updateEnvironment();
                break;
            case 'ArrowRight':
                this.currentDistance = Math.min(2.0, this.currentDistance + 0.05);
                this.updateEarthPosition();
                this.updateEnvironment();
                break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                this.resetToEarth();
                break;
        }
    }

    // 设置响应式处理器
    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.updateEarthPosition();
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.habitableZoneV2 = new HabitableZoneV2();
});
