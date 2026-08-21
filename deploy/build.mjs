// Arma dist/ con el HTML de produccion y el logo transparente, tomandolos del
// repositorio publico en un commit fijo y verificando su checksum.
// La descarga ocurre solo al construir: el resultado desplegado es estatico.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const COMMIT = '3cd377a2353a9da0bee3bc9e4cf8965e4243d1fe';
const BASE = `https://raw.githubusercontent.com/M1gu3hb/fiesta-total-dj/${COMMIT}`;

const ARCHIVOS = [
  { origen: 'deploy/index.html', destino: 'index.html', sha256: '21f0486f680048453cddd1a7e932152866ea4c46abd0b4a550a74b0e8f0ef8b6' },
  { origen: 'logo.png',          destino: 'logo.png',   sha256: '8cf8909870ef1f3a08b8e91ea0d1eac46feabe0a4a19f42f1c0f5faa62271ca4' },
];

await mkdir('dist', { recursive: true });

for (const { origen, destino, sha256 } of ARCHIVOS) {
  const res = await fetch(`${BASE}/${origen}`);
  if (!res.ok) throw new Error(`No se pudo descargar ${origen}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const got = createHash('sha256').update(buf).digest('hex');
  if (got !== sha256) throw new Error(`Checksum de ${origen} no coincide: ${got}`);
  await writeFile(`dist/${destino}`, buf);
  console.log(`OK ${destino}: ${buf.length} bytes, checksum verificado`);
}
