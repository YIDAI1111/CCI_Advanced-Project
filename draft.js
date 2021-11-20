
let nets = {};
let modelNames = ['la_muse', 'rain_princess', 'udnie', 'wreck', 'scream', 'wave', 'mathura', 'fuchun', 'zhangdaqian'];
let inputImg, styleImg;
let outputImgData;
let modelNum = 0;
let currentModel = 'wave';
let uploader;
let webcam = false;
let modelReady = false;
let video;
let start = false;
let isLoading = true;
let isSafa = false;
let imgFilter = 0;

function setup() {
    isSafa = isSafari();
    if (isSafa) {
        alert('Plz choose Chrome!');
        return;
    }

    noCanvas();
    inputImg = select('#input-img').elt;
    styleImg = select('#style-img').elt;

    // 载入模型
    modelNames.forEach(n => {
        nets[n] = new ml5.TransformNet('models/' + n + '/', modelLoaded);
    });


    // 图片上传
    uploader = select('#uploader').elt;
    uploader.addEventListener('change', gotNewInputImg);

    // 输出图片容器
    outputImgContainer = createImg('images/loading.gif', 'image');
    outputImgContainer.parent('output-img-container');
    // valueSlider = createSlider(0, 100, 1);

    // valueSlider.parent('output-img-container');
    // valueSlider.input(changeValue);

    allowFirefoxGetCamera();
    
}


// 在模型已经载入后调用的函数
function modelLoaded() {
    modelNum++;
    if (modelNum >= modelNames.length) {
        modelReady = true;
        predictImg(currentModel);
    }
}

function predictImg(modelName) {
    isLoading = true;
    if (!modelReady) return;
    if (webcam && video) {
        outputImgData = nets[modelName].predict(video.elt);
    } else if (inputImg) {
        outputImgData = nets[modelName].predict(inputImg);
    }
    outputImg = ml5.array3DToImage(outputImgData);
    outputImgContainer.elt.src = outputImg.src;
    outputImgContainer.addClass('reverse-img');


    isLoading = false;
}

function draw() {
    if (modelReady && webcam && video && video.elt && start) {
        // predictImg(currentModel);
    }

}

function updateStyleImg(ele) {
    if (ele.src) {
        styleImg.src = ele.src;
        currentModel = ele.id;
    }
    if (currentModel) {
        predictImg(currentModel);
    }
}

    function uploadImg() {
        uploader.click();
        deactiveWebcam();
    }

    function gotNewInputImg() {
        if (uploader.files && uploader.files[0]) {
            let newImgUrl = window.URL.createObjectURL(uploader.files[0]);
            inputImg.src = newImgUrl;
            inputImg.style.width = '250px';
            inputImg.style.height = '250px';
        }
    }

    function useWebcam() {
        if (!video) {
            // 使用webcam
            video = createCapture(VIDEO);
            video.size(250, 250);
            video.parent('input-source');
        }
        webcam = true;
        select('#input-img').hide();
        outputImgContainer.addClass('reverse-img');
    }


    function deactiveWebcam() {
        start = false;
        select('#input-img').show();
        outputImgContainer.removeClass('reverse-img');
        webcam = false;
        if (video) {
            video.hide();
            video = '';
        }
    }

    function onPredictClick() {
        if (webcam) start = true;
        predictImg(currentModel);
    }

    function allowFirefoxGetCamera() {
        navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            if (ua.indexOf('chrome') > -1) {
                return false;
            } else {
                return true;
            }
        }
    }

    function changeValue() {
        imgFilter = valueSlider.value();
        }



    // const brightnessSlider = document.getElementById('brightness');
    // brightnessSlider.addEventListener("change", briChange);
    // function briChange() {
    //     Caman('#input-img', function () {
    //     this.brightness(parseInt(document.getElementById("brightness").value));
    //     this.contrast(30);
    //     this.sepia(60);
    //     this.saturation(-30);
    //     this.render();
    //     });
    //     console.log(document.getElementById("brightness").value);
    //     onPredictClick();
    // }


    // function briChange() {
    //     Caman('#input-img', function () {
    //     this.reloadCanvasData();
    //     this.brightness(100);
    //     this.contrast(100);
    //     this.sepia(100);
    //     this.saturation(-100);
    //     this.render();
    //     console.log("Done caman");
    //   });
      
    //   }