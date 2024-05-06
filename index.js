import { parseArgs } from "util";
import { getCert } from './modules/Cert.js';

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    hostname: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.hostname === undefined) {
  console.error('Usage: `bun-cert --hostname example.com`');
} else {
  const cert = await getCert(values.hostname);

  const output = `
IP:         ${cert.ip}
Subject:    CN=${cert.subject.CN}
Issuer:     CN=${cert.issuer.CN}, O=${cert.issuer.O}, C=${cert.issuer.C}
Expiration: ${cert.to}

${cert.alternativeNames.join(', ')}
`;

  console.info(output);
}
