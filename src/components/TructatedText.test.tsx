import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TructatedText } from '@/components/TructatedText';

describe('TructatedText', () => {
  it('renders paragraph variant by default', () => {
    const { container } = render(<TructatedText text="Длинный текст задачи" />);

    const textNode = screen.getByText('Длинный текст задачи');
    expect(textNode).toBeInTheDocument();
    expect(container.querySelector('.ant-typography')).toBeTruthy();
  });

  it('renders text variant and applies strong style', () => {
    const { container } = render(
      <TructatedText text="Короткий текст" as="text" strong className="custom-class" />,
    );

    expect(screen.getByText('Короткий текст')).toBeInTheDocument();
    expect(container.querySelector('.custom-class')).toBeTruthy();
    expect(container.querySelector('strong')).toBeTruthy();
  });
});
