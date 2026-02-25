// 太阳系模型 JavaScript
class SolarSystem {
    constructor() {
        // 行星数据 - 增大尺寸和亮度
        this.planetsData = {
            mercury: {
                name: '水星',
                radius: 0.6, // 增大
                distance: 12,
                speed: 4.15,
                color: 0xb0b0b0, // 更亮
                diameter: '4,879 km',
                realDistance: '57.9 百万km',
                temp: '-173~427℃',
                description: '水星是太阳系中最小的行星，也是离太阳最近的行星。',
                fact: '水星的一天（自转周期）相当于地球的59天。'
            },
            venus: {
                name: '金星',
                radius: 1.3, // 增大
                distance: 18,
                speed: 1.62,
                color: 0xffeb3b, // 更亮
                diameter: '12,104 km',
                realDistance: '108.2 百万km',
                temp: '465℃',
                description: '金星是太阳系中最热的行星，被称为地球的"姊妹星"。',
                fact: '金星的自转方向与其他行星相反，太阳从西边升起。'
            },
            earth: {
                name: '地球',
                radius: 1.4, // 增大
                distance: 25,
                speed: 1,
                color: 0x42a5f5, // 更亮
                diameter: '12,742 km',
                realDistance: '149.6 百万km',
                temp: '-88~58℃',
                description: '地球是目前已知唯一存在生命的行星。',
                fact: '地球表面71%被水覆盖，是太阳系中唯一拥有液态水的行星。'
            },
            mars: {
                name: '火星',
                radius: 0.8, // 增大
                distance: 32,
                speed: 0.53,
                color: 0xff6b35, // 更亮
                diameter: '6,779 km',
                realDistance: '227.9 百万km',
                temp: '-87~-5℃',
                description: '火星被称为"红色星球"，因表面富含氧化铁而呈现红色。',
                fact: '火星拥有太阳系中最高的山峰——奥林帕斯山，高度约21公里。'
            },
            jupiter: {
                name: '木星',
                radius: 3.5, // 增大
                distance: 50,
                speed: 0.084,
                color: 0xffb74d, // 更亮
                diameter: '139,820 km',
                realDistance: '778.6 百万km',
                temp: '-110℃',
                description: '木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。',
                fact: '木星的大红斑是一个已持续数百年的巨大风暴。'
            },
            saturn: {
                name: '土星',
                radius: 2.8, // 增大
                distance: 65,
                speed: 0.034,
                color: 0xffee58, // 更亮
                diameter: '116,460 km',
                realDistance: '1,433.5 百万km',
                temp: '-140℃',
                description: '土星以其壮观的环系统而闻名，环主要由冰块和岩石组成。',
                fact: '土星的密度比水还小，如果有足够大的海洋，土星会浮在水面上。'
            },
            uranus: {
                name: '天王星',
                radius: 2.0, // 增大
                distance: 80,
                speed: 0.012,
                color: 0x81d4fa, // 更亮
                diameter: '50,724 km',
                realDistance: '2,872.5 百万km',
                temp: '-195℃',
                description: '天王星是唯一一个几乎横躺着围绕太阳运转的行星。',
                fact: '天王星拥有淡淡的环系统，而且有27颗已知的卫星。'
            },
            neptune: {
                name: '海王星',
                radius: 1.9, // 增大
                distance: 95,
                speed: 0.006,
                color: 0x5c6bc0, // 更亮
                diameter: '49,244 km',
                realDistance: '4,495.1 百万km',
                temp: '-200℃',
                description: '海王星是太阳系中风速最快的行星，风速可达2100公里/小时。',
                fact: '海王星的深蓝色来自大气中的甲烷，它吸收红光并反射蓝光。'
            }
        };

        // 全局变量
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = null;
        this.mouse = null;
        this.planets = [];
        this.sun = null;
        this.orbits = [];
        this.isPaused = false;
        this.speedMultiplier = 1;
        this.showOrbits = true;
        this.cameraDistance = 80;
        this.cameraAngle = 0;

        // 响应式变量
        this.isMobile = this.detectMobile();
        this.devicePixelRatio = window.devicePixelRatio || 1;

        this.init();
    }

    // 检测移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }

    // 初始化Three.js场景
    init() {
        this.createScene();
        this.createLights();
        this.createSun();
        this.createPlanets();
        this.createStarfield();
        this.setupEventListeners();
        this.setupControls();
        this.hideLoading();
        this.animate();
    }

