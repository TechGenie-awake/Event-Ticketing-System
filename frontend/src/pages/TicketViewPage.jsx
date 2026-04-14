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

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (!ticket) return <p style={{ padding: '2rem', color: 'red' }}>Ticket not found.</p>;

  const event = ticket.booking?.event;
  const seat = ticket.booking?.seat;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '2rem auto' }}>
      <div id="ticket" style={{
        background: 'white',
        border: '2px solid #1e1b4b',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{ background: '#1e1b4b', color: 'white', padding: '1.25rem', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{event?.title}</h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
            {new Date(event?.eventDate).toDateString()} | {event?.eventTime}
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.15rem' }}>VENUE</p>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{event?.venue}, {event?.city}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.15rem' }}>SEAT</p>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{seat?.row}{seat?.number} ({seat?.section})</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.15rem' }}>TICKET #</p>
              <p style={{ fontWeight: '600', fontSize: '0.75rem' }}>{ticket.ticketNumber}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.15rem' }}>STATUS</p>
              <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#16a34a' }}>{ticket.status}</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0', borderTop: '1px dashed #d1d5db' }}>
            {ticket.qrCode && (
              <img src={ticket.qrCode} alt="QR Code" style={{ width: '160px', height: '160px' }} />
            )}
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem' }}>Scan this QR code at the venue entrance</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }} className="no-print">
        <button onClick={handlePrint} style={{ padding: '0.6rem 2rem' }}>
          Print / Download
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ticket, #ticket * { visibility: visible; }
          #ticket { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); border: 2px solid #000; }
          .no-print { display: none !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default TicketViewPage;
