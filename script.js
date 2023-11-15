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

                    const loadedButton = createButton('loadedButton', `${pictureCounter} Picture(s) Added`);
                    loadedPicturesContainer.appendChild(loadedButton);

                    if (downloadBtnClicked) {
                        toggleNewPictureButton(pictureCounter);
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

    if (originalImageDataUrls.length === 0) {
        alert('NO PICTURE(S) ADDED');
        loader.style.display = 'none';
        return;
    }

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

            if (webPDataUrl.trim() !== '') {
                webPDataUrls.push(webPDataUrl);
            }

            pictureCounter++;

            const convertedButton = createButton('convertedButton', `${++convertedCounter} Picture(s) Converted`);
            loadedPicturesContainer.appendChild(convertedButton);

            if (downloadBtnClicked) {
                toggleNewPictureButton(pictureCounter);
            }
        };
    }

    setTimeout(() => {
        loader.style.display = 'none';
        doneMessage.style.display = 'block';

        setTimeout(() => {
            doneMessage.style.display = 'none';
            outputContainer.innerHTML = '';
            startAgainBtn.style.display = 'block';
            invisiblePlaceholder.style.visibility = 'hidden';
        }, 4000);
    }, 4000);
}

function downloadWebP() {
    if (webPDataUrls.length > 0) {
        if (downloadBtnClicked) {
            alert('Images have already been downloaded.');
            return;
        }

        const validWebPDataUrls = webPDataUrls.filter(url => url.trim() !== '');

        if (validWebPDataUrls.length > 0) {
            validWebPDataUrls.forEach((url, i) => {
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_image_${i + 1}.webp`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });

            downloadBtnClicked = true;
        } else {
            alert('No valid images to download.');
        }
    }
}

function startAgain() {
    const confirmation = window.confirm("Are you sure you want to delete the uploaded photos?");

    if (confirmation) {
        location.reload();
        placeholder.style.display = 'none';
    }
}

function createButton(className, textContent) {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = textContent;
    return button;
}

function toggleNewPictureButton(counter) {
    const newPictureBtn = document.getElementById('newPictureBtn');
    newPictureBtn.style.display = counter < 10 ? 'block' : 'none';
}
