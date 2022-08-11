window.onload = ()=>{
    input = document.getElementById('fileInput')
    img = document.getElementById('imgSrc')
    smoothing = document.getElementById('smoothing')
    shrinking = document.getElementById('shrinking')
    depth = document.getElementById('depth')
    input.addEventListener("change",(e)=>{
        img.src = URL.createObjectURL(e.target.files[0]);
        
    },false)
    function process() {
        let shrinkingValue = parseInt(shrinking.value)
        let mat = cv.imread(img)
        cv.resize(mat,mat,new cv.Size(mat.cols/shrinkingValue,mat.rows/shrinkingValue),interpolation=cv.INTER_AREA)
        let claheMat = new cv.Mat()
        let claheBilat = new cv.Mat()
        let tones = []
        cv.cvtColor(mat, mat, cv.COLOR_RGBA2RGB, 0);
        cv.cvtColor(mat,mat,cv.COLOR_RGBA2GRAY)
        let out = new cv.Mat.zeros(mat.rows, mat.cols, mat.type())
        let tileGridSize = new cv.Size(8, 8);
        let clahe = new cv.CLAHE(40, tileGridSize);
        clahe.apply(mat, claheMat);
        let smoothValue = parseInt(smoothing.value)
        let depthValue = parseInt(depth.value)
        cv.bilateralFilter(claheMat,claheBilat,10,smoothValue,300, cv.BORDER_DEFAULT)
        let graystep = Math.floor(255/depthValue)
        for(let i=0;i<depthValue;i+=1) {
            shade = new cv.Mat()
            cv.threshold(claheBilat,shade, i*graystep, graystep, cv.THRESH_BINARY)
            cv.add(shade,out,out)
            shade.delete()
        }
        cv.imshow('outputCanvas',out)
        mat.delete();
        out.delete()
        clahe.delete()
        claheMat.delete()
        claheBilat.delete()
    }
    smoothing.addEventListener("input",()=>{
        process()
    })
    depth.addEventListener("input",()=>{
        process()
    })
    shrinking.addEventListener("input",()=>{
        process()
    })
    document.getElementById('save').addEventListener("click",()=>{
        canvas = document.getElementById('outputCanvas')
        document.getElementById('downloadable').src=canvas.toDataURL('img/png')
    })
}