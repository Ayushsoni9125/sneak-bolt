import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvailabilityBadge } from '../AvailabilityBadge';

describe('AvailabilityBadge', () => {
  it('renders "Available" for available status', () => {
    render(<AvailabilityBadge availability="available" />);
    const badge = screen.getByText('Available');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('availability-available');
  });

  it('renders "Sold Out" for sold_out status', () => {
    render(<AvailabilityBadge availability="sold_out" />);
    const badge = screen.getByText('Sold Out');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('availability-sold_out');
  });

  it('renders "Upcoming" for upcoming status', () => {
    render(<AvailabilityBadge availability="upcoming" />);
    const badge = screen.getByText('Upcoming');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('availability-upcoming');
  });

  it('applies custom className', () => {
    render(<AvailabilityBadge availability="available" className="custom-test-class" />);
    const badge = screen.getByText('Available');
    expect(badge).toHaveClass('custom-test-class');
  });
});
