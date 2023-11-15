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

let convertedCounter = 0;

function convertToWebP() {
    const loader = document.getElementById('loader');
    const doneMessage = document.getElementById('doneMessage');
    const outputContainer = document.getElementById('outputContainer');
    const startAgainBtn = document.getElementById('startAgainBtn');

    // Clear the webPDataUrls array
    webPDataUrls = [];

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

        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);

            const webPDataUrl = canvas.toDataURL('image/webp');

            // Check if the webPDataUrl is not empty before adding to the array
            if (webPDataUrl.trim() !== '') {
                webPDataUrls.push(webPDataUrl);
            }

            pictureCounter++;

            const convertedButton = document.createElement('button');
            convertedButton.className = 'convertedButton';
            convertedCounter++;
            convertedButton.textContent = `${convertedCounter} Picture(s) Converted`;
            loadedPicturesContainer.appendChild(convertedButton);

            if (downloadBtnClicked) {
                document.getElementById('newPictureBtn').style.display = pictureCounter < 10 ? 'block' : 'none';
            }
        };
    }

    setTimeout(function () {
        loader.style.display = 'none';
        doneMessage.style.display = 'block';

        setTimeout(function () {
            doneMessage.style.display = 'none';

            // Clear the output container
            outputContainer.innerHTML = '';

            // Show the "Add More Pictures" button
            startAgainBtn.style.marginRight = doneMessage.style.display === 'block' ? '15px' : '0';
            startAgainBtn.style.display = 'block';
        }, 4000);
    }, 4000);
}




function downloadWebP() {
    if (webPDataUrls.length > 0) {
        // Check if the download button has already been clicked
        if (downloadBtnClicked) {
            alert('Images have already been downloaded.');
            return;
        }

        // Filter out empty data URLs
        const validWebPDataUrls = webPDataUrls.filter(url => url.trim() !== '');

        if (validWebPDataUrls.length > 0) {
            for (let i = 0; i < validWebPDataUrls.length; i++) {
                const a = document.createElement('a');
                a.href = validWebPDataUrls[i];
                a.download = `converted_image_${i + 1}.webp`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            // Set the flag to indicate that the download button has been clicked
            downloadBtnClicked = true;
        } else {
            alert('No valid images to download.');
        }
    } else {
        alert('Please convert and add images to download.');
    }
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
    const confirmation = window.confirm("Are you sure you want to delete the uploaded photos?");
    
    if (confirmation) {
        location.reload();
    }
}

