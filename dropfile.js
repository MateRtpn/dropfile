require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};




firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();


const dropArea = document.getElementById('dropArea');
const statusMessage = document.getElementById('statusMessage');
const gallery = document.getElementById('gallery');
const copyMessage = document.createElement('div');
copyMessage.id = 'copyMessage';
document.body.appendChild(copyMessage);


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => e.preventDefault(), false);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});
['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});


dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  [...files].forEach(uploadImage);
});

const uploadImage = async (file) => {
  const storageRef = storage.ref(`images/${file.name}`);
  try {
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log('File available at', downloadURL);


    const uploadedImage = document.createElement('img');
    uploadedImage.src = downloadURL;
    uploadedImage.alt = 'Uploaded Image';
    uploadedImage.style.cursor = 'pointer';
    
    uploadedImage.addEventListener('click', () => copyToClipboard(downloadURL));

    gallery.appendChild(uploadedImage);

  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const copyToClipboard = (text) => {
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = text;
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);


  copyMessage.textContent = 'คัดลอกลิงก์สำเร็จ!';
  copyMessage.style.display = 'block';
  
  setTimeout(() => {
    copyMessage.style.display = 'none';
  }, 2000);
};
