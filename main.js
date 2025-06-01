const tabs = [
    { id: 'ROBLOX', name: 'ROBLOX', csv: './csv/ROBLOX.csv' },
    { id: 'MobileHD', name: 'ROBLOX Mobile HD', csv: './csv/MobileHD.csv' },
    { id: 'Developer', name: 'Roblox Developer', csv: './csv/Developer.csv' },
    { id: 'HangOutinaDiscoandChat', name: 'Hang Out in a Disco and Chat', csv: './csv/HangOutinaDiscoandChat.csv' },
    { id: 'SpaceKnights', name: 'Space Knights', csv: './csv/SpaceKnights.csv' },
    { id: 'SurviveTheDisasters', name: 'Survive the Disasters', csv: './csv/SurviveTheDisasters.csv' },
    { id: 'Internal', name: 'Roblox Internal', csv: './csv/Internal.csv' }
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

function parseCSV(csv) {
    const rows = [];
    let currentRow = [];
    let currentFieldChars = [];
    let insideQuotes = false;
    
    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];
        
        if (char === '"' && insideQuotes && nextChar === '"') {
            currentFieldChars.push('"');
            i++; // skip escaped quote
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentFieldChars.join(''));
            currentFieldChars = [];
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
            if (char === '\r') i++; // skip \n after \r
            currentRow.push(currentFieldChars.join(''));
            rows.push(currentRow);
            currentRow = [];
            currentFieldChars = [];
        } else {
            currentFieldChars.push(char);
        }
    }
    
    // Add the last field and row if needed
    if (currentFieldChars.length > 0 || currentRow.length > 0) {
        currentRow.push(currentFieldChars.join(''));
        rows.push(currentRow);
    }
    
    return rows;
}

