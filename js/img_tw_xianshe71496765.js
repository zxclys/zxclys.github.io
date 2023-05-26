let imageCurrentNum = 1;
const imagesPerNum = 20;
const imagesPageNum = 10;
const imageMaxCount = 96;
const imageDir = "img/tw/xianshe71496765/"
const imageWidth = 200;

const container = document.getElementById('container');
const loadMoreButton = document.getElementById('load-more');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementsByClassName('close')[0];

// 根据页面大小计算每列能容纳的图片数量
function calculateColumns() {
    const containerWidth = container.offsetWidth;
    const columns = Math.floor(containerWidth / imageWidth);
    return columns > 0 ? columns : 1;
}

// 添加一张图片到页面
function addImage(url) {
    const image = document.createElement('div');
    image.classList.add('image');
    image.innerHTML = `<img src="${url}" alt="image">`;
    container.appendChild(image);
    // 监听鼠标点击事件
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = url;
    });
    // 监听鼠标悬浮事件
    image.addEventListener('mouseenter', event => {
        // 添加放大效果的 CSS 类
        image.classList.add('zoomable-image');
    });
    // 监听鼠标离开事件
    image.addEventListener('mouseleave', event => {
        // 移除放大效果的 CSS 类
        image.classList.remove('zoomable-image');
    });
}

// 加载当前页的图片
function loadImages(loadImageNum) {
    for (let i = 0; i < loadImageNum && imageCurrentNum <= imageMaxCount; i++) {
        addImage(imageDir + imageCurrentNum + ".jpg");
        imageCurrentNum++;
    }
    // 已加载所有图片，隐藏加载更多按钮
    if (imageCurrentNum > imageMaxCount) {
        document.getElementById('load-more').style.display = 'none';
    }
}

// 滚动到页面底部时加载更多图片
function checkScroll() {
    const containerHeight = container.offsetHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight >= containerHeight) {
        loadImages(imagesPageNum);
    }
}

// 关闭大图预览窗口
function closeModal() {
    modal.style.display = 'none';
    modalImage.src = '';
}

// 初始化页面
function init() {
    container.style.columnCount = calculateColumns();
    loadImages(imagesPerNum);
}

// 加载更多点击事件
loadMoreButton.addEventListener('click', () => {
    loadImages(imagesPageNum);
});

window.addEventListener('scroll', checkScroll);

modalClose.addEventListener('click', closeModal);

init();

