import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the VideoCall component since we can't test WebRTC in unit tests
vi.mock('./VideoCall', () => ({
  default: () => <div data-testid="video-call">Video Call Component</div>
}));

describe('App Component', () => {
  it('renders the initial join room form', () => {
    render(<App />);
    expect(screen.getByText('CutTuCut')).toBeInTheDocument();
    expect(screen.getByLabelText('Room ID')).toBeInTheDocument();
    expect(screen.getByText('Join Room')).toBeInTheDocument();
  });

  it('allows entering a room ID', () => {
    render(<App />);
    const input = screen.getByLabelText('Room ID');
    fireEvent.change(input, { target: { value: 'test-room' } });
    expect(input.value).toBe('test-room');
  });

  it('shows video call component when joining a room', () => {
    render(<App />);
    const input = screen.getByLabelText('Room ID');
    fireEvent.change(input, { target: { value: 'test-room' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Join Room' }));
    expect(screen.getByTestId('video-call')).toBeInTheDocument();
  });
});