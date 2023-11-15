let originalImageDataUrls = [];
let webPDataUrls = [];
let pictureCounter = 0;
let downloadBtnClicked = false;

function displayOriginalImages() {
    const inputElement = document.getElementById('imageInput');
    const label = document.getElementById('label');
    const outputContainer = document.getElementById('outputContainer');
    const loadedPicturesContainer = document.getElementById('loadedPicturesContainer');

    const files = inputElement.files;

    if (files.length > 0) {
        label.textContent = `Selected ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`;
        outputContainer.innerHTML = '';

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0, img.width, img.height);

                    const webPDataUrl = canvas.toDataURL('image/webp');

                    originalImageDataUrls.push(e.target.result);
                    webPDataUrls.push(webPDataUrl);

                    pictureCounter++; 

                    const loadedButton = document.createElement('button');
                    loadedButton.className = 'loadedButton';
                    loadedButton.textContent = `${pictureCounter} Picture(s) Added`; 
                    loadedPicturesContainer.appendChild(loadedButton);

                    if (downloadBtnClicked) {
                        document.getElementById('newPictureBtn').style.display = pictureCounter < 10 ? 'block' : 'none';
                    }
                };
            };

            reader.readAsDataURL(files[i]);
        }
    }
}


function convertToWebP() {
    const loader = document.getElementById('loader');
    const doneMessage = document.getElementById('doneMessage');
    const newPictureBtn = document.getElementById('newPictureBtn');
    const outputContainer = document.getElementById('outputContainer');

    loader.style.display = 'block';
    doneMessage.style.display = 'none';

    // Check if there are no photos
    if (originalImageDataUrls.length === 0) {
        alert('NO PICTURE(S) ADDED');
        loader.style.display = 'none';
        return;
    }

    // Clear the output container only if there are no images already
    if (outputContainer.innerHTML.trim() === '') {
        outputContainer.innerHTML = '';
    }

    for (let i = 0; i < originalImageDataUrls.length; i++) {
        const img = new Image();
        img.src = originalImageDataUrls[i];

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);

        const webPDataUrl = canvas.toDataURL('image/webp');
        webPDataUrls.push(webPDataUrl);
    }

    setTimeout(function () {
        loader.style.display = 'none';
        doneMessage.style.display = 'block';

        setTimeout(function () {
            doneMessage.style.display = 'none';
            if (downloadBtnClicked && outputContainer.innerHTML.trim() === '') {
                newPictureBtn.style.display = pictureCounter < 10 ? 'block' : 'none';
            }

            // Hide the output container
            outputContainer.style.display = 'none';
        }, 4000); 
    }, 4000); 
}


function downloadWebP() {
    if (webPDataUrls.length > 0) {
        for (let i = 0; i < webPDataUrls.length; i++) {
            const a = document.createElement('a');
            a.href = webPDataUrls[i];
            a.download = `converted_image_${i + 1}.webp`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        alert('Please convert and add images to download.');
    }
}

function resetForm() {
    const inputElement = document.getElementById('imageInput');
    const label = document.getElementById('label');
    const doneMessage = document.getElementById('doneMessage');
    const newPictureBtn = document.getElementById('newPictureBtn');

    inputElement.value = ''; // Clear the file input
    label.textContent = 'Choose up to 10 Images'; // Reset label
    doneMessage.style.display = 'none'; // Hide the "Done" message
    newPictureBtn.style.display = 'none'; // Hide the "Add More Pictures" button
    downloadBtnClicked = false; // Reset the flag
}

function addNewPictures() {
    resetForm();
    pictureCounter++;

    if (pictureCounter < 10) {
        document.getElementById('imageInput').value = ''; // Clear the file input
        document.getElementById('outputContainer').innerHTML = '';  // Clear the output container
        document.getElementById('newPictureBtn').style.display = 'none'; // Hide the "Add More Pictures" button
        downloadBtnClicked = false; // Reset the flag
    } else {
        alert('Maximum limit reached (10 pictures).');
    }
}

function startAgain() {
    location.reload();
}
