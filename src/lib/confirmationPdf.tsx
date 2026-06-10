/**
 * Confirmation PDF Generator using @react-pdf/renderer.
 * Runs entirely in Node.js serverless — no browser / puppeteer required.
 */
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { Registration } from '@/app/actions/admin';

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    padding: 0,
  },

  // Header band
  header: {
    backgroundColor: '#0A0415',
    paddingHorizontal: 40,
    paddingVertical: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flex: 1 },
  headerLogoText: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  headerSubtitle: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  badgeConfirmed: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 9,
    color: '#4ade80',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
  },

  // Body
  body: {
    paddingHorizontal: 40,
    paddingVertical: 28,
  },

  greeting: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0A0415',
    marginBottom: 8,
  },
  greetingLight: {
    fontSize: 22,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  intro: {
    fontSize: 11,
    color: '#555',
    lineHeight: 1.7,
    marginBottom: 28,
  },

  // Two-column layout
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  col: { flex: 1 },

  // Info card
  card: {
    backgroundColor: '#F9F6FF',
    borderWidth: 1,
    borderColor: '#E5D8FF',
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9f6fe0',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE6FF',
  },
  infoLabel: {
    fontSize: 9,
    color: '#888',
  },
  infoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a2e',
    textAlign: 'right',
    maxWidth: '60%',
  },

  // Delegate cards
  delegateCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  delegateNum: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delegateNumText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#7c3aed',
  },
  delegateName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  delegateMeta: {
    fontSize: 8,
    color: '#888',
  },

  // QR Section
  qrSection: {
    alignItems: 'center',
  },
  qrImage: {
    width: 130,
    height: 130,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5D8FF',
  },
  qrLabel: {
    fontSize: 8,
    color: '#9f6fe0',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 8,
    textAlign: 'center',
  },
  qrSub: {
    fontSize: 7,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 3,
  },

  // Schedule
  scheduleCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 18,
    marginTop: 16,
  },
  scheduleTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#16a34a',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  scheduleDate: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#16a34a',
    width: 80,
  },
  scheduleDesc: {
    fontSize: 9,
    color: '#555',
    flex: 1,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EDE6FF',
    paddingHorizontal: 40,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 8,
    color: '#aaa',
  },
  refBadge: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  refText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#7c3aed',
    letterSpacing: 1,
  },
});

// ── Event schedule data ───────────────────────────────────────────────────────
const SCHEDULE = [
  { date: 'Dec 5, 2025', desc: 'Opening Ceremony & Delegate Orientation' },
  { date: 'Dec 6, 2025', desc: 'Committee Sessions & Career Fair Day 1' },
  { date: 'Dec 7, 2025', desc: 'Final Resolutions, Awards & Closing Gala' },
];

// ── PDF Document Component ────────────────────────────────────────────────────
function ConfirmationDocument({
  registration,
  qrDataUri,
}: {
  registration: Registration;
  qrDataUri: string;
}) {
  const refId = `REF-${registration.id.slice(0, 8).toUpperCase()}`;

  return (
    <Document
      title={`SOPHEP Confirmation — ${registration.full_name}`}
      author="SOPHEP"
      subject="Event Confirmation Letter"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLogoText}>SOPHEP</Text>
            <Text style={styles.headerSubtitle}>GIK Institute of Engineering Sciences &amp; Technology</Text>
          </View>
          <View style={styles.badgeConfirmed}>
            <Text style={styles.badgeText}>✓ CONFIRMED</Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* Greeting */}
          <Text style={styles.greeting}>
            <Text style={styles.greetingLight}>Congratulations, </Text>
            {registration.full_name}!
          </Text>
          <Text style={styles.intro}>
            Your registration for SOPHEP has been officially confirmed. Please present this letter
            or the QR code below at the event check-in desk. We look forward to welcoming you.
          </Text>

          {/* Two-column: Info + QR */}
          <View style={styles.row}>
            {/* Left col — registration details */}
            <View style={styles.col}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Registration Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Reference ID</Text>
                  <Text style={styles.infoValue}>{refId}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Event</Text>
                  <Text style={styles.infoValue}>{registration.event_type}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Delegate Type</Text>
                  <Text style={styles.infoValue}>{registration.delegate_type}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Accommodation</Text>
                  <Text style={styles.infoValue}>{registration.accommodation_needed ? 'Included' : 'Not Required'}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.infoLabel}>Transportation</Text>
                  <Text style={styles.infoValue}>{registration.transportation_needed ? 'Included' : 'Not Required'}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Contact Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{registration.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{registration.email}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.infoLabel}>Institution</Text>
                  <Text style={styles.infoValue}>{registration.institution}</Text>
                </View>
              </View>
            </View>

            {/* Right col — QR code */}
            <View style={[styles.col, styles.qrSection]}>
              <Image src={qrDataUri} style={styles.qrImage} />
              <Text style={styles.qrLabel}>Check-in QR Code</Text>
              <Text style={styles.qrSub}>Present at the registration desk</Text>
              <Text style={[styles.qrSub, { marginTop: 6, fontFamily: 'Helvetica-Bold', color: '#7c3aed' }]}>
                {refId}
              </Text>
            </View>
          </View>

          {/* Delegates roster */}
          {registration.delegates && registration.delegates.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delegation Roster ({registration.delegates.length} members)</Text>
              {registration.delegates.map((d, i) => (
                <View key={d.id} style={styles.delegateCard}>
                  <View style={styles.delegateNum}>
                    <Text style={styles.delegateNumText}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.delegateName}>{d.full_name}</Text>
                    <Text style={styles.delegateMeta}>{d.institution} · {d.event_preference}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Event Schedule */}
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Event Schedule — December 2025</Text>
            {SCHEDULE.map((s) => (
              <View key={s.date} style={styles.scheduleRow}>
                <Text style={styles.scheduleDate}>{s.date}</Text>
                <Text style={styles.scheduleDesc}>{s.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SOPHEP · GIK Institute · This is an official confirmation letter.
          </Text>
          <View style={styles.refBadge}>
            <Text style={styles.refText}>{refId}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
/**
 * Generates a PDF confirmation letter as a Buffer.
 * Attach to Resend emails as a PDF file.
 */
export async function generateConfirmationPdf(
  registration: Registration,
  qrDataUri: string
): Promise<Buffer> {
  const doc = (
    <ConfirmationDocument registration={registration} qrDataUri={qrDataUri} />
  );
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
