const lzma = new LZMA("vendor/lzma_worker.js");

function encodeUint8ArrayToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function serializeStateToBase64(state) {
  const data = JSON.stringify(state);
  return new Promise((resolve, reject) => {
    lzma.compress(data, 1, (compressed, error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(encodeUint8ArrayToBase64(new Uint8Array(compressed)));
    });
  });
}

export function deserializeStateFromBase64(base64) {
  return new Promise((resolve, reject) => {
    const bytes = decodeBase64ToUint8Array(base64);
    lzma.decompress(bytes, (serialized, error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(serialized));
    });
  });
}

export async function writeStateToHash(state) {
  const base64 = await serializeStateToBase64(state);
  window.location.hash = base64;
}

export async function readStateFromHash() {
  const base64 = window.location.hash.substring(1);
  if (!base64) {
    return null;
  }
  try {
    return await deserializeStateFromBase64(base64);
  } catch (error) {
    console.error("Failed to read URL state", error);
    alert("Failed to load Secret Santa data from the URL. Starting over.");
    return null;
  }
}
