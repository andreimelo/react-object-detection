import React,{ useEffect } from 'react';
import './../../../../resources/styles/components/webcam.css';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

function Webcam(){

    const canvas = document.getElementById("canvas");
    const video = document.getElementById("video");

    function detectVideoFrame(video,model){
      model.detect(video).then(predictions => {
          renderPredictions(predictions);
        requestAnimationFrame(() => {
        return  detectVideoFrame(video, model);});
        });
    }

    async function predictWithCoco(){
      try {
        const model = await cocoSsd.load('lite_mobilenet_v2');
       return detectVideoFrame(video,model);
      } catch (err) {
        console.error(err);
      }
    }
 
    function renderPredictions(predictions){
      const ctx = canvas.getContext("2d");  
        canvas.width  = 670;
        canvas.height = 500;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  
        
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        ctx.drawImage(video,0,0,670,500);
        
        predictions.forEach(prediction => {  
        
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];// Bounding box style
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 10;// Draw the bounding
        ctx.strokeRect(x, y, width, height);  
        
        // Label background
        ctx.fillStyle = "yellow";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });
        
        predictions.forEach(prediction => {
          // Write prediction class names
          const x = prediction.bbox[0];
          const y = prediction.bbox[1];  
          ctx.fillStyle = "#000000";
          ctx.fillText(prediction.class, x, y);
        });   
        };
    
        async function openCamera(){
          navigator.mediaDevices
          .getUserMedia({
          audio: false,
          video: {facingMode: "user",}
          })
          .then(stream => {
              video.srcObject = stream;
              video.onloadedmetadata = (event) => {
              console.log(event);
              if (!event){
                return
              }
              video.play();
             };
          });
        }

    useEffect(()=>{
        openCamera();
        predictWithCoco();
    },[])

    return(
      <div style={{textAlign:"center"}}>
      <h1>Real Time Object Detection with Tensorflow</h1>
      <video   id="video" width="670" height="500"/>
      <canvas id="canvas"/>
    </div>
    )
}

export default Webcam;