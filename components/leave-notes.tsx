import { useState } from 'react';
import { Container, Textarea, Button } from '@shadcn/ui';

const LeaveNote = () => {
  const [note, setNote] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Submit note to Firebase or MongoDB
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, name }),
    });

    if (response.ok) {
      setNote('');
      setName('');
      setSubmitting(false);
    } else {
      console.error('Error submitting note:', response);
      setSubmitting(false);
    }
  };

  return (
    <Container className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-bold mb-2">Leave a Note</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note to the couple and baby..."
          className="mb-2"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="mb-2"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded"
        >
          {submitting ? 'Submitting...' : 'Leave a Note'}
        </Button>
      </form>
    </Container>
  );
};

export default LeaveNote;
