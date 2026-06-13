import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Generates an OAuth 2.0 Access Token for Google Service Account using JWT.
 * @param {Object} serviceAccount - Parsed Service Account JSON key.
 * @returns {Promise<string>} Access token.
 */
async function getAccessToken(serviceAccount) {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    
    const now = Math.floor(Date.now() / 1000);
    const claimSet = Buffer.from(JSON.stringify({
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/drive.file',
        aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    })).toString('base64url');

    const signatureInput = `${header}.${claimSet}`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(serviceAccount.private_key, 'base64url');
    
    const jwt = `${signatureInput}.${signature}`;

    const response = await fetch(serviceAccount.token_uri || 'https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google OAuth token retrieval failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Uploads a file to Google Drive using Multipart Upload.
 * @param {string} filePath - Path to the file.
 * @param {string} accessToken - OAuth access token.
 * @param {string} [folderId] - Optional Google Drive Folder ID.
 */
async function uploadFile(filePath, accessToken, folderId) {
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    const fileData = fs.readFileSync(filePath);

    console.log(`[Google Drive] Preparing to upload ${fileName} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`);

    const metadata = {
        name: fileName,
        mimeType: 'application/octet-stream'
    };

    if (folderId) {
        metadata.parents = [folderId];
    }

    const boundary = 'gdrive_multipart_boundary_12345';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    // Construct body components
    const bodyHeader = delimiter + 
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' + 
        JSON.stringify(metadata) + 
        delimiter + 
        'Content-Type: application/octet-stream\r\n\r\n';

    const bodyFooter = closeDelimiter;

    const payloadBuffer = Buffer.concat([
        Buffer.from(bodyHeader, 'utf-8'),
        fileData,
        Buffer.from(bodyFooter, 'utf-8')
    ]);

    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': String(payloadBuffer.length)
        },
        body: payloadBuffer
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Drive upload failed with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log(`[Google Drive] Successfully uploaded backup! File ID: ${data.id}`);
}

async function main() {
    const fileArg = process.argv[2];
    if (!fileArg) {
        console.error('Usage: node uploadToDrive.js <file-path>');
        process.exit(1);
    }

    const filePath = path.resolve(fileArg);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const saJsonString = process.env.GDRIVE_SERVICE_ACCOUNT;
    if (!saJsonString) {
        console.error('Error: GDRIVE_SERVICE_ACCOUNT environment variable is not defined.');
        process.exit(1);
    }

    let serviceAccount;
    try {
        serviceAccount = JSON.parse(saJsonString);
    } catch (e) {
        console.error('Error parsing GDRIVE_SERVICE_ACCOUNT JSON:');
        console.error(e.message);
        process.exit(1);
    }

    const folderId = process.env.GDRIVE_FOLDER_ID || null;

    try {
        console.log('[Google Drive] Requesting access token...');
        const token = await getAccessToken(serviceAccount);
        console.log('[Google Drive] Authenticated successfully.');
        
        await uploadFile(filePath, token, folderId);
    } catch (err) {
        console.error('[Google Drive Error] Backup upload failed:', err.message);
        process.exit(1);
    }
}

main();
