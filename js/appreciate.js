// 新增JavaScript代码
document.addEventListener('DOMContentLoaded', function() {
    // 动态创建图片容器
    document.querySelectorAll('.gallery-item img[data-images]').forEach(img => {
        const imgSources = img.dataset.images.split(',');
        const container = document.createElement('div');
        container.className = 'image-container';
        
        imgSources.forEach((src, index) => {
            const newImg = document.createElement('img');
            newImg.src = src;
            newImg.alt = img.alt;
            if(index === 0) newImg.classList.add('active');
            container.appendChild(newImg);
        });
        
        img.replaceWith(container);
    });

    // 添加点击事件监听
    document.querySelectorAll('.image-container').forEach(container => {
        let currentIndex = 0;
        const images = container.querySelectorAll('img');
        
        container.addEventListener('click', () => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        });
    });
});	
