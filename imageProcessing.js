
//imageMapXY(image: Image, f: (image: Image, x: number, y: number) => Pixel): Image
function imageMapXY(image, f){
  let newImage = image.copy();
  for(let i = 0; i<image.width; ++i){
    for(let j=0; j<image.height; ++j){
      let ans = f(image, i, j);
      newImage.setPixel(i, j, [ans[0], ans[1], ans[2]]);
    }
  }
  return newImage;
}

//imageMask(image: Image, f: (image: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(image, f, maskValue){
  return imageMapXY(image, function(image, x, y){
    let conditional = f(image, x, y);
    const c = image.getPixel(x,y);
    if(conditional === true){
      return maskValue;
  }
    else{
      return c;
  }
})
}


//blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(image, x, y){
  if(x-1 > 0 && x+1 < image.width && y-1 > 0 && y+1 < image.height){
       let a = image.getPixel(x-1, y-1);
       let b = image.getPixel(x-1, y);
       let c = image.getPixel(x-1, y+1);
       let d = image.getPixel(x, y-1);
       let e = image.getPixel(x, y);
       let f = image.getPixel(x, y+1);
       let g = image.getPixel(x+1, y-1);
       let h = image.getPixel(x+1, y);
       let k = image.getPixel(x+1, y+1);
       let redAverage = ((a[0]+b[0]+c[0]+d[0]+e[0]+f[0]+g[0]+h[0]+k[0])/9);
       let blueAverage = ((a[1]+b[1]+c[1]+d[1]+e[1]+f[1]+g[1]+h[1]+k[1])/9);
       let greenAverage = ((a[2]+b[2]+c[2]+d[2]+e[2]+f[2]+g[2]+h[2]+k[2])/9);
       return [redAverage,blueAverage, greenAverage];
  }
  return image.getPixel(x,y);
}

//blurImage(image: Image): Image
function blurImage(image){
  let newImage = image.copy();
  return imageMapXY(newImage, blurPixel);
}

//blurHalfImage(image: Image, right: boolean): Image
function blurHalfImage(image, right){
  return imageMapXY(image, function(image, x, y){
    if(right === true && x >= (image.width)/2){
      return blurPixel(image, x, y);
    }
    if(right === false && x <= (image.width)/2){
      return blurPixel(image, x, y);
    }
    return image.getPixel(x,y);
  })
  }

//isGrayish(pixel: Pixel): boolean
function isGrayish(pixel){
  if((pixel[0] >= 0.3 && pixel[0] <= 0.7) && (pixel[1] >= 0.3 && pixel[1] <= 0.7) && (pixel[2] >= 0.3 && pixel[2] <= 0.7)){
    return true;
  }
  return false;
}

//toGrayscale(image: Image): Image
function toGrayscale(image){
  return imageMapXY(image, function(image, x, y){
    if(isGrayish(image.getPixel(x, y))){
      let temp = image.getPixel(x,y);
      let newTemp = ((temp[0] + temp[1] + temp[2])/3); 
      return [newTemp, newTemp, newTemp];
    } 
    return image.getPixel(x, y);
  })
  }

//grayHalfImage(image: Image): Image
function grayHalfImage(image){
  return imageMapXY(image, function(image, x, y){
    if(x >= (image.width)/2){
      let temp = image.getPixel(x,y);
      let newTemp = ((temp[0] + temp[1] + temp[2])/3); 
      return [newTemp, newTemp, newTemp];
    }
    return image.getPixel(x, y);
  })
  }
  
//saturateHigh(image: Image): Image
function saturateHigh(image){
  return imageMapXY(image, function(image, x, y){
    let pixelChan = image.getPixel(x, y);
    if(pixelChan[0] > 0.7){
      pixelChan[0] = 1.0;
    }
    if(pixelChan[1] > 0.7){
      pixelChan[1] = 1.0;
    }
    if(pixelChan[2] > 0.7){
      pixelChan[2] = 1.0;
    }
    return pixelChan;
  })
  }

//blackenLow(image: Image): Image
function blackenLow(image){
  return imageMapXY(image, function(image, x, y){
    let pixelChan = image.getPixel(x, y);
    if(pixelChan[0] < 0.3){
      pixelChan[0] = 0.0;
    }
    if(pixelChan[1] < 0.3){
      pixelChan[1] = 0.0;
    }
    if(pixelChan[2] < 0.3){
      pixelChan[2] = 0.0;
    }
    return pixelChan;
  })
  }

//reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((pixel: Pixel) => Pixel)
function reduceFunctions(fa){
  function reducer(prevF, f){
    return f(prevF);
  }
  function compose(pixel){
    return fa.reduce(reducer, pixel);
  }
  return compose;
}

