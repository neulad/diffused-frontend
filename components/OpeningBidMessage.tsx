import clsx from 'clsx';

interface OpeningBidMessageProps {
  openingBid: string;
  isCorrectOpeningBid: boolean;
  isOpeningBidInScope: boolean;
  isOpeningBidTooPrecise: boolean;
}

const OpeningBidMessage = ({
  openingBid,
  isCorrectOpeningBid,
  isOpeningBidInScope,
  isOpeningBidTooPrecise,
}: OpeningBidMessageProps) => {
  if (!openingBid) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        Specify the initial price in Ether.
      </p>
    );
  }

  if (!isOpeningBidInScope) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        The starting bid must be between 0.000001 and 10000!
      </p>
    );
  }

  if (isOpeningBidTooPrecise) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        The starting bid can't have more than six symbols after the dot.
      </p>
    );
  }

  if (isCorrectOpeningBid) {
    return (
      <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
        The starting bid is going to be {openingBid}eth!
      </p>
    );
  }

  return (
    <p className={clsx(['text-sm', 'text-[#9ca3af]', 'mb-4'])}>
      Change the data to an appropriate floating number!
    </p>
  );
};

export default OpeningBidMessage;
