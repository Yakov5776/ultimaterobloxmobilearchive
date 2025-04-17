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

  window.onload = async () => {
    for (const tab of tabs) {
        try {
            const content = await fetch(tab.csv).then(r => {
                if (!r.ok) throw new Error(`Failed to load ${tab.csv}`);
                return r.text();
            });
            document.getElementById('tab-' + tab.id).innerHTML = generateTable(content);
        } catch (error) {
            console.error(`Error loading CSV for tab ${tab.id}:`, error);
            document.getElementById('tab-' + tab.id).innerHTML = `<p class="text-red-500 text-center">Failed to load data for this tab.</p>`;
        }
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

  function openModal(modalId, url) {
    const modal = document.getElementById(modalId);
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

        const { parsedPlist, zipContents, isEncrypted } = await readIPAFile(file); // Correctly destructure the returned object
        displayAppInfo(parsedPlist, zipContents, file.size, isEncrypted);
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

    // Locate the main binary path
    const appDirectory = plistPath.match(/Payload\/(.*\.app)\//)?.[1];
    const mainBinaryName = parsedPlist.CFBundleExecutable;
    if (!appDirectory || !mainBinaryName) {
        alert("Main binary not found in the IPA file.");
        return { parsedPlist, zipContents };
    }

    const mainBinaryPath = `Payload/${appDirectory}/${mainBinaryName}`;
    const mainBinaryFile = zipContents.file(mainBinaryPath);
    console.log("Main binary path:", mainBinaryPath);

    if (!mainBinaryFile) {
        alert("Main binary file not found in the IPA file.");
        return { parsedPlist, zipContents };
    }

    // Analyze the main binary
    const mainBinaryData = await mainBinaryFile.async("arraybuffer");
    const isEncrypted = analyzeExecutable(mainBinaryData);

    console.log(`Main binary (${mainBinaryName}) is ${isEncrypted ? "encrypted" : "not encrypted"}.`);

    return { parsedPlist, zipContents, isEncrypted };
  }

  async function displayAppInfo(parsedPlist, zipContents, fileSize, isEncrypted) {
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

    const encryptedMessage = document.getElementById("app-encrypted");
    if (isEncrypted) {
        encryptedMessage.classList.remove("hidden");
    } else {
        encryptedMessage.classList.add("hidden");
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
            return cryptid !== 0;
        }

        offset += cmdsize;
    }

    console.warn("No encryption info found in the Mach-O header.");
    return false;
}