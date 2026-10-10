document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const vttFileInput = document.getElementById('vttFile');
    const dropArea = document.getElementById('dropArea');
    const fileInfo = document.getElementById('fileInfo');

    const pasteBtn = document.getElementById('pasteBtn');
    const recordingUrlInput = document.getElementById('recordingUrl');
    const recordingPasscodeInput = document.getElementById('recordingPasscode');

    const clearBtn = document.getElementById('clearBtn');

    const linkPreview = document.getElementById('linkPreview');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    const cleanedTranscript = document.getElementById('cleanedTranscript');
    const transcriptStats = document.getElementById('transcriptStats');
    const copyTranscriptBtn = document.getElementById('copyTranscriptBtn');

    // --- State ---
    let rawVttContent = null;

    // --- Event Listeners: File Upload ---
    dropArea.addEventListener('click', () => vttFileInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over'), false);
    });

    dropArea.addEventListener('drop', handleDrop, false);
    vttFileInput.addEventListener('change', handleFileSelect);

    // --- Event Listeners: Inputs ---
    recordingUrlInput.addEventListener('input', updateLinkPreview);
    recordingPasscodeInput.addEventListener('input', updateLinkPreview);

    pasteBtn.addEventListener('click', handlePasteFromClipboard);
    clearBtn.addEventListener('click', clearAll);

    copyLinkBtn.addEventListener('click', copyFormattedLink);
    copyTranscriptBtn.addEventListener('click', copyTranscript);

    cleanedTranscript.addEventListener('input', () => {
        updateTranscriptStats(cleanedTranscript.value);
    });

    // --- Functions: File Handling ---
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (!files || files.length === 0) return;
        const file = files[0];

        fileInfo.textContent = `Loaded: ${file.name} (${formatFileSize(file.size)})`;
        fileInfo.classList.remove('hidden');

        dropArea.classList.add('success');
        const defaultContent = dropArea.querySelector('.drop-content-default');
        if (defaultContent) {
            defaultContent.querySelector('.file-msg').textContent = 'File Ready';
            defaultContent.querySelector('.file-msg-sub').textContent = file.name;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            rawVttContent = e.target.result;
            processTranscript(rawVttContent);
        };
        reader.readAsText(file);
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // --- Functions: Clipboard & Inputs ---
    async function handlePasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (!text || !text.trim()) {
                alert('Clipboard is empty.');
                return;
            }
            parseAndApplyClipboard(text);
            indicateButtonSuccess(pasteBtn, 'Pasted!');
        } catch (err) {
            console.warn('Clipboard read permission denied or unavailable:', err);
            // Prompt fallback
            const pastedText = prompt('Paste your recording invitation or text here:');
            if (pastedText) {
                parseAndApplyClipboard(pastedText);
            }
        }
    }

    function parseAndApplyClipboard(text) {
        if (!text) return;

        // 1. Extract URL (http or https)
        const urlMatch = text.match(/(https?:\/\/[^\s]+)/i);
        if (urlMatch) {
            recordingUrlInput.value = urlMatch[0].replace(/[.,;>)]+$/, '');
        }

        // 2. Extract Passcode: handles "Passcode: 123", "Access Passcode: 123", "Password: 123", "Code: 123"
        const passcodeMatch = text.match(/(?:passcode|password|access\s*code|code):\s*([^\r\n\s]+)/i);
        if (passcodeMatch) {
            recordingPasscodeInput.value = passcodeMatch[1].trim();
        }

        updateLinkPreview();
    }

    // --- Functions: Output 1 (Hyperlinked Recording) ---
    function updateLinkPreview() {
        let url = recordingUrlInput.value.trim();
        const passcode = recordingPasscodeInput.value.trim();

        if (!url) {
            linkPreview.innerHTML = '<span class="placeholder-text">Enter or paste a recording URL above to generate the hyperlinked recording text.</span>';
            return;
        }

        // Ensure scheme
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const passcodeHtml = passcode
            ? ` <span class="passcode-span">(Passcode: <span class="passcode-code">${escapeHtml(passcode)}</span>)</span>`
            : '';

        linkPreview.innerHTML = `
            <p class="link-line">
                <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Watch the Lesson Recording</a>${passcodeHtml}
            </p>
        `;
    }

    async function copyFormattedLink() {
        let url = recordingUrlInput.value.trim();
        const passcode = recordingPasscodeInput.value.trim();

        if (!url) {
            alert('Please provide a recording URL first.');
            return;
        }

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const passcodeSnippet = passcode ? ` (Passcode: ${passcode})` : '';
        const htmlToCopy = `<p><a href="${url}" target="_blank">Watch the Lesson Recording</a>${passcodeSnippet}</p>`;
        const plainTextToCopy = `Watch the Lesson Recording: ${url}${passcodeSnippet}`;

        try {
            if (navigator.clipboard && window.ClipboardItem) {
                const htmlBlob = new Blob([htmlToCopy], { type: 'text/html' });
                const textBlob = new Blob([plainTextToCopy], { type: 'text/plain' });
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': htmlBlob,
                        'text/plain': textBlob
                    })
                ]);
            } else {
                await navigator.clipboard.writeText(plainTextToCopy);
            }
            indicateButtonSuccess(copyLinkBtn, 'Copied!');
        } catch (err) {
            console.error('Failed to copy formatted link: ', err);
            try {
                await navigator.clipboard.writeText(plainTextToCopy);
                indicateButtonSuccess(copyLinkBtn, 'Copied Text!');
            } catch (fallbackErr) {
                alert('Could not copy to clipboard.');
            }
        }
    }

    // --- Functions: Output 2 (Clean Transcript) ---
    function processTranscript(content) {
        const cleaned = cleanVTT(content);
        cleanedTranscript.value = cleaned;
        updateTranscriptStats(cleaned);
    }

    function cleanVTT(content) {
        if (!content) return '';

        // Normalize string
        const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const rawLines = normalized.split('\n');

        const speakerCounts = {};
        const parsedEntries = [];
        const nameRegex = /^([^\d\s][^:]*):\s+(.+)$/;

        // Pass 1: Identify speakers and frequency to determine main speaker
        for (let line of rawLines) {
            line = line.trim();
            if (!line || line === 'WEBVTT' || /^\d+$/.test(line) || line.includes('-->')) continue;
            if (/^(NOTE|STYLE|REGION|Kind:|Language:)/i.test(line)) continue;

            const vTagMatch = line.match(/<v\s+([^>]+)>(.*?)<\/v>/i) || line.match(/<v\s+([^>]+)>(.*)/i);
            if (vTagMatch) {
                const spk = vTagMatch[1].trim();
                speakerCounts[spk] = (speakerCounts[spk] || 0) + 1;
                continue;
            }

            const match = line.match(nameRegex);
            if (match) {
                const name = match[1].trim();
                speakerCounts[name] = (speakerCounts[name] || 0) + 1;
            }
        }

        let mainSpeaker = null;
        let maxCount = -1;
        for (const [name, count] of Object.entries(speakerCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mainSpeaker = name;
            }
        }

        // Pass 2: Clean and anonymize lines
        for (let line of rawLines) {
            line = line.trim();
            if (!line || line === 'WEBVTT' || /^\d+$/.test(line) || line.includes('-->')) continue;
            if (/^(NOTE|STYLE|REGION|Kind:|Language:)/i.test(line)) continue;

            let speaker = null;
            let speech = line;

            const vTagMatch = line.match(/<v\s+([^>]+)>(.*?)<\/v>/i) || line.match(/<v\s+([^>]+)>(.*)/i);
            if (vTagMatch) {
                speaker = vTagMatch[1].trim();
                speech = vTagMatch[2] ? vTagMatch[2].replace(/<\/v>/gi, '').trim() : '';
            } else {
                const match = line.match(nameRegex);
                if (match) {
                    speaker = match[1].trim();
                    speech = match[2].trim();
                }
            }

            // Strip remaining HTML tags and decode HTML entities
            speech = speech.replace(/<[^>]+>/g, '').trim();
            speech = decodeHTMLEntities(speech);
            if (!speech) continue;

            if (speaker) {
                if (speaker === mainSpeaker) {
                    parsedEntries.push({ speaker: 'MAIN', text: speech });
                } else {
                    parsedEntries.push({ speaker: 'STUDENT', text: speech });
                }
            } else {
                parsedEntries.push({ speaker: null, text: speech });
            }
        }

        // Pass 3: Group consecutive lines from same speaker & deduplicate
        const outputParagraphs = [];
        let currentSpeaker = null;
        let currentText = '';

        for (const entry of parsedEntries) {
            const effectiveSpeaker = entry.speaker || currentSpeaker || 'MAIN';

            if (effectiveSpeaker === currentSpeaker && currentText) {
                if (currentText.endsWith(entry.text)) {
                    continue; // Skip exact live-caption duplicates
                }
                if (entry.text.startsWith(currentText)) {
                    currentText = entry.text; // Progressive caption update
                    continue;
                }
                currentText += ' ' + entry.text;
            } else {
                if (currentText) {
                    outputParagraphs.push(formatSpeakerBlock(currentSpeaker, currentText));
                }
                currentSpeaker = effectiveSpeaker;
                currentText = entry.text;
            }
        }

        if (currentText) {
            outputParagraphs.push(formatSpeakerBlock(currentSpeaker, currentText));
        }

        return outputParagraphs.join('\n\n');
    }

    function formatSpeakerBlock(speaker, text) {
        if (speaker === 'STUDENT') {
            return `STUDENT: ${text}`;
        }
        return text;
    }

    function decodeHTMLEntities(text) {
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&apos;': "'",
            '&nbsp;': ' '
        };
        return text.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, match => entities[match] || match);
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function updateTranscriptStats(text) {
        if (!text || !text.trim()) {
            transcriptStats.textContent = '0 words';
            return;
        }
        const words = text.trim().split(/\s+/).filter(Boolean);
        const count = words.length;
        transcriptStats.textContent = `${count.toLocaleString()} words`;
    }

    async function copyTranscript() {
        const text = cleanedTranscript.value.trim();
        if (!text) {
            alert('No transcript content to copy.');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            indicateButtonSuccess(copyTranscriptBtn, 'Copied!');
        } catch (err) {
            console.error('Failed to copy transcript: ', err);
            alert('Failed to copy transcript.');
        }
    }

    function indicateButtonSuccess(btn, successText) {
        const originalHTML = btn.innerHTML;
        btn.classList.add('btn-success');
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${successText}
        `;
        setTimeout(() => {
            btn.classList.remove('btn-success');
            btn.innerHTML = originalHTML;
        }, 2000);
    }

    function clearAll() {
        rawVttContent = null;
        vttFileInput.value = '';
        fileInfo.textContent = '';
        fileInfo.classList.add('hidden');

        dropArea.classList.remove('success');
        const defaultContent = dropArea.querySelector('.drop-content-default');
        if (defaultContent) {
            defaultContent.querySelector('.file-msg').textContent = 'Drag & Drop .vtt File';
            defaultContent.querySelector('.file-msg-sub').textContent = 'or';
        }

        recordingUrlInput.value = '';
        recordingPasscodeInput.value = '';

        updateLinkPreview();

        cleanedTranscript.value = '';
        updateTranscriptStats('');
    }
});
