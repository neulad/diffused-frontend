import clsx from 'clsx';
import styles from '../styles/Token.module.scss';
import previewStyles from '../styles/Preview.module.scss';

const LoadingToken = () => {
  return (
    <div
      className={clsx([
        'py-3',
        'px-2',
        'border',
        'border-[#292929]',
        'rounded-2xl',
      ])}
    >
      <div
        className={clsx([
          'rounded-lg',
          'mx-auto',
          'relative',
          'overflow-clip',
          'mb-2',
          previewStyles['image-square'],
          'w-[full]',
          styles['skeleton-image'],
        ])}
      >
        <div
          className={clsx([
            styles['skeleton-caption'],
            'absolute',
            'bottom-2',
            'h-[16px]',
            'w-[60%]',
            'rounded-lg',
            'left-2',
            'pointer-events-none',
          ])}
        ></div>
      </div>
      <div className={clsx(['flex', 'gap-2', 'items-stretch'])}>
        <div
          className={clsx([
            'py-2',
            'rounded-lg',
            'border',
            'border-[#292929]',
            'w-[157px]',
            'h-[31px]',
          ])}
        ></div>
        <div
          className={clsx(['border', 'border-[#292929]', 'rounded-lg', 'grow'])}
        ></div>
      </div>
    </div>
  );
};

export default LoadingToken;
