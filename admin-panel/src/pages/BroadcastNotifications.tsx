import React, { useState } from 'react';
import { Send, Bell, Loader2 } from 'lucide-react';
import api from '../services/api';

const BroadcastNotifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; failures: number; error?: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/admin/notifications/broadcast', { title, body });
      setResult({
        success: response.data.success_count,
        failures: response.data.failure_count,
      });
      setTitle('');
      setBody('');
    } catch (error: any) {
      setResult({
        success: 0,
        failures: 0,
        error: error.response?.data?.message || 'Failed to send broadcast.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="broadcast-container">
      <div className="header-row">
        <h2><Bell className="header-icon" /> Broadcast Notification</h2>
        <p>Send a push notification to all users' devices simultaneously.</p>
      </div>

      <div className="card broadcast-card">
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label htmlFor="title">Notification Title</label>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="e.g. Special Weekend Offer!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Notification Message</label>
            <textarea
              id="body"
              className="form-control"
              rows={4}
              placeholder="Type your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !title.trim() || !body.trim()}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            {loading ? ' Sending...' : ' Broadcast Now'}
          </button>
        </form>

        {result && (
          <div className={`alert mt-4 ${result.error ? 'alert-error' : 'alert-success'}`}>
            {result.error ? (
              <p><strong>Error:</strong> {result.error}</p>
            ) : (
              <div>
                <p><strong>Broadcast Complete!</strong></p>
                <p>✅ Delivered to {result.success} devices.</p>
                {result.failures > 0 && <p>❌ Failed to deliver to {result.failures} devices (expired tokens).</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastNotifications;