//colorize(image: Image): Image
function colorize(image){
  function imageMap(image, f){
  let newImage = image.copy();
  for(let i = 0; i<image.width; ++i){
    for(let j=0; j<image.height; ++j){
      let ans = f(image.getPixel(i,j));
      newImage.setPixel(i, j, [ans[0], ans[1], ans[2]]);
    }
  }
  return newImage;
}
  function toGrayscalePixel(pixel){
    if(isGrayish(pixel)){
      let temp = pixel;
      let newTemp = ((temp[0] + temp[1] + temp[2])/3); 
      return [newTemp, newTemp, newTemp];
    } 
    return pixel;
  }
  function blackenLowPixel(pixel){
    let pixelChan = pixel;
    if(pixelChan[0] < 0.3){
      pixelChan[0] = 0.0;
    }
    if(pixelChan[1] < 0.3){
      pixelChan[1] = 0.0;
    }
    if(pixelChan[2] < 0.3){
      pixelChan[2] = 0.0;
    }
    return pixelChan;
  }
  function saturateHighPixel(pixel){
    let pixelChan = pixel;
    if(pixelChan[0] > 0.7){
      pixelChan[0] = 1.0;
    }
    if(pixelChan[1] > 0.7){
      pixelChan[1] = 1.0;
    }
    if(pixelChan[2] > 0.7){
      pixelChan[2] = 1.0;
    }
    return pixelChan;
  }
  return imageMap(image, reduceFunctions([toGrayscalePixel, blackenLowPixel, saturateHighPixel]));
}

//colorize(robot).show();

test('imageMapXY function definition is correct', function() {
 let identityFunction = function(image, x, y) {
 return image.getPixel(x, y);
 };
 let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
 let outputImage = imageMapXY(inputImage, identityFunction);
 // Output should be an image, so getPixel must work without errors.
 let p = outputImage.getPixel(0, 0);
 assert(p[0] === 0);
 assert(p[1] === 0);
 assert(p[2] === 0);
 assert(inputImage !== outputImage);
});

function pixelEq (p1, p2) {
 const epsilon = 0.002;
 for (let i = 0; i < 3; ++i) {
 if (Math.abs(p1[i] - p2[i]) > epsilon) {
 return false;
 }
 }
 return true;
};
test('identity function with imageMapXY', function() {
 let identityFunction = function(image, x, y ) {
 return image.getPixel(x, y);
 };
 let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
 inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
 inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
 inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
 let outputImage = imageMapXY(inputImage, identityFunction);
 assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
 assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
 assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
 assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test('blurHalfImage', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }

    let outImage = blurHalfImage(inputImage,false);

    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);
});

test ('isGrayish' , function(){
  assert(isGrayish([0.3,0.3,0.3]));
  assert(!isGrayish([0.2,0.5,0.5]));
});


test('toGrayscale', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }

    let outImage = toGrayscale(inputImage);

    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);

});

test('grayHalfImage', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }

    let outImage = grayHalfImage(inputImage);

    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);

});


test('saturateHigh', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }
    
    let outImage = saturateHigh(inputImage);

    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);

    for(let i = 0; i < inputImage.width;++i){
    for(let j = 0; j < inputImage.height;++j){
      let pixel = inputImage.getPixel(i,j);
      if(pixel[0]>0.7||pixel[1]>0.7||pixel[2]>0.7){
        pixel[0] = pixel[0]> 0.7 ? 1.0:pixel[0];
        pixel[1] = pixel[1]> 0.7 ? 1.0:pixel[1];
        pixel[2] = pixel[2]> 0.7 ? 1.0:pixel[2];
       assert(pixelEq(pixel,outImage.getPixel(i,j)));
      }
      else{
        assert(pixelEq(pixel,outImage.getPixel(i,j)));
         assert(pixel !== outImage.getPixel(i,j));
      }
    }
  }
});

test('blackenLow', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }
    
    let outImage = blackenLow(inputImage);

    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);

});


test('colorize', function(){

    let inputImage = lib220.createImage(100,100,[0,0,0]);
    for(let x = 0;x<inputImage.width;++x){
      for(let y = 0;y<inputImage.height;++y){
        inputImage.setPixel(x,y,robot.getPixel(x,y));
      }
    }
    
    let outImage = colorize(inputImage);
    let check = saturateHigh(blackenLow(toGrayscale(inputImage)));


    assert(inputImage.width === outImage.width && inputImage.height === outImage.height);

    for(let i = 0; i < inputImage.width;++i){
    for(let j = 0; j < inputImage.height;++j){
     assert(pixelEq(check.getPixel(i,j),outImage.getPixel(i,j)));

    }
  }
});
