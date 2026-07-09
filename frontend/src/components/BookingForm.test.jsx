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

  it('sends only one request when the form is submitted twice quickly', async () => {
    let resolve;
    createBooking.mockReturnValue(new Promise((r) => { resolve = r; }));
    const { container } = render(<BookingForm draft={draft} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('User'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByLabelText('License valid until'), { target: { value: '2027-01-01' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Booking…' })).toBeDisabled();

    resolve({ id: 7, totalPrice: 295.29 });
    await screen.findByText('Booking #7 confirmed. Total price: $295.29');
  });

  it('refreshes availability after a successful booking', async () => {
    createBooking.mockResolvedValue({ id: 7, totalPrice: 295.29 });
    const onRefresh = vi.fn();
    const { container } = render(<BookingForm draft={draft} onClose={vi.fn()} onRefresh={onRefresh} />);

    fireEvent.change(screen.getByLabelText('User'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByLabelText('License valid until'), { target: { value: '2027-01-01' } });
    fireEvent.submit(container.querySelector('form'));

    await screen.findByText('Booking #7 confirmed. Total price: $295.29');
    expect(onRefresh).toHaveBeenCalled();
  });

  it('shows the server message and refreshes when the booking is refused', async () => {
    createBooking.mockResolvedValue({ message: 'No stock available for these dates' });
    const onRefresh = vi.fn();
    const { container } = render(<BookingForm draft={draft} onClose={vi.fn()} onRefresh={onRefresh} />);

    fireEvent.change(screen.getByLabelText('User'), { target: { value: 'u1' } });
    fireEvent.change(screen.getByLabelText('License valid until'), { target: { value: '2027-01-01' } });
    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('No stock available for these dates')).toBeInTheDocument();
    expect(onRefresh).toHaveBeenCalled();
  });
});
