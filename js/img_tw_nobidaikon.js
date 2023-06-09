let imageCurrentNum = 1;
const imagesPerNum = 50;
const imagesPageNum = 10;
const imageMaxCount = 166;
const imageDir = "img/tw/nobidaikon/"
const imageWidth = 200;

const container = document.getElementById('container');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementsByClassName('close')[0];
const modalLeft = document.getElementsByClassName('left')[0];
const modalRight = document.getElementsByClassName('right')[0];
const loadingAnimation = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');

let fallNum;
let fallHeightArr;
let loadImageNum_i = 1;
let isOnloadPic = false;

function init() {
    fallNum = getScreenFallNum();
    stepContainerCenter(fallNum);
    fallHeightArr = getFallHeightArray(fallNum);
    console.log("init onloadPic...");
    onloadPic(fallHeightArr, imagesPerNum);
}

/**
 * 加载一张图片,完成后触发加载下一张图片
 * @param fallHeightArr
 * @param loadImageNum 加载图片数量
 */
function onloadPic(fallHeightArr, loadImageNum) {
    loadingText.textContent = 'loading... (' + loadImageNum_i + '/' + loadImageNum + ', total: ' + imageCurrentNum + '/' + imageMaxCount + ')';
    loadingAnimation.style.display = 'block';
    // 已加载所有图片
    if (imageCurrentNum > imageMaxCount) {
        loadingAnimation.style.display = 'none';
        isOnloadPic = false;
        return;
    }
    if (loadImageNum_i > loadImageNum) {
        loadImageNum_i = 1;
        loadingAnimation.style.display = 'none';
        isOnloadPic = false;
        return;
    }
    isOnloadPic = true;
    const minHeight = Math.min.apply(null, fallHeightArr);
    const index = fallHeightArr.indexOf(minHeight);
    const picFall = document.getElementsByClassName('pic-fall')[index];
    const img = document.createElement('img');
    img.src = imageDir + imageCurrentNum + ".jpg";
    imageCurrentNum++;
    loadImageNum_i++;
    addImageListener(img);
    img.onerror = function () {
        console.log("img load error:", img.src, "index:", index);
        picFall.appendChild(img);
        // height = imageWidth
        fallHeightArr[index] += imageWidth;
        if (loadImageNum_i < loadImageNum && imageCurrentNum <= imageMaxCount) {
            onloadPic(fallHeightArr, imagesPerNum);
        } else {
            loadImageNum_i = 1;
            loadingAnimation.style.display = 'none';
            isOnloadPic = false;
        }
    }
    img.onload = function () {
        picFall.appendChild(img);
        const height = img.height / (img.width / (imageWidth));
        fallHeightArr[index] += height;
        if (loadImageNum_i < loadImageNum && imageCurrentNum <= imageMaxCount) {
            onloadPic(fallHeightArr, imagesPerNum);
        } else {
            loadImageNum_i = 1;
            loadingAnimation.style.display = 'none';
            isOnloadPic = false;
        }
    }
}

/**
 * 创建屏幕所能承载的fall条数
 * @returns {number} 图片流条数
 */
function getScreenFallNum() {
    const width = document.body.clientWidth;
    const num = Math.floor(width / (imageWidth + 20));

    for (let i = 0; i < num; i++) {
        const picFall = document.createElement('div');
        picFall.className = "pic-fall";
        picFall.style.width = imageWidth + "px";
        container.appendChild(picFall);
    }
    console.log("screen fall num: ", num)
    return num;
}

/**
 * 获取屏幕中图片流的高度
 * @param num 图片流的条数
 * @returns {Array} 高度数组
 */
function getFallHeightArray(num) {
    let fallHeightArr = [];
    for (let i = 0; i < num; i++) {
        fallHeightArr[i] = 0;
    }
    return fallHeightArr;
}

/**
 * 让元素列表居中，获取该距左多少px
 * @param num 图片流条数
 */
function stepContainerCenter(num) {
    const width = document.body.clientWidth;
    const left = Math.floor((width - num * (imageWidth + 20)) / 2);
    if (left > 0) {
        container.style.marginLeft = left + 'px';
    }
}

// 添加图片事件
function addImageListener(image) {
    // 监听鼠标点击事件
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = image.src;
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

// 滚动到页面底部时加载更多图片
function checkScroll() {
    const containerHeight = Math.min.apply(null, fallHeightArr);
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight >= containerHeight && !isOnloadPic) {
        console.log("scroll onloadPic...");
        onloadPic(fallHeightArr, imagesPerNum);
    }
}

// 关闭大图预览窗口
function closeModal() {
    modal.style.display = 'none';
    modalImage.src = '';
}

function getSrcNum(srcUrl) {
    let currentSrcList = srcUrl.split('/')
    return parseInt(currentSrcList[currentSrcList.length - 1].split('.')[0])
}

// 上一张
function modalLeftF() {
    let currentSrc = modalImage.src;
    let currentSrcNum = getSrcNum(currentSrc);
    if (currentSrcNum < 2) {
        console.log("it is the first img. currentSrcNum:", currentSrcNum)
        return;
    }
    let lastSrcNum = currentSrcNum - 1;
    currentSrc = currentSrc.replace(currentSrcNum + '.jpg', lastSrcNum + '.jpg')
    modalImage.src = currentSrc;
}

// 下一张
function modalRightF() {
    let currentSrc = modalImage.src;
    let currentSrcNum = getSrcNum(currentSrc);
    if (currentSrcNum >= imageMaxCount) {
        console.log("no more img. currentSrcNum:", currentSrcNum)
        return;
    }
    let nextSrcNum = currentSrcNum + 1;
    currentSrc = currentSrc.replace(currentSrcNum + '.jpg', nextSrcNum + '.jpg')
    modalImage.src = currentSrc;
}

// 暂停
async function pause(seconds) {
    console.log('await ', seconds, ' s...');
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function firstInit() {
    init();
}

modalClose.addEventListener('click', closeModal);
modalLeft.addEventListener('click', modalLeftF);
modalRight.addEventListener('click', modalRightF);

firstInit().then(() => {
    window.addEventListener('scroll', checkScroll);
});
