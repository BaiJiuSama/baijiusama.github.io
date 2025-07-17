window.onload = function() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const maxParticles = 160; // 最大粒子数量
    const mouse = { x: null, y: null }; // 鼠标位置

    // 调整画布大小以适应窗口
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // 粒子构造函数
    function Particle(x, y, isMouse = false) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * height;
        this.vx = isMouse ? 0 : (Math.random() - 0.5) * 2;
        this.vy = isMouse ? 0 : (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
        this.isMouse = isMouse;
    }

    // 绘制粒子
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; // 粒子颜色
        ctx.fill();
    };

    // 更新粒子位置
    Particle.prototype.update = function() {
        if (!this.isMouse) { // 鼠标位置不更新
            this.x += this.vx;
            this.y += this.vy;

            // 边界反弹
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    };

    // 创建粒子
    function createParticles() {
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    // 绘制所有粒子和连线
    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        // 绘制粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();

            // 粒子之间的连线
            for (let j = i + 1; j < particles.length; j++) {
                let dist = Math.sqrt((particles[i].x - particles[j].x) ** 2 + (particles[i].y - particles[j].y) ** 2);
                if (dist < 150) { // 只有粒子距离足够近时才连线
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = "rgba(255, 255, 255," + (1 - dist / 120) + ")"; // 根据距离渐变透明度
                    ctx.stroke();
                }
            }
        }

        // 鼠标与粒子的连线
        if (mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                let dist = Math.sqrt((mouse.x - particles[i].x) ** 2 + (mouse.y - particles[i].y) ** 2);
                if (dist < 150) { // 鼠标与粒子之间的连线距离可以更长
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.strokeStyle = "rgba(255, 255, 255," + (1 - dist / 150) + ")"; // 根据距离渐变透明度
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环
    function animate() {
        drawParticles();
        requestAnimationFrame(animate);
    }

    // 监听鼠标移动事件
    canvas.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // 当鼠标离开窗口时重置鼠标位置
    canvas.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // 初始化画布
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
};