/**
 * @typedef Subject
 * @property {string} CN
 */

/**
 * @typedef Issuer
 * @property {string} C
 * @property {string} O
 * @property {string} CN
 */

/**
 * @typedef Cert
 * @property {string} ip
 * @property {Subject} subject
 * @property {Issuer} issuer
 * @property {string[]} alternativeNames
 * @property {number} bits
 * @property {string} from
 * @property {string} to
 */

/** @return {Promise<Cert>} */
export function getCert (
  /** @type {string} */ hostname,
  /** @type {string} */ locale = 'ja-JP',
  /** @type {string} */ timezone = 'Asia/Tokyo',
) {
  return new Promise(async (resolve, reject) => {
    const socket = await Bun.connect({
      hostname: hostname,
      port: 443,
      tls: true,
      socket: {
        data (socket, data) {},
        open (socket) {
          const certificate = socket.getPeerCertificate(true);

          socket.end();
          resolve({
            ip: remoteAddress,
            subject: {
              CN: certificate.subject.CN,
            },
            issuer: {
              C: certificate.issuer.C,
              O: certificate.issuer.O,
              CN: certificate.issuer.CN,
            },
            alternativeNames: certificate.subjectaltname.split(', '),
            bits: certificate.bits,
            from: (new Date(certificate.valid_from)).toLocaleString(locale,
              { timeZone: timezone }),
            to: (new Date(certificate.valid_to)).toLocaleString(locale,
              { timeZone: timezone }),
          });
        },
        close (socket) {},
        drain (socket) {},
        error (socket, error) {
          socket.end();
          reject(error);
        },
        connectError (socket, error) {
          reject(error);
        },
        end (socket) {
        },
        timeout (socket) {
          socket.end();
          reject();
        },
      },
    });
    const remoteAddress = socket.remoteAddress;
  });
}
