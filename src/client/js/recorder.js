const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();

  //다운로드 후  다시 녹화 버튼으로 회귀
  if (startBtn.innerText === "Download Recording") {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleDownload);
    startBtn.addEventListener("click", handleStart);
    document.body.removeChild(a);
    init();
  }
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();

  //카메라 녹화후 끄면 같이 꺼지기
  const tracks = stream.getTracks();
  tracks.forEach((tracks) => {
    tracks.stop();
  });
  stream = null;
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 200, height: 200 },
  });
  video.srcObject = stream;
  video.play();
};
init();
startBtn.addEventListener("click", handleStart);