function generateTable(csv) {
    const rows = parseCSV(csv).slice(1); // Skip the header row
    
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
            <a target="_blank" rel="noopener noreferrer" href="${link.trim()}" class="group inline-flex items-center justify-center rounded-lg" onclick="openModal('download-modal', '${link.trim()}')">
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

function generateTableAndroid(csv) {
    const rows = parseCSV(csv).slice(1); // Skip the header row

    let html = `<table class="min-w-full bg-gray-800 border border-gray-700 rounded-b-lg">
      <thead>
        <tr class="text-left border-b border-gray-700">
          <th class="p-3">Version</th>
          <th class="p-3">Version Code</th>
          <th class="p-3">Release Date</th>
          <th class=""></th>
          <th class="p-3 text-center">Download</th>
        </tr>
      </thead>
      <tbody>`;

    for (const row of rows) {
        const [version, versionCode, releaseDate, , minSDK, targetSDK, notes, link] = row;
        const encrypted = link.includes('ipadown');
        const versionCodeInt = parseInt(versionCode, 10);
        const splitsCount = (versionCodeInt >= 563) + (versionCodeInt >= 576) + (versionCodeInt >= 1654);

        html += `
        <tr class="border-b border-gray-700">
          <td class="p-3">${version}</td>
          <td class="p-3">${versionCode}</td>
          <td class="p-3">${releaseDate}</td>
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
              ${minSDK ? `
              <div class="group relative inline-flex items-center justify-center p-1">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="45%" font-size="14" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">
                  ${minSDK.split(' ')[1]}
                  </text>
                  <text x="50%" y="70%" font-size="7" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">Minimum</text>
                  <text x="50%" y="100%" font-size="8" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">SDK</text>
                </svg>
                <span class="absolute bottom-full hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                  Minimum SDK is ${minSDK}
                </span>
              </div>` : ''}
              ${targetSDK ? `
              <div class="group relative inline-flex items-center justify-center p-1">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="45%" font-size="14" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">
                  ${targetSDK.split(' ')[1]}
                  </text>
                  <text x="50%" y="70%" font-size="7" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">Target</text>
                  <text x="50%" y="100%" font-size="8" text-anchor="middle" font-family="Arial, sans-serif" fill="currentColor">SDK</text>
                </svg>
                <span class="absolute bottom-full hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                  Target SDK is ${targetSDK}
                </span>
              </div>` : ''}
              ${splitsCount > 0 ? `
                <div class="group relative inline-flex items-center justify-center p-1">
                  <div class="w-8 h-8 bg-slate-700 text-white flex items-center justify-center rounded-[8px]">
                    <span class="text-sm font-medium">${splitsCount}<span class="ml-[1px]">S</span></span>
                  </div>
                  <span class="absolute bottom-full mb-1 hidden group-hover:flex bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap shadow-md">
                    ${splitsCount} ${splitsCount > 1 ? 'Splits' : 'Split'}
                </span>
              </div>` : ''}
            </div>
          </td>
          ${link.trim() !== "" ? `
          <td class="p-3 text-center">
            ${splitsCount > 0 ? `
            <a target="_blank" rel="noopener noreferrer" href="${link.trim()}" class="group inline-flex items-center justify-center rounded-lg" onclick="openModal('download-bundle-modal', '${link.trim()}', { version: '${version}', versionCode: '${versionCode}', releaseDate: '${releaseDate}', minSDK: '${minSDK}', targetSDK: '${targetSDK}' }); return false;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 group-hover:text-gray-300 transition">
                <path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M18.25,4H5.75L4,7v12c0,0.552,0.448,1,1,1h14c0.552,0,1-0.448,1-1V7L18.25,4z" />
                <path fill="none" stroke="currentColor" stroke-width="2" d="M4 8L20 8" />
                <path d="M4,8v12h16V8H4z M14.966,15.366l-2.4,2.4c-0.312,0.312-0.819,0.312-1.131,0l-2.4-2.4c-0.229-0.229-0.297-0.572-0.173-0.872C8.985,14.195,9.276,14,9.6,14H11v-3c0-0.552,0.448-1,1-1s1,0.448,1,1v3h1.4c0.323,0,0.615,0.195,0.739,0.494C15.18,14.593,15.2,14.697,15.2,14.8C15.2,15.008,15.119,15.213,14.966,15.366z" fill="currentColor" />
              </svg>
            </a>` : `
            <a target="_blank" rel="noopener noreferrer" href="${link.trim()}" class="group inline-flex items-center justify-center rounded-lg" onclick="openModal('download-modal', '${link.trim()}')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" class="w-6 h-6 group-hover:text-gray-300 transition">
                <path d="M15 1C14.448 1 14 1.448 14 2V6H16V2C16 1.448 15.552 1 15 1ZM16 6V18.586L18.293 16.293C18.684 15.902 19.316 15.902 19.707 16.293C20.098 16.684 20.098 17.316 19.707 17.707L15.707 21.707C15.512 21.902 15.256 22 15 22C14.744 22 14.488 21.902 14.293 21.707L10.293 17.707C9.902 17.316 9.902 16.684 10.293 16.293C10.684 15.902 11.316 15.902 11.707 16.293L14 18.586V6H6C4.895 6 4 6.895 4 8V25C4 26.105 4.895 27 6 27H24C25.105 27 26 26.105 26 25V8C26 6.895 25.105 6 24 6H16Z" fill="currentColor"/>
              </svg>
            </a>`}
            </a>
          </td>` : ''}
        </tr>`;
    }

    html += `</tbody></table>`;
    return html;
}


window.onload = async () => {
    let platform = localStorage.getItem('currentPlatform') || 'iOS';
    setPlatform(platform, false);
    
    await createTabs();
    
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
                                headers: { 'Content-Type': 'application/json' },
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

async function createTabs() {
    const platform = localStorage.getItem('currentPlatform');
    const isAndroid = platform === 'Android';

    // Dynamically create the tabs container
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = ''; // Clear any existing content

    const tabsContentContainer = document.getElementById('tabsContent');
    tabsContentContainer.innerHTML = ''; // Clear any existing content

    // Add all tabs first
    for (const [index, tab] of tabs.entries()) {
        if (isAndroid && index > 0) {
            continue; // Skip the rest of the tabs for Android
        }

        const button = document.createElement('button');
        button.id = `btn-tab-${tab.id}`;
        button.className = `tab-button px-4 py-2 ${
            index === 0 ? 'bg-gray-800 border-b-2 border-blue-500 text-white' : 'bg-gray-900 text-gray-400'
        } rounded-t-lg`;
        button.textContent = tab.name;
        button.onclick = () => showTab(`tab-${tab.id}`);
        tabsContainer.appendChild(button);

        const tabDiv = document.createElement('div');
        tabDiv.setAttribute('id', `tab-${tab.id}`);
        tabDiv.classList.add('tab-content');
        if (tab.id !== 'ROBLOX') {
            tabDiv.classList.add('hidden');
        }
        tabsContentContainer.appendChild(tabDiv);
    }

    // Load content for each tab in the background
    for (const [index, tab] of tabs.entries()) {
        if (isAndroid && index > 0) {
            continue; // Skip the rest of the tabs for Android
        }

        try {
            const content = await fetch(isAndroid ? './csv/Android.csv' : tab.csv).then((r) => {
                if (!r.ok) throw new Error(`Failed to load ${tab.csv}`);
                return r.text();
            });

            const tabDiv = document.getElementById(`tab-${tab.id}`);
            if (isAndroid) {
                tabDiv.innerHTML = generateTableAndroid(content);
            } else {
                tabDiv.innerHTML = generateTable(content);
            }
        } catch (error) {
            console.error(`Error loading CSV for tab ${tab.id}:`, error);
            const tabDiv = document.getElementById(`tab-${tab.id}`);
            tabDiv.innerHTML = `<p class="text-red-500 text-center">Failed to load data for this tab.</p>`;
        }
    }

    // Add the upload button for iOS
    if (isAndroid) return;
    const uploadButton = document.createElement('button');
    uploadButton.id = 'btn-upload';
    uploadButton.className = 'ml-auto px-4 py-2 text-gray-200 transition flex items-center space-x-2';
    uploadButton.onclick = () => openModal('upload-modal');
    uploadButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50" aria-hidden="true">
        <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M32,35c0,0,8.312,0,9.098,0C45.463,35,49,31.463,49,27.099s-3.537-7.902-7.902-7.902c-0.02,0-0.038,0.003-0.058,0.003c0.061-0.494,0.103-0.994,0.103-1.504c0-6.71-5.439-12.15-12.15-12.15c-5.229,0-9.672,3.309-11.386,7.941c-1.087-1.089-2.591-1.764-4.251-1.764c-3.319,0-6.009,2.69-6.009,6.008c0,0.085,0.01,0.167,0.013,0.251C3.695,18.995,1,22.344,1,26.331C1,31.119,4.881,35,9.67,35c0.827,0,8.33,0,8.33,0" />
        <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-width="2" d="M20 28L25 23 30 28M25 43L25 23.333" />
      </svg>
      <span>Upload an IPA</span>
    `;
    tabsContainer.appendChild(uploadButton);
}

function openModal(modalId, url, metadata = {}) {
    const modal = document.getElementById(modalId);

    if (modalId === 'download-bundle-modal') {
        const startDownloadButton = document.getElementById('start-download');
        startDownloadButton.onclick = () => startBundleDownload(url, metadata);

        // Populate file metadata
        document.getElementById('bundle-version').textContent = `Version: ${metadata.version || 'N/A'}`;
        document.getElementById('bundle-version-code').textContent = `Version Code: ${metadata.versionCode || 'N/A'}`;
        document.getElementById('bundle-release-date').textContent = `Release Date: ${metadata.releaseDate || 'N/A'}`;
        document.getElementById('bundle-min-sdk').textContent = `Minimum SDK: ${metadata.minSDK || 'N/A'}`;
        document.getElementById('bundle-target-sdk').textContent = `Target SDK: ${metadata.targetSDK || 'N/A'}`;

        if (metadata.releaseDate === 'Unknown') {
            document.getElementById('bundle-release-date').classList.add('hidden');
        } else {
            document.getElementById('bundle-release-date').classList.remove('hidden');
        }

        validateBundleModal();
    }

    const downloadLink = modal.querySelector('.download-again-link');
    if (url && downloadLink) {
        downloadLink.href = url; // Set the URL for the link
    }

    if (sessionStorage.getItem(modalId + '-dontshowagain') === 'true') return;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10); // Small delay to allow transition to apply
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 200);
    
    const dontShowAgain = modal.querySelector('.dont-show-again-checkbox');
    if (dontShowAgain && dontShowAgain.checked) {
        sessionStorage.setItem(modalId + '-dontshowagain', 'true');
    }

    if (modalId === 'download-bundle-modal') {
        const downloadProgress = document.getElementById('download-progress');
        downloadProgress.classList.add('hidden');
    }
}

async function downloadFile(url, onProgress) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}`);

    const reader = response.body.getReader();
    const contentLength = parseInt(response.headers.get('Content-Length'), 10);
    let receivedLength = 0;
    const chunks = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;

        if (onProgress && contentLength) {
            const progress = (receivedLength / contentLength) * 100;
            onProgress(progress);
        }
    }

    return new Blob(chunks);
}

