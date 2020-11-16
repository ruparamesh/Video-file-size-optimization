const express = require("express");

const ffmpeg = require("fluent-ffmpeg");

const bodyParser = require("body-parser");

const fs = require("fs");

const fileUpload = require("express-fileupload");
const { ServerResponse } = require("http");

const app = express();

const PORT = process.env.PORT || 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("C:/ffmpeg/bin");

ffmpeg.setFlvtoolPath("C:/flvtool");

//console.log(ffmpeg);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.post("/convert", (req, res) => {
    // let to = req.body.to;
    let file = req.files.file;
    // let fileName = `output.${to}`;
    // console.log(to);
    // console.log(file);
  
    file.mv("tmp/" + file.name, function (err) {
      if (err) return res.sendStatus(500).send(err);
      console.log("File Uploaded successfully");
    });
      console.log(file.name)
    const spawn = require('child_process').spawn;
    const parent = process.argv[file.name];
    let videos = [file.name];
    
    //if(process.argv[file.name]){
        // Parent Path
        // const start = parseInt(process.argv[3]);
        // const end = parseInt(process.argv[4]);
        // for (let i = start; i <= end; i++) {
        //     videos.push(i);
        // }
        videos.reverse();
        processVideos();
    //}else{
        // Parent Path is required
        //console.log('Parent Folder is required');
    //}
    
    function resizeVideo(video, quality) {
        const p = new Promise((resolve, reject) => {
            const ffmpeg = spawn('C:/ffmpeg/bin/ffmpeg', ['-i', `${'D:/Mini Project- MCA/Video Compression Project/videos'}/${video}`, '-codec:v', 'libx264', '-profile:v', 'main', '-preset', 'slow', '-b:v', '400k', '-maxrate', '400k', '-bufsize', '800k', '-vf', `scale=-2:${quality}`, '-threads', '0', '-b:a', '128k', `${'D:/Mini Project- MCA/Video Compression Project/videos'}/transcoded/${quality}_${video}`]);
            ffmpeg.stderr.on('data', (data) => {
                console.log(`${data}`);
            });
            ffmpeg.on('close', (code) => {
                resolve();
            });
        });
        return p;
    }
    
    function processVideos() {
        let video = videos.pop();
        if (video) {
            //resizeVideo(video, 720).then(() => {
                // 720p video all done
              //  resizeVideo(video, 480).then(() => {
                    // 480p video all done
                    resizeVideo(video, 360).then(() => {
                        // 360p video all done
                        console.log(`Completed Video Number - ${video}`);
                       // res.redirect('/sucess.html');
                       app.post("/", (req, res) => {
                        res.send("/sucess.html");
                      }); 
                       //res.redirect('sucess.html');
                       // req.flash('success', 'Completed');
                        // res.redirect("/sucess.html");
                        //ServerResponse.redirect('/sucess.html');

                        processVideos();
                    });
                //});
           // });
        }
    }
    
});

console.log("reached here")
var server = app.listen(PORT,'127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })
