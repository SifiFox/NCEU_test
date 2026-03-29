import { Tooltip, Typography } from 'antd';
import { useState } from 'react';

type TructatedTextProps = {
  text: string;
  rows?: number;
  className?: string;
  strong?: boolean;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  as?: 'text' | 'paragraph';
};

export function TructatedText({
  text,
  rows = 1,
  className,
  strong = false,
  type,
  as = 'paragraph',
}: TructatedTextProps) {
  const [isEllipsed, setIsEllipsed] = useState(false);

  if (as === 'text') {
    const textNode = (
      <Typography.Text
        className={className}
        strong={strong}
        type={type}
        ellipsis={{
          onEllipsis: setIsEllipsed,
        }}
      >
        {text}
      </Typography.Text>
    );

    return isEllipsed ? <Tooltip title={text}>{textNode}</Tooltip> : textNode;
  }

  const paragraphNode = (
    <Typography.Paragraph
      className={className}
      strong={strong}
      type={type}
      ellipsis={{
        rows,
        onEllipsis: setIsEllipsed,
      }}
    >
      {text}
    </Typography.Paragraph>
  );

  return isEllipsed ? <Tooltip title={text}>{paragraphNode}</Tooltip> : paragraphNode;
}
