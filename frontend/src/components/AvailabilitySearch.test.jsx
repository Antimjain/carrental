import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AvailabilitySearch from './AvailabilitySearch';
import { getAvailability } from '../api';

vi.mock('../api', () => ({
  getAvailability: vi.fn()
}));

const car = {
  id: 1,
  brand: 'Toyota',
  model: 'Yaris',
  availableStock: 3,
  totalPrice: 295.29,
  averageDayPrice: 98.43
};

function search(container) {
  fireEvent.change(screen.getByLabelText('Pick-up'), { target: { value: '2026-06-10' } });
  fireEvent.change(screen.getByLabelText('Return'), { target: { value: '2026-06-13' } });
  fireEvent.submit(container.querySelector('form'));
}

describe('AvailabilitySearch', () => {
  it('shows the date fields and the search button', () => {
    render(<AvailabilitySearch onBook={vi.fn()} />);

    expect(screen.getByLabelText('Pick-up')).toBeInTheDocument();
    expect(screen.getByLabelText('Return')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check availability' })).toBeInTheDocument();
  });

  it('lists a car card after a search', async () => {
    getAvailability.mockResolvedValue([car]);
    const { container } = render(<AvailabilitySearch onBook={vi.fn()} />);

    search(container);

    expect(await screen.findByText('Toyota Yaris')).toBeInTheDocument();
    expect(screen.getByText('3 left')).toBeInTheDocument();
    expect(screen.getByText('$295.29')).toBeInTheDocument();
    expect(screen.getByText('$98.43 / day avg · 3 days')).toBeInTheDocument();
  });

  it('runs only one search when submitted twice quickly', async () => {
    let resolve;
    getAvailability.mockReturnValue(new Promise((r) => { resolve = r; }));
    const { container } = render(<AvailabilitySearch onBook={vi.fn()} />);

    search(container);
    fireEvent.submit(container.querySelector('form'));

    expect(getAvailability).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Checking…' })).toBeDisabled();

    resolve([car]);
    await screen.findByText('Toyota Yaris');
  });

  it('passes the chosen car and dates to onBook', async () => {
    getAvailability.mockResolvedValue([car]);
    const onBook = vi.fn();
    const { container } = render(<AvailabilitySearch onBook={onBook} />);

    search(container);

    fireEvent.click(await screen.findByRole('button', { name: 'Book this car' }));

    expect(onBook).toHaveBeenCalledWith({
      carId: 1,
      label: 'Toyota Yaris',
      startDate: '2026-06-10',
      endDate: '2026-06-13'
    });
  });

  it('reloads availability when the refresh signal changes', async () => {
    getAvailability.mockResolvedValue([car]);
    const { container, rerender } = render(<AvailabilitySearch onBook={vi.fn()} refreshSignal={0} />);

    search(container);
    await screen.findByText('Toyota Yaris');
    expect(getAvailability).toHaveBeenCalledTimes(1);

    rerender(<AvailabilitySearch onBook={vi.fn()} refreshSignal={1} />);

    await vi.waitFor(() => expect(getAvailability).toHaveBeenCalledTimes(2));
    expect(getAvailability).toHaveBeenLastCalledWith('2026-06-10', '2026-06-13');
  });
});