    // 创建场景
    createScene() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000814);

        // 创建相机 - 根据设备调整
        const aspect = window.innerWidth / window.innerHeight;
        const fov = this.isMobile ? 60 : 75;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
        
        // 根据屏幕大小调整相机距离 - 缩短距离让行星更大
        this.cameraDistance = this.isMobile ? 100 : 60; // 缩短距离
        this.camera.position.set(0, 25, this.cameraDistance); // 调整高度
        this.camera.lookAt(0, 0, 0);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !this.isMobile,
            powerPreference: 'high-performance'
        });
        
        // 设置渲染器大小和像素比
        this.updateRendererSize();
        this.renderer.shadowMap.enabled = !this.isMobile;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // 设置像素比
        this.renderer.setPixelRatio(Math.min(this.devicePixelRatio, 2));
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // 鼠标交互
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // 更新渲染器大小
    updateRendererSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    // 创建光源 - 增强亮度
    createLights() {
        // 环境光 - 增强亮度
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // 增强环境光
        this.scene.add(ambientLight);

        // 太阳点光源 - 增强强度
        const pointLight = new THREE.PointLight(0xffffff, 3, 300); // 增强光源强度和范围
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = !this.isMobile;
        this.scene.add(pointLight);

        // 添加额外的方向光增强行星表面
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }

    // 创建太阳 - 增大尺寸和亮度
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(4, 32, 32); // 增大太阳
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, // 更亮的白色
            emissive: 0xffeb3b,
            emissiveIntensity: 1.2 // 增强发光
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        // 太阳光晕 - 增强效果
        const glowGeometry = new THREE.SphereGeometry(5, 32, 32); // 增大光晕
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff9800,
            transparent: true,
            opacity: 0.5 // 增强光晕透明度
        });
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(sunGlow);

        // 添加第二层光晕
        const outerGlowGeometry = new THREE.SphereGeometry(6, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.2
        });
        const outerSunGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        this.sun.add(outerSunGlow);
    }

    // 创建行星
    createPlanets() {
        Object.keys(this.planetsData).forEach(key => {
            const data = this.planetsData[key];
            
            // 创建行星网格 - 增大尺寸和亮度
            const segments = this.isMobile ? 16 : 32;
            const planetRadius = data.radius * 1.5; // 增大1.5倍
            const planetGeometry = new THREE.SphereGeometry(planetRadius, segments, segments);
            const planetMaterial = new THREE.MeshPhongMaterial({ 
                color: data.color,
                shininess: 30,
                specular: 0x444444, // 增加反光
                emissive: data.color, // 增加自发光
                emissiveIntensity: 0.1 // 微弱自发光
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.x = data.distance;
            planet.castShadow = !this.isMobile;
            planet.receiveShadow = !this.isMobile;
            planet.userData = { key: key, data: data };

            // 创建轨道组
            const orbitGroup = new THREE.Group();
            orbitGroup.add(planet);
            this.scene.add(orbitGroup);

            // 创建轨道线
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x404040,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = -Math.PI / 2;
            this.scene.add(orbit);
            this.orbits.push(orbit);

            // 土星环
            if (key === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xfdd835,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = -Math.PI / 2.5;
                planet.add(ring);
            }

            this.planets.push({
                mesh: planet,
                orbitGroup: orbitGroup,
                data: data,
                angle: Math.random() * Math.PI * 2
            });
        });
    }

    // 创建星空背景
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: this.isMobile ? 0.05 : 0.1,
            transparent: true,
            opacity: 0.8
        });

        const starVertices = [];
        const starCount = this.isMobile ? 5000 : 10000;
        
        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 窗口大小调整
        window.addEventListener('resize', () => this.onWindowResize());

        // 鼠标/触摸事件
        const canvas = this.renderer.domElement;
        
        if (this.isMobile) {
            canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
            canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
            canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        } else {
            canvas.addEventListener('click', (e) => this.onMouseClick(e));
            canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        // 点击空白处关闭信息卡片
        document.addEventListener('click', (e) => this.onDocumentClick(e));
    }

    // 设置控制器
    setupControls() {
        // 轨道显示切换
        const orbitToggle = document.getElementById('orbitToggle');
        if (orbitToggle) {
            orbitToggle.addEventListener('click', () => this.toggleOrbits());
        }

        // 速度控制
        const speedControl = document.getElementById('speedControl');
        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.speedMultiplier = parseFloat(e.target.value);
            });
        }

        // 缩放控制 - 调整范围让用户可以更近距离观察
        const zoomControl = document.getElementById('zoomControl');
        if (zoomControl) {
            zoomControl.addEventListener('input', (e) => {
                const zoom = parseFloat(e.target.value);
                this.cameraDistance = zoom * 0.6; // 缩放系数，让最小距离更近
                this.updateCameraPosition();
            });
        }

        // 暂停按钮
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }
    }

    // 窗口大小调整
    onWindowResize() {
        this.updateRendererSize();
        
        // 重新检测设备类型
        this.isMobile = window.innerWidth <= 768;
        
        // 调整相机距离
        this.cameraDistance = this.isMobile ? 120 : 80;
        this.updateCameraPosition();
    }

    // 更新相机位置
    updateCameraPosition() {
        this.camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance;
        this.camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance;
        this.camera.lookAt(0, 0, 0);
    }

    // 鼠标点击事件
    onMouseClick(event) {
        this.updateMousePosition(event);
        this.checkPlanetClick();
    }

    // 鼠标移动事件
    onMouseMove(event) {
        this.updateMousePosition(event);
        this.checkHover();
    }

    // 触摸开始事件
    onTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.updateMousePosition(touch);
    }

    // 触摸移动事件
    onTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.updateMousePosition(touch);
        this.checkHover();
    }

    // 触摸结束事件
    onTouchEnd(event) {
        event.preventDefault();
        this.checkPlanetClick();
    }

    // 更新鼠标位置
    updateMousePosition(event) {
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    }

    // 检查行星点击
    checkPlanetClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        if (intersects.length > 0) {
            const planet = intersects[0].object;
            this.showPlanetInfo(planet.userData.key);
        }
    }

    // 检查悬停
    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        // 更改鼠标样式
        this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }

    // 键盘事件
    onKeyDown(event) {
        switch(event.key) {
            case 'Escape':
                this.closePlanetInfo();
                break;
            case ' ':
            case 'Spacebar':
                event.preventDefault();
                this.togglePause();
                break;
            case 'ArrowLeft':
                this.cameraAngle -= 0.1;
                this.updateCameraPosition();
                break;
            case 'ArrowRight':
                this.cameraAngle += 0.1;
                this.updateCameraPosition();
                break;
        }
    }

    // 文档点击事件
    onDocumentClick(event) {
        const infoCard = document.getElementById('planetInfo');
        if (infoCard && !infoCard.contains(event.target) && event.target !== this.renderer.domElement) {
            this.closePlanetInfo();
        }
    }

    // 显示行星信息
    showPlanetInfo(planetKey) {
        const info = this.planetsData[planetKey];
        const infoCard = document.getElementById('planetInfo');
        const planetName = document.getElementById('planetName');
        const planetDetails = document.getElementById('planetDetails');
        
        if (!infoCard || !planetName || !planetDetails) return;
        
        planetName.textContent = info.name;
        planetDetails.innerHTML = `
            <p><strong>直径:</strong> ${info.diameter}</p>
            <p><strong>与太阳距离:</strong> ${info.realDistance}</p>
            <p><strong>表面温度:</strong> ${info.temp}</p>
            <p><strong>描述:</strong> ${info.description}</p>
            <p style="margin-top: 15px; padding: 10px; background: rgba(230, 184, 0, 0.1); border-radius: 5px;">
                <strong>你知道吗？</strong><br>${info.fact}
            </p>
        `;
        
        // 居中显示
        infoCard.style.left = '50%';
        infoCard.style.top = '50%';
        infoCard.style.transform = 'translate(-50%, -50%)';
        infoCard.classList.add('active');
    }

    // 关闭行星信息
    closePlanetInfo() {
        const infoCard = document.getElementById('planetInfo');
        if (infoCard) {
            infoCard.classList.remove('active');
        }
    }

    // 暂停/继续功能
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (pauseBtn) {
            if (this.isPaused) {
                pauseBtn.classList.add('paused');
                pauseBtn.innerHTML = '▶️ 继续运行';
            } else {
                pauseBtn.classList.remove('paused');
                pauseBtn.innerHTML = '⏸️ 暂停运行';
            }
        }
    }

    // 轨道显示切换
    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        const orbitToggle = document.getElementById('orbitToggle');
        
        if (orbitToggle) {
            orbitToggle.classList.toggle('active');
        }
        
        this.orbits.forEach(orbit => {
            orbit.visible = this.showOrbits;
        });
    }

    // 隐藏加载提示
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // 动画循环
    animate() {
        requestAnimationFrame(() => this.animate());

        // 旋转太阳
        if (this.sun) {
            this.sun.rotation.y += 0.005;
        }

        // 行星运动
        if (!this.isPaused) {
            this.planets.forEach(planet => {
                planet.angle += (planet.data.speed * this.speedMultiplier * 0.01);
                planet.mesh.position.x = Math.cos(planet.angle) * planet.data.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.data.distance;
                planet.mesh.rotation.y += 0.01;
            });
        }

        // 相机围绕太阳旋转（仅在非移动设备上）
        if (!this.isMobile) {
            this.cameraAngle += 0.001;
            this.updateCameraPosition();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查Three.js是否加载
    if (typeof THREE === 'undefined') {
        console.error('Three.js未加载，请检查CDN链接');
        return;
    }
    
    // 创建太阳系实例
    window.solarSystem = new SolarSystem();
});

// 全局函数（供HTML调用）
window.togglePause = function() {
    if (window.solarSystem) {
        window.solarSystem.togglePause();
    }
};

window.closePlanetInfo = function() {
    if (window.solarSystem) {
        window.solarSystem.closePlanetInfo();
    }
};
