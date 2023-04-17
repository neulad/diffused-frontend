import clsx from 'clsx';

interface DurationMessageProps {
  isCorrectDuration: boolean;
  isDuarionInScope: boolean;
  duration: string;
}

const DurationMessage = ({
  isCorrectDuration,
  isDuarionInScope,
  duration,
}: DurationMessageProps) => {
  if (!duration) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        Type how many blocks users will be able to bid on.
      </p>
    );
  }

  if (!isDuarionInScope) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        The duration must be between 10 and 57600!
      </p>
    );
  }

  if (isCorrectDuration) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        The duration field has the right format!
      </p>
    );
  }

  return (
    <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
      Duration is incorrect!
    </p>
  );
};

export default DurationMessage;
