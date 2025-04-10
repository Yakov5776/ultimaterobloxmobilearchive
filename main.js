const tabs = [
    { id: 'ROBLOX', csv: './csv/ROBLOX.csv' },
    { id: 'MobileHD', csv: './csv/MobileHD.csv' },
    { id: 'Developer', csv: './csv/Developer.csv' },
    { id: 'HangOutinaDiscoandChat', csv: './csv/HangOutinaDiscoandChat.csv' },
    { id: 'SpaceKnights', csv: './csv/SpaceKnights.csv' },
    { id: 'SurviveTheDisasters', csv: './csv/SurviveTheDisasters.csv' },
    { id: 'Internal', csv: './csv/Internal.csv' }
  ];

  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('bg-gray-800', 'border-b-2', 'border-blue-500', 'text-white');
      btn.classList.add('bg-gray-900', 'text-gray-400');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    activeBtn.classList.remove('bg-gray-900', 'text-gray-400');
    activeBtn.classList.add('bg-gray-800', 'border-b-2', 'border-blue-500', 'text-white');
  }

  function generateTable(csv) {
    const rows = csv.trim().split('\n').slice(1).map(row => row.split(','));
    let html = `<table class="min-w-full bg-gray-800 border border-gray-700 rounded-b-lg">
      <thead>
        <tr class="text-left border-b border-gray-700">
          <th class="p-3">Version</th>
          <th class="p-3">Release Date</th>
          <th class="p-3">SoftwareVersionExternalIdentifier</th>
          <th class=""></th>
          <th class="p-3 text-center">Download</th>
        </tr>
      </thead>
      <tbody>`;

    for (const row of rows) {
      const [version, releaseDate, , externalId, minIOS, notes, link] = row;
      const encrypted = link.includes('ipadown');

      html += `
        <tr class="border-b border-gray-700">
          <td class="p-3">${version}</td>
          <td class="p-3">${releaseDate}</td>
          <td class="p-3">${externalId}</td>
          <td class="">
            <div class="flex space-x-1 items-center justify-center cursor-default">
              ${notes ? `
              <div class="group relative inline-flex items-center justify-center p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                  <path fill="currentColor" d="M13,17h-2v-6h2V17z M13,9h-2V7h2V9z"/>
                  <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2" d="M12 3A9 9 0 1 0 12 21A9 9 0 1 0 12 3Z"/>
                </svg>
                <span class="absolute bottom-full hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                  ${notes}
                </span>
              </div>` : ''}

              ${encrypted ? `
              <div class="group relative inline-flex items-center justify-center p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-auto group-hover:text-gray-300 transition">
                  <path fill="currentColor" d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2zM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V10H9V7zM6 12H18V19H6V12z"></path>
                </svg>
                <span class="absolute bottom-full hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap text-center">
                  This IPA is encrypted with Apple FairPlay.
                  <br>
                  Check Yakov5776/roblox-action-ipadown repository for more information.
                </span>
              </div>` : ''}

              ${minIOS && minIOS != "Unknown" ? `
              <div class="group relative inline-flex items-center justify-center p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" font-size="14" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">
                    ${(str => (m => m ? m[1] + (m[2] && m[2] !== "0" ? "." + m[2] : "") : "")(str.match(/\s(\d+)(?:\.(\d+))?/)))(minIOS)}
                  </text>
                  <text x="50%" y="85%" font-size="8" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">iOS</text>
                </svg>
                <span class="absolute bottom-full hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                  Minimum ${minIOS.split(' ')[0]} version is ${minIOS.split(' ')[1]}
                </span>
              </div>` : ''}
            </div>
          </td>
          ${link.trim() !== "" ? `
          <td class="p-3 text-center">
            <a href="${link}" class="group inline-flex items-center justify-center rounded-lg" download>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" class="w-6 h-6 group-hover:text-gray-300 transition">
                <path d="M15 1C14.448 1 14 1.448 14 2V6H16V2C16 1.448 15.552 1 15 1ZM16 6V18.586L18.293 16.293C18.684 15.902 19.316 15.902 19.707 16.293C20.098 16.684 20.098 17.316 19.707 17.707L15.707 21.707C15.512 21.902 15.256 22 15 22C14.744 22 14.488 21.902 14.293 21.707L10.293 17.707C9.902 17.316 9.902 16.684 10.293 16.293C10.684 15.902 11.316 15.902 11.707 16.293L14 18.586V6H6C4.895 6 4 6.895 4 8V25C4 26.105 4.895 27 6 27H24C25.105 27 26 26.105 26 25V8C26 6.895 25.105 6 24 6H16Z" fill="currentColor"/>
              </svg>
            </a>
            </td>` : ''}
        </tr>`;
    }

    html += `</tbody></table>`;
    return html;
  }

  window.onload = async () => {
    for (const tab of tabs) {
      const content = await fetch(tab.csv).then(r => r.text());
      document.getElementById('tab-' + tab.id).innerHTML = generateTable(content);
    }

    initializeFileUpload();

    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        const notes = document.getElementById('notes').value;
        const uploadButton = e.target.querySelector('button[type="submit"]');
        const progressBar = document.createElement('div');
        const progressIndicator = document.createElement('div');
        const statusMessage = document.getElementById('status-message'); // Reference the pre-existing status message element

        if (fileInput.files.length === 0) {
            statusMessage.textContent = 'Please select a file to upload.';
            statusMessage.className = 'text-red-500 mt-2';
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Set up progress bar
        progressBar.className = 'w-full bg-gray-600 rounded-lg overflow-hidden mt-4';
        progressIndicator.className = 'h-2 bg-blue-500 transition-all';
        progressBar.appendChild(progressIndicator);
        uploadButton.parentElement.appendChild(progressBar);

        statusMessage.className = 'text-gray-300 mt-2';
        statusMessage.textContent = 'Uploading...';

        // Hide the button during upload
        uploadButton.classList.add('hidden');

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://upload.gofile.io/uploadfile', true);

            // Update progress bar
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    progressIndicator.style.width = `${percentComplete}%`;
                    statusMessage.textContent = `Uploading... ${Math.round(percentComplete)}%`;
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'ok') {
                        // Send notification to ai.yakov.cloud/send-notification
                        let responseData = response.data;
                        responseData['notes'] = notes;
                        const notificationData = JSON.stringify({ channel: 'ultimaterobloxmobilearchive', message: JSON.stringify(responseData) });
                        try {
                            await fetch('https://ai.yakov.cloud/send-notification', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: notificationData,
                            });
                            statusMessage.textContent = `Thanks for your contribution! We'll review shortly.`;
                            statusMessage.className = 'text-green-500 mt-2';
                        } catch (error) {
                          statusMessage.textContent = `Upload failed (3): ${error}`;
                          statusMessage.className = 'text-red-500 mt-2';
                        }
                    } else {
                        statusMessage.textContent = `Upload failed (2): ${response.message}`;
                        statusMessage.className = 'text-red-500 mt-2';
                    }
                } else {
                    statusMessage.textContent = `Upload failed (1): ${xhr.statusText}`;
                    statusMessage.className = 'text-red-500 mt-2';
                }
                progressBar.remove();
            };

            xhr.onerror = () => {
                statusMessage.textContent = 'An error occurred during the upload.';
                statusMessage.className = 'text-red-500 mt-2';
                progressBar.remove();
            };

            xhr.onloadend = () => {
                // Show the button again after upload completes
                uploadButton.classList.remove('hidden');
                uploadButton.textContent = 'Upload';
            };

            xhr.send(formData);
        } catch (error) {
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.className = 'text-red-500 mt-2';
            progressBar.remove();
            uploadButton.classList.remove('hidden');
            uploadButton.textContent = 'Upload';
        }
    });
  };

  function openUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10); // Small delay to allow transition to apply
  }

  function closeUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 200);
  }

  function initializeFileUpload() {
    const fileInput = document.getElementById('file-input');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileNameDisplay = document.getElementById('file-name');
    const fileDropText = document.getElementById('file-drop-text');
    const additionalFields = document.getElementById('additional-fields');

    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.classList.add('bg-gray-600');
    });

    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('bg-gray-600');
    });

    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('bg-gray-600');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChosen(file);
        }
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileChosen(file);
        }
    });

    async function handleFileChosen(file) {
        const fileInput = document.getElementById('file-input');
        const fileDropArea = document.getElementById('file-drop-area');
        const fileNameDisplay = document.getElementById('file-name');
        const additionalFields = document.getElementById('additional-fields');

        fileInput.disabled = true;
        fileDropArea.classList.add('hidden');
        fileNameDisplay.textContent = `Selected file: ${file.name}`;
        fileNameDisplay.classList.remove('hidden');
        additionalFields.classList.remove('hidden');
        setTimeout(() => {
            additionalFields.classList.add('opacity-100', 'scale-100');
            additionalFields.classList.remove('opacity-0', 'scale-95');
        }, 10); // Trigger transition

        const { parsedPlist, zipContents } = await readIPAFile(file); // Correctly destructure the returned object
        displayAppInfo(parsedPlist, zipContents, file.size);
    }
  }

  async function readIPAFile(file) {
    const zip = new JSZip();
    const fileData = await file.arrayBuffer();
    const zipContents = await zip.loadAsync(fileData);

    // Locate the Info.plist file
    const plistPath = Object.keys(zipContents.files).find(path => path.match(/Payload\/.*\.app\/Info\.plist$/));
    if (!plistPath) {
        alert("Info.plist not found in the IPA file.");
        return;
    }

    // Extract and parse the Info.plist file
    const plistData = await zip.file(plistPath).async("uint8array");
    const plistText = new TextDecoder().decode(plistData);
    const parsedPlist = plist.parse(plistText);

    console.log("Parsed Info.plist:", parsedPlist);
    //(`App Name: ${parsedPlist.CFBundleName}\nVersion: ${parsedPlist.CFBundleShortVersionString}`);

    return { parsedPlist, zipContents };
  }

  async function displayAppInfo(parsedPlist, zipContents, fileSize) {
    const appName = parsedPlist.CFBundleDisplayName || parsedPlist.CFBundleName || "Unknown App";
    const appVersion = parsedPlist.CFBundleShortVersionString || "Unknown Version";
    const minIOSVersion = parsedPlist.MinimumOSVersion || "Unknown iOS Version";

    // Locate the largest app icon based on CFBundleIcons
    let iconPath = "";
    if (parsedPlist.CFBundleIcons?.CFBundlePrimaryIcon?.CFBundleIconFiles) {
        const iconFiles = parsedPlist.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles;
        const sortedIcons = iconFiles.sort((a, b) => {
            const sizeA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
            const sizeB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
            return sizeB - sizeA; // Sort descending by size
        });

        for (const iconFile of sortedIcons) {
            const potentialPath = Object.keys(zipContents.files).find(path => path.includes(iconFile));
            if (potentialPath) {
                iconPath = potentialPath;
                break;
            }
        }
    }

    const appLogo = document.getElementById("app-logo");
    let appIconUrl = "";
    if (iconPath) {
        try {
            const iconData = await zipContents.file(iconPath).async("uint8array");
            const fixedIconData = await revertCgbiPng(iconData); // this took me over 2 hours to debug, go figure
            const blob = new Blob([fixedIconData], { type: "image/png" })
            appIconUrl = URL.createObjectURL(blob);

            appLogo.src = appIconUrl;
            appLogo.classList.remove("hidden");
        } catch (e) {
            console.warn("Failed to decode icon:", e);
            appLogo.classList.add("hidden");
        }
    } else {
        appLogo.classList.add("hidden");
    }

    // Update the UI
    document.getElementById("app-name").textContent = appName;
    document.getElementById("app-version").textContent = `Version: ${appVersion}`;
    document.getElementById("app-min-ios").textContent = `Minimum iOS Version: ${minIOSVersion}`;
    document.getElementById("app-upload-size").textContent = `Upload Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    document.getElementById("app-info").classList.remove("hidden");
  }

  function analyzeExecutable(executableData) {
  const byteArray = new Uint8Array(executableData);
  let zeroBytes = 0;
  let repeatingBytes = 0;
  const zeroByteThreshold = 0.8;  // 80% of the file being zero bytes
  const repeatingByteThreshold = 0.7;  // 70% of the file being repeating bytes

  // Count zero bytes and repeating byte patterns
  for (let i = 0; i < byteArray.length; i++) {
    if (byteArray[i] === 0) {
      zeroBytes++;
    }
    if (i > 0 && byteArray[i] === byteArray[i - 1]) {
      repeatingBytes++;
    }
  }

  // Check if too much of the file is zero bytes or repeating patterns
  const zeroByteRatio = zeroBytes / byteArray.length;
  const repeatingByteRatio = repeatingBytes / byteArray.length;

  if (zeroByteRatio > zeroByteThreshold || repeatingByteRatio > repeatingByteThreshold) {
    return true;  // Likely encrypted
  }

  return false;  // No obvious signs of encryption
}