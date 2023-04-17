import clsx from 'clsx';

interface EOAMessageProps {
  isCorrectEOA: boolean;
  tokenReceiver: string;
}

const EOAMessage = ({ isCorrectEOA, tokenReceiver }: EOAMessageProps) => {
  if (!tokenReceiver) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
        This user is going to receive your token.
      </p>
    );
  }

  if (isCorrectEOA) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
        The address field has the right format!
      </p>
    );
  }

  return (
    <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
      Address is incorrect!
    </p>
  );
};

export default EOAMessage;
