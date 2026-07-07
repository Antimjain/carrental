import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BookingForm from './BookingForm';
import { createBooking } from '../api';

vi.mock('../api', () => ({
  createBooking: vi.fn()
}));

const draft = { carId: 1, label: 'Toyota Yaris', startDate: '2026-06-10', endDate: '2026-06-13' };

describe('BookingForm', () => {
  it('renders nothing until a car is chosen', () => {
    const { container } = render(<BookingForm draft={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens prefilled with the chosen car', () => {
    render(<BookingForm draft={draft} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Book Toyota Yaris' })).toBeInTheDocument();
    expect(screen.getByLabelText('Pick-up')).toHaveValue('2026-06-10');
    expect(screen.getByLabelText('Return')).toHaveValue('2026-06-13');
  });

  it('confirms the booking and shows the total', async () => {
    createBooking.mockResolvedValue({ id: 7, totalPrice: 295.29 });
    const { container } = render(<BookingForm draft={draft} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('User'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByLabelText('License valid until'), { target: { value: '2027-01-01' } });
    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('Booking #7 confirmed. Total price: $295.29')).toBeInTheDocument();
  });

  it('shows the server message when the booking is refused', async () => {
    createBooking.mockResolvedValue({ message: 'no stock for the dates' });
    const { container } = render(<BookingForm draft={draft} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('User'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByLabelText('License valid until'), { target: { value: '2027-01-01' } });
    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('no stock for the dates')).toBeInTheDocument();
  });
});
