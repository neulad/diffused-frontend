import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { UseMutationResult } from 'react-query/types/react/types.d';
import getConfig from 'next/config';
import GenerateButton from './GenerateButton';
import styles from '../styles/GenerateForm.module.scss';
import { useMutation } from 'react-query';

interface GenerateFormProps {
  generateNft: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    unknown,
    unknown
  >;
  image: { id: string; extension: string };
  setImage: any;
  authenticatedAddress: string;
}
const GenerateForm = ({
  generateNft,
  image,
  setImage,
  authenticatedAddress,
}: GenerateFormProps) => {
  const { publicRuntimeConfig } = getConfig();

  const removeImage = useMutation<
    AxiosResponse<any, any>,
    unknown,
    any,
    unknown
  >((data: { id: string; extension: string }) => {
    return axios.delete('/api/nfts/' + data.id, {
      data: { extension: data.extension },
    });
  });

  const formik = useFormik({
    initialValues: {
      prompt: '',
      num_inference_steps: 50,
      guidance_scale: 7.5,
    },
    onSubmit: (values) => {
      generateNft.mutate(
        {
          prompt: values.prompt,
          num_inference_steps: values.num_inference_steps,
          guidance_scale: values.guidance_scale,
        },
        {
          onSuccess: (data) => {
            const prevImage = image;

            localStorage.setItem(
              publicRuntimeConfig.localStorageGenerationTitle,
              JSON.stringify({
                id: data.data.msg.id,
                extension: data.data.msg.extension,
              })
            );

            setImage({
              id: JSON.parse(
                localStorage.getItem(
                  publicRuntimeConfig.localStorageGenerationTitle
                ) || '{}'
              ).id,
              extension: JSON.parse(
                localStorage.getItem(
                  publicRuntimeConfig.localStorageGenerationTitle
                ) || '{}'
              ).extension,
            });

            if (prevImage.id && prevImage.extension)
              removeImage.mutate({
                id: prevImage.id,
                extension: prevImage.extension,
              });

            formik.setSubmitting(false);
          },
        }
      );
    },
  });

  return (
    <div
      className={clsx([
        'basis-1/3',
        'w-full',
        'sm:min-w-max',
        'tablet:px-8',
        'px-6',
        'py-7',
        'bg-[#18151b]',
        'rounded-2xl',
        formik.isSubmitting && 'opacity-40',
      ])}
    >
      <form
        className={clsx([formik.isSubmitting && 'pointer-events-none'])}
        onSubmit={formik.handleSubmit}
      >
        <h1 className={clsx(['font-semibold', 'text-2xl', 'mb-7'])}>Input</h1>
        <label
          htmlFor="prompt"
          className={clsx([
            'text-xs',
            'font-semibold',
            'uppercase',
            'block',
            'mb-2',
            'pl-2',
            'mb-2',
            'text-sm',
            'font-medium',
            'text-[#e8e8e8]',
          ])}
        >
          Prompt
        </label>
        <input
          type="text"
          id="prompt"
          disabled={formik.isSubmitting}
          value={formik.values.prompt}
          onChange={formik.handleChange}
          className={clsx([
            'bg-[#18151b]',
            'border-[#ffffff] border-opacity-40 border',
            'text-white text-opacity-40',
            'px-5 py-3',
            'mb-3',
            'focus:border-[#5F5AFA]',
            'font-normal text-sm',
            'rounded-lg',
            'block',
            'focus:placeholder:text-transparent',
            'w-full',
            formik.values.prompt && 'text-opacity-100',
          ])}
          placeholder="Jack Nicholson..."
          required
        />

        <p
          className={clsx([
            'font-normal',
            'text-sm',
            'text-white',
            'text-opacity-80',
            'italic',
            'hidden',
            'sm:flex',
            'pl-2',
            'mb-5',
          ])}
        >
          Image will be generated based on these words :)
        </p>

        <label
          className={clsx([
            'text-xs',
            'font-semibold',
            'uppercase',
            'block',
            'mb-2',
            'pl-2',
            'mb-2',
            'text-sm',
            'font-medium',
            'text-[#e8e8e8]',
          ])}
          htmlFor="num_inference_steps"
        >
          num_inference_steps
        </label>

        <div className={clsx(['flex', 'items-center', 'mb-3', 'gap-4'])}>
          <div className={clsx(['relative', 'hover:cursor-default'])}>
            <svg
              onClick={(e) => {
                if (formik.isSubmitting) return;

                const parent = e.currentTarget.parentElement;
                const maxValue = (
                  parent?.querySelector('input[type=number]') as any
                ).max;

                if (formik.values.num_inference_steps + 1 > maxValue) return;

                formik.setFieldValue(
                  'num_inference_steps',
                  formik.values.num_inference_steps + 1
                );
              }}
              className={clsx([
                'absolute',
                'top-[0.8rem]',
                !formik.isSubmitting && 'hover:opacity-60',
                'hover:cursor-pointer',
                'transition',
                'ease-in',
                'right-[0.65625rem]',
              ])}
              width="12"
              viewBox="0 0 8 4"
              fill="none"
            >
              <path
                d="M1.04 3.91L4.155 3.91L6.96 3.91C7.44 3.91 7.68 3.33 7.34 2.99L4.75 0.400003C4.335 -0.0149965 3.66 -0.0149965 3.245 0.400003L2.26 1.385L0.655004 2.99C0.320004 3.33 0.560004 3.91 1.04 3.91Z"
                fill="white"
              />
            </svg>

            <svg
              onClick={(e) => {
                if (formik.isSubmitting) return;

                const parent = e.currentTarget.parentElement;
                const minValue = (
                  parent?.querySelector('input[type=number]') as any
                ).min;

                if (formik.values.num_inference_steps - 1 < minValue) return;

                formik.setFieldValue(
                  'num_inference_steps',
                  formik.values.num_inference_steps - 1
                );
              }}
              className={clsx([
                'absolute',
                !formik.isSubmitting && 'hover:opacity-60',
                'hover:cursor-pointer',
                'transition',
                'ease-in',
                'bottom-[0.8rem]',
                'right-[0.65625rem]',
              ])}
              width="12"
              viewBox="0 0 8 4"
              fill="none"
            >
              <path
                d="M6.96 0.0899963H3.845H1.04C0.559996 0.0899963 0.319996 0.669997 0.659996 1.01L3.25 3.6C3.665 4.015 4.34 4.015 4.755 3.6L5.74 2.615L7.345 1.01C7.68 0.669997 7.44 0.0899963 6.96 0.0899963Z"
                fill="white"
              />
            </svg>

            <input
              type="number"
              min="1"
              max="50"
              disabled={formik.isSubmitting}
              maxLength={2}
              readOnly
              value={formik.values.num_inference_steps}
              className={clsx([
                'bg-[#18151b]',
                styles['number-input'],
                'text-sm',
                'border border-white border-opacity-40 rounded-lg',
                'w-[4.625rem] h-[2.5625rem]',
                'py-[0.6875rem] pl-5 pr-2',
              ])}
            />
          </div>

          <input
            id="num_inference_steps"
            type="range"
            min="1"
            max="50"
            disabled={formik.isSubmitting}
            value={formik.values.num_inference_steps}
            onChange={formik.handleChange}
            className={styles.slider}
          />
        </div>

        <p
          className={clsx([
            'font-normal',
            'text-sm',
            'text-white',
            'hidden',
            'sm:flex',
            'text-opacity-80',
            'italic',
            'pl-2',
            'mb-5',
          ])}
        >
          The higher the value, the better the quality!
        </p>

        <label
          className={clsx([
            'text-xs',
            'font-semibold',
            'uppercase',
            'block',
            'mb-2',
            'pl-2',
            'mb-2',
            'text-sm',
            'font-medium',
            'text-[#e8e8e8]',
          ])}
          htmlFor="guidance_scale"
        >
          guidance_scale
        </label>

        <div className={clsx(['flex', 'items-center', 'mb-3', 'gap-4'])}>
          <div className={clsx(['relative'])}>
            <svg
              onClick={(e) => {
                if (formik.isSubmitting) return;

                const parent = e.currentTarget.parentElement;
                const maxValue = (
                  parent?.querySelector('input[type=number]') as any
                ).max;

                if (formik.values.guidance_scale + 0.5 > maxValue) return;

                formik.setFieldValue(
                  'guidance_scale',
                  formik.values.guidance_scale + 0.5
                );
              }}
              className={clsx([
                'absolute',
                'top-[0.8rem]',
                !formik.isSubmitting && 'hover:opacity-60',
                'transition',
                'hover:cursor-pointer',
                'ease-in',
                'right-[0.65625rem]',
              ])}
              width="12"
              viewBox="0 0 8 4"
              fill="none"
            >
              <path
                d="M1.04 3.91L4.155 3.91L6.96 3.91C7.44 3.91 7.68 3.33 7.34 2.99L4.75 0.400003C4.335 -0.0149965 3.66 -0.0149965 3.245 0.400003L2.26 1.385L0.655004 2.99C0.320004 3.33 0.560004 3.91 1.04 3.91Z"
                fill="white"
              />
            </svg>

            <svg
              onClick={(e) => {
                if (formik.isSubmitting) return;

                const parent = e.currentTarget.parentElement;
                const minValue = (
                  parent?.querySelector('input[type=number]') as any
                ).min;

                if (formik.values.guidance_scale - 0.5 < minValue) return;

                formik.setFieldValue(
                  'guidance_scale',
                  formik.values.guidance_scale - 0.5
                );
              }}
              className={clsx([
                'absolute',
                'bottom-[0.8rem]',
                !formik.isSubmitting && 'hover:opacity-60',
                'hover:cursor-pointer',
                'transition',
                'ease-in',
                'right-[0.65625rem]',
              ])}
              width="12"
              viewBox="0 0 8 4"
              fill="none"
            >
              <path
                d="M6.96 0.0899963H3.845H1.04C0.559996 0.0899963 0.319996 0.669997 0.659996 1.01L3.25 3.6C3.665 4.015 4.34 4.015 4.755 3.6L5.74 2.615L7.345 1.01C7.68 0.669997 7.44 0.0899963 6.96 0.0899963Z"
                fill="white"
              />
            </svg>

            <input
              type="number"
              min="1"
              max="20"
              maxLength={2}
              disabled={formik.isSubmitting}
              readOnly
              value={formik.values.guidance_scale.toFixed(1)}
              className={clsx([
                'bg-[#18151b]',
                styles['number-input'],
                'text-sm',
                'border border-white border-opacity-40 rounded-lg',
                'w-[4.625rem] h-[2.5625rem]',
                'py-[0.6875rem] pl-5 pr-2',
              ])}
            />
          </div>

          <input
            id="guidance_scale"
            type="range"
            disabled={formik.isSubmitting}
            min="1"
            step="0.5"
            max="20"
            value={formik.values.guidance_scale}
            onChange={formik.handleChange}
            className={styles.slider}
          />
        </div>

        <p
          className={clsx([
            'font-normal',
            'text-sm',
            'text-white',
            'text-opacity-80',
            'italic',
            'hidden',
            'sm:flex',
            'pl-2',
            'mb-7',
          ])}
        >
          How close to description is picture goin' to be?
        </p>

        <GenerateButton
          data={generateNft.data}
          image={image}
          removeImage={removeImage}
          setImage={setImage}
          authenticatedAddress={authenticatedAddress}
          formik={formik}
        />
      </form>
    </div>
  );
};

export default GenerateForm;