async function startBundleDownload(baseUrl, metadata) {
    baseUrl = baseUrl.replace('archive.org/download', 'archive.org/cors'); // Undocumented CORS fix for archive.org (why was this so hard to find??)
    const includedApks = [];
    const selectedArchitectures = [];

    if (document.getElementById('arch-arm64_v8a').checked) {
        includedApks.push(`com.roblox.client-config.arm64_v8a-${metadata.versionCode}.apk`);
        selectedArchitectures.push('arm64_v8a');
    }
    if (document.getElementById('arch-armeabi_v7a').checked) {
        includedApks.push(`com.roblox.client-config.armeabi_v7a-${metadata.versionCode}.apk`);
        selectedArchitectures.push('armeabi_v7a');
    }
    if (document.getElementById('arch-x86_64').checked) {
        includedApks.push(`com.roblox.client-config.x86_64-${metadata.versionCode}.apk`);
        selectedArchitectures.push('x86_64');
    }
    if (!document.getElementById('exclude-base').checked) {
        includedApks.push(`com.roblox.client-${metadata.versionCode}.apk`);
    }

    const bundleFormat = document.getElementById('bundle-format').value;
    if (includedApks.length === 0) return;

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const downloadProgress = document.getElementById('download-progress');

    progressBar.style.width = '0%';
    progressText.textContent = 'Preparing download...';
    downloadProgress.classList.remove('hidden');

    try {
        if (bundleFormat === 'single' && includedApks.length === 1) {
            // Handle single APK download
            const apk = includedApks[0];
            const blob = await downloadFile(baseUrl + apk, (progress) => {
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `Downloading... ${Math.round(progress)}%`;
            });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = apk;
            downloadLink.click();

            progressText.innerHTML = `
                <p class="text-gray-300 text-center">
                    Your download has completed!<br>If it didn't start yet, 
                    <a href="${downloadLink.href}" class="text-blue-400 underline hover:text-blue-500" download="${apk}">click here</a>.
                </p>`;
        } else {
            // Handle ZIP download
    const zip = new JSZip();
    let totalSize = 0;
    const fileSizes = {};

            progressText.textContent = 'Starting download...';
            // First pass to calculate total size
        for (const apk of includedApks) {
                try {
            const head = await fetch(baseUrl + apk, { method: 'HEAD' });
                    if (!head.ok) throw new Error(`HTTP error ${head.status}`);
            const size = parseInt(head.headers.get('Content-Length'), 10);
                    if (isNaN(size)) throw new Error('Invalid Content-Length');
            fileSizes[apk] = size;
            totalSize += size;
                } catch (error) {
                   throw new Error(`Failed to get size for ${apk}: ${error.message}`);
                }
        }

            if (totalSize === 0 && includedApks.length > 0) {
                 throw new Error("Calculated total size is zero. Cannot calculate progress.");
            }

            let completedSize = 0; // Track size of completed files

            // Second pass to download and track progress
        for (const apk of includedApks) {
                 // Update text before starting download for this specific APK
                 progressText.textContent = `Downloading ${apk}...`;

                 const currentFileSize = fileSizes[apk]; // Size of the current file

            const blob = await downloadFile(baseUrl + apk, (progress) => {
                    const currentFileBytesDownloaded = currentFileSize * (progress / 100);
                    const overallReceivedSize = completedSize + currentFileBytesDownloaded;
                    const overallProgress = totalSize > 0 ? Math.min(100, (overallReceivedSize / totalSize) * 100) : 0;

                progressBar.style.width = `${overallProgress}%`;
                    progressText.textContent = `Downloading (${apk})... ${Math.round(overallProgress)}%`;
            });

                completedSize += currentFileSize;
            zip.file(apk, blob);
        }

        const finalBlob = await zip.generateAsync({ type: 'blob' });

            const architectures = selectedArchitectures.join('_') || 'base';
            const filename = `ROBLOX_v${metadata.version}(${metadata.versionCode}_${architectures}).${bundleFormat}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(finalBlob);
            downloadLink.download = filename;
        downloadLink.click();

            progressText.innerHTML = `
                <p class="text-lg text-gray-300 text-center">
                    Your download has completed!<br>If it didn't start yet, 
                    <a href="${downloadLink.href}" class="text-blue-400 underline hover:text-blue-500" download="${downloadLink.download}">click here</a>.
                </p>`;
}
    } catch (error) {
        progressText.textContent = `Error: ${error.message}`;
            }
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
        
        const { parsedPlist, iTunesMetadata, zipContents, isEncrypted } = await readIPAFile(file); // Correctly destructure the returned object
        displayAppInfo(parsedPlist, iTunesMetadata, zipContents, file.size, isEncrypted);
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
    
    // Locate the iTunesMetadata.plist file
    const iTunesMetadataPath = Object.keys(zipContents.files).find(path => path.includes("iTunesMetadata.plist"));
    let iTunesMetadata = {};
    if (iTunesMetadataPath) {
        try {
            const iTunesData = await zip.file(iTunesMetadataPath).async("uint8array");
            const iTunesText = new TextDecoder().decode(iTunesData);
            iTunesMetadata = plist.parse(iTunesText);
            console.log("Parsed iTunesMetadata.plist:", iTunesMetadata);
        } catch (error) {
            console.warn("Failed to parse iTunesMetadata.plist:", error);
        }
    }
    
    // Locate the main binary path
    const appDirectory = plistPath.match(/Payload\/(.*\.app)\//)?.[1];
    const mainBinaryName = parsedPlist.CFBundleExecutable;
    if (!appDirectory || !mainBinaryName) {
        alert("Main binary not found in the IPA file.");
        return { parsedPlist, iTunesMetadata, zipContents };
    }
    
    const mainBinaryPath = `Payload/${appDirectory}/${mainBinaryName}`;
    const mainBinaryFile = zipContents.file(mainBinaryPath);
    console.log("Main binary path:", mainBinaryPath);
    
    if (!mainBinaryFile) {
        alert("Main binary file not found in the IPA file.");
        return { parsedPlist, iTunesMetadata, zipContents };
    }
    
    // Analyze the main binary
    const mainBinaryData = await mainBinaryFile.async("arraybuffer");
    const isEncrypted = analyzeExecutable(mainBinaryData);
    
    console.log(`Main binary (${mainBinaryName}) is ${isEncrypted ? "encrypted" : "not encrypted"}.`);
    
    return { parsedPlist, iTunesMetadata, zipContents, isEncrypted };
}

function showWarningMessage(message) {
    const warningMessage = document.getElementById("app-encrypted");
    const textNode = warningMessage.querySelector(".warning-text");
    
    if (textNode) {
        textNode.textContent = message;
    }
    
    warningMessage.classList.remove("hidden");
}

function hideWarningMessage() {
    const warningMessage = document.getElementById("app-encrypted");
    warningMessage.classList.add("hidden");
}

const tamperedFiles = [
    "Payload/Roblox.app/rbxupgradespoof.dylib",
    "Payload/Roblox.app/libsubstrate.dylib",
    "Payload/Roblox.app/SignedByEsign"
];

async function displayAppInfo(parsedPlist, iTunesMetadata, zipContents, fileSize, isEncrypted) {
    const appName = parsedPlist.CFBundleDisplayName || parsedPlist.CFBundleName || "Unknown App";
    const appVersion = parsedPlist.CFBundleShortVersionString || "Unknown Version";
    const minIOSVersion = parsedPlist.MinimumOSVersion || "Unknown iOS Version";
    const softwareVersionExternalIdentifier = iTunesMetadata.softwareVersionExternalIdentifier || "Unknown";
    
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
            const blob = new Blob([fixedIconData], { type: "image/png" });
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
    document.getElementById("app-software-id").textContent = `SoftwareVersionExternalIdentifier: ${softwareVersionExternalIdentifier}`;
    
    // Check for tampered files
    const tampered = tamperedFiles.some(file => zipContents.files[file]);
    if (tampered) {
        showWarningMessage("This app may have been tampered with!");
    } else if (isEncrypted) {
        showWarningMessage("This app is likely encrypted!");
    } else {
        hideWarningMessage();
    }
    
    document.getElementById("app-info").classList.remove("hidden");
}

function analyzeExecutable(executableData) {
    const ENCRYPTION_INFO_CMDS = [0x21, 0x2C]; // 0x21 = LC_ENCRYPTION_INFO, 0x2C = LC_ENCRYPTION_INFO_64
    
    const dataView = new DataView(executableData);
    const magicBE = dataView.getUint32(0, false);
    const magicLE = dataView.getUint32(0, true);
    
    let magic, littleEndian;
    if ([0xfeedface, 0xfeedfacf].includes(magicLE)) {
        magic = magicLE;
        littleEndian = true;
    } else if ([0xcefaedfe, 0xcffaedfe].includes(magicBE)) {
        magic = magicBE;
        littleEndian = false;
    } else {
        console.warn("Not a valid Mach-O binary.");
        return false;
    }
    
    const is64Bit = magic === 0xfeedfacf || magic === 0xcffaedfe;
    const headerSize = is64Bit ? 32 : 28;
    const ncmds = dataView.getUint32(16, littleEndian);
    const commandsOffset = headerSize;
    
    let offset = commandsOffset;
    for (let i = 0; i < ncmds; i++) {
        const cmd = dataView.getUint32(offset, littleEndian);
        const cmdsize = dataView.getUint32(offset + 4, littleEndian);
        
        if (ENCRYPTION_INFO_CMDS.includes(cmd)) {
            const cryptidOffset = is64Bit ? offset + 16 : offset + 12;
            const cryptid = dataView.getUint32(cryptidOffset, littleEndian);
            console.log(`Encryption detected: cryptid=${cryptid}`);
            return cryptid === 1;
        }
        
        offset += cmdsize;
    }
    
    console.warn("No encryption info found in the Mach-O header.");
    return false;
}

function setPlatform(platform, rebuild = true) {
    const iosButton = document.getElementById('platform-ios');
    const androidButton = document.getElementById('platform-android');
    
    if (platform === 'iOS') {
        iosButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        iosButton.classList.remove('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
        androidButton.classList.add('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
        androidButton.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    } else if (platform === 'Android') {
        androidButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        androidButton.classList.remove('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
        iosButton.classList.add('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
        iosButton.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    }
    
    localStorage.setItem('currentPlatform', platform);
    console.log(`Platform switched to: ${platform}`);
    
    if (rebuild) {
        document.getElementById('tabs').innerHTML = '';
        document.getElementById('tabsContent').innerHTML = '';
        createTabs();
    }
}

function checkNochitecture() {
    const archArm64 = document.getElementById('arch-arm64_v8a').checked;
    const archArmeabi = document.getElementById('arch-armeabi_v7a').checked;
    const archX86 = document.getElementById('arch-x86_64').checked;


}

function validateBundleModal() {
    const bundleFormatSelect = document.getElementById('bundle-format');
    const archArm64 = document.getElementById('arch-arm64_v8a');
    const archArmeabi = document.getElementById('arch-armeabi_v7a');
    const archX86 = document.getElementById('arch-x86_64');
    const excludeBaseCheckbox = document.getElementById('exclude-base');
    const downloadButton = document.getElementById('start-download');

    const versionCode = parseInt(document.getElementById('bundle-version-code').textContent.split(': ')[1], 10);

    archArm64.disabled = versionCode < 576; // armv8 starts at version code 576
    archArm64.checked = !archArm64.disabled && archArm64.checked;

    archX86.disabled = versionCode < 1654; // x86_64 starts at version code 1654
    archX86.checked = !archX86.disabled && archX86.checked;

    const noArchsChecked = !archArm64.checked && !archArmeabi.checked && !archX86.checked;
    const archsCheckedCount = [archArm64.checked, archArmeabi.checked, archX86.checked].filter(Boolean).length;
    const excludeBase = excludeBaseCheckbox.checked;

    // Reset format options
    const originalSelectedValue = bundleFormatSelect.value;
    bundleFormatSelect.innerHTML = '';
    const options = [];

    // Add 'zip' always unless invalid
    const isInvalid = noArchsChecked && excludeBase;
    if (!isInvalid) {
        // Only allow 'single' if one arch is selected AND base is excluded,
        // or if no archs are selected AND base is NOT excluded
        if ((archsCheckedCount === 1 && excludeBase) || (noArchsChecked && !excludeBase)) {
            options.push({ value: 'single', label: 'Single APK' });
        }

        options.push({ value: 'zip', label: 'Standard ZIP' });

        // Only offer apkm/xapk if base is included
        if (!excludeBase && archsCheckedCount > 0) {
            options.push({ value: 'apkm', label: 'APKM (used by APKMirror)' });
            options.push({ value: 'xapk', label: 'XAPK (used by APKPure and other installers)' });
        }
    }

    let restored = false;
    for (const opt of options) {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        if (!restored && opt.value === originalSelectedValue) {
            optionEl.selected = true;
            restored = true;
        }
        bundleFormatSelect.appendChild(optionEl);
    }

    // Disable controls if invalid
    const shouldDisable = isInvalid;
    downloadButton.disabled = shouldDisable;
    bundleFormatSelect.disabled = shouldDisable;
}
