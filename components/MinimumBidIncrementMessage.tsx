import clsx from 'clsx';

interface minimumBidIncrementProps {
  isCorrectMinimumBidIncrement: boolean;
  isMinimumBidIncrementInScope: boolean;
  minimumBidIncrement: string;
}

const MinimumBidIncrementMessage = ({
  isCorrectMinimumBidIncrement,
  isMinimumBidIncrementInScope,
  minimumBidIncrement,
}: minimumBidIncrementProps) => {
  if (!minimumBidIncrement) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
        Type a number representing the percent of minimum bid growth.
      </p>
    );
  }
  if (!isMinimumBidIncrementInScope) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
        It has to be between 2% and 15%!
      </p>
    );
  }

  if (isCorrectMinimumBidIncrement) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
        The minimum bid increment field is correctly formatted!
      </p>
    );
  }

  return (
    <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-6'])}>
      Type a number representing the percent of minimum bid growth.
    </p>
  );
};

export default MinimumBidIncrementMessage;
