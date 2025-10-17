import * as openpgp from 'openpgp';
import { PUBLIC_GPG_KEY } from '@/lib/gpg-public-key';

export async function encryptMessage(plain: string): Promise<Uint8Array> {
  const publicKey = await openpgp.readKey({ armoredKey: PUBLIC_GPG_KEY });
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: plain }),
    encryptionKeys: publicKey,
    config: { preferredHashAlgorithm: openpgp.enums.hash.sha256 },
  });
  // Return as Uint8Array for file upload
  return new TextEncoder().encode(encrypted);
}
