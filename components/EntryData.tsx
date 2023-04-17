import clsx from 'clsx';

interface EntryDataProps {
  isLoading: boolean;
  error: Error | unknown;
  isJsonLoading: boolean;
  jsonLoadingError: Error | unknown;
  jsonData: any;
  image: { id: string; extension: string };
}

const EntryData = ({
  isLoading,
  error,
  isJsonLoading,
  jsonLoadingError,
  jsonData,
  image,
}: EntryDataProps) => {
  if (isLoading || isJsonLoading) {
    return (
      <div
        className={clsx([
          'bg-[#1f1826]',
          'py-1',
          'px-2',
          'rounded-lg',
          (isLoading || isLoading) && 'opacity-40',
          'text-sm',
          'w-max',
          'font-space',
        ])}
      >
        <div>
          <span className="font-bold">prompt: </span>
          <span></span>
        </div>
        <div>
          <span className="font-bold">num_inference_steps: </span>
          <span></span>
        </div>
        <div>
          <span className="font-bold">guidance_scale: </span>
          <span></span>
        </div>
      </div>
    );
  }

  if (jsonData && image.id && image.extension && !jsonLoadingError && !error) {
    return (
      <div
        className={clsx([
          'bg-[#1f1826]',
          'py-1',
          'px-2',
          'rounded-lg',
          'flex',
          'items-stretch',
          'text-sm',
          'w-max',
          'font-space',
        ])}
      >
        <div className={clsx(['flex', 'flex-col', 'font-bold'])}>
          <span>prompt: </span>
          <span>num_inference_steps: </span>
          <span>guidance_scale: </span>
        </div>
        <div className={clsx(['flex', 'flex-col'])}>
          <span>&nbsp;{jsonData.prompt.slice(0, 15) + '...'}</span>
          <span>&nbsp;{jsonData.num_inference_steps}</span>
          <span>&nbsp;{jsonData.guidance_scale}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx([
        'bg-[#1f1826]',
        'py-1',
        'px-2',
        'rounded-lg',
        'text-sm',
        'w-max',
        'font-space',
      ])}
    >
      <div className={clsx(['flex', 'justify-between'])}>
        <span className="font-bold">prompt: </span>
        <pre>&#9;n/a</pre>
      </div>
      <div className={clsx(['flex', 'justify-between'])}>
        <span className="font-bold">num_inference_steps: </span>
        <pre>&#9;n/a</pre>
      </div>
      <div className={clsx(['flex', 'justify-between'])}>
        <span className="font-bold">guidance_scale: </span>
        <pre>&#9;n/a</pre>
      </div>
    </div>
  );
};

export default EntryData;
