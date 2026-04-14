import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function TicketViewPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading...</p>;
  if (!ticket) return <p style={{ padding: '3rem', color: '#ef4444' }}>Ticket not found.</p>;

  const event = ticket.booking?.event;
  const seat = ticket.booking?.seat;

  return (
    <div style={{ padding: '3rem', maxWidth: '480px', margin: '0 auto' }}>
      <div id="ticket" style={{
        background: '#141414', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid #1f1f1f',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          padding: '2rem', textAlign: 'center',
        }}>
          <p style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>EVENT TICKET</p>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>{event?.title}</h2>
          <p style={{ color: '#a5b4fc', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {new Date(event?.eventDate).toDateString()} | {event?.eventTime}
          </p>
        </div>

        {/* Details */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ color: '#404040', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>VENUE</p>
              <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem' }}>{event?.venue}</p>
              <p style={{ color: '#525252', fontSize: '0.8rem' }}>{event?.city}</p>
            </div>
            <div>
              <p style={{ color: '#404040', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>SEAT</p>
              <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '1.2rem' }}>{seat?.row}{seat?.number}</p>
              <p style={{ color: '#525252', fontSize: '0.8rem' }}>{seat?.section}</p>
            </div>
            <div>
              <p style={{ color: '#404040', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>TICKET #</p>
              <p style={{ color: '#737373', fontWeight: '500', fontSize: '0.7rem', fontFamily: 'monospace' }}>{ticket.ticketNumber}</p>
            </div>
            <div>
              <p style={{ color: '#404040', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>STATUS</p>
              <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '0.9rem' }}>{ticket.status}</p>
            </div>
          </div>

          {/* QR */}
          <div style={{
            textAlign: 'center', padding: '1.5rem',
            borderTop: '1px dashed #2a2a2a', marginTop: '0.5rem',
          }}>
            {ticket.qrCode && (
              <img src={ticket.qrCode} alt="QR Code" style={{ width: '180px', height: '180px', borderRadius: '8px' }} />
            )}
            <p style={{ fontSize: '0.7rem', color: '#404040', marginTop: '0.75rem' }}>
              Present this QR code at the venue entrance
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }} className="no-print">
        <button onClick={handlePrint} style={{ padding: '0.65rem 2.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
          Print / Download
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ticket, #ticket * { visibility: visible; }
          #ticket { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); }
          .no-print { display: none !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default TicketViewPage;
