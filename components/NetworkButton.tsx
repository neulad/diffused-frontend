import clsx from 'clsx';
import { useState } from 'react';

const NetworkButton = () => {
  const [currentUnit, setCurrentUnit] = useState('eth');

  return (
    <div
      className={clsx([
        'grow',
        'flex',
        'items-center',
        'justify-center',
        'bg-[#5F5AFA]',
        'rounded-lg',
      ])}
    >
      hello
    </div>
  );
};

export default NetworkButton;
