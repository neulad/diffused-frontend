import clsx from 'clsx';
import type { NextPage } from 'next';
import Header from '../components/Header';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <div className={clsx(['w-screen', 'px-4'])}>
        <section
          className={clsx(['my-5', 'bg-[#19161C]', 'p-5', 'rounded-lg'])}
        >
          <h1 className={clsx(['text-2xl', 'w-2/3'])}>
            StableDiffusion NFT generator is out! &#127881; &#127881; &#127881;
          </h1>
          <div className={clsx(['flex', 'flex-col', 'mt-3'])}>
            <span className={clsx(['text-base', 'w-2/3'])}>
              AIs like stablediffusion tend to generate complete crap sometimes
              &#x1F4A9;
              <br /> Consider these pics:
            </span>

            <div className={clsx(['flex', 'justify-center', 'gap-11', 'my-5'])}>
              <Image
                src={'/bad-example-1.png'}
                alt="Sorry, it seems that image is broken :("
                className={clsx([
                  'opacity-75',
                  'hover:opacity-100',
                  'transition',
                  'ease-in',
                ])}
                width="300"
                height="300"
              />
              <Image
                src={'/bad-example-2.png'}
                alt="Sorry, it seems that image is broken :("
                className={clsx([
                  'opacity-75',
                  'hover:opacity-100',
                  'transition',
                  'ease-in',
                ])}
                width="300"
                height="300"
              />
              <Image
                src={'/bad-example-3.png'}
                alt="Sorry, it seems that image is broken :("
                className={clsx([
                  'opacity-75',
                  'hover:opacity-100',
                  'transition',
                  'ease-in',
                ])}
                width="300"
                height="300"
              />
              <Image
                src={'/bad-example-4.png'}
                alt="Sorry, it seems that image is broken :("
                className={clsx([
                  'opacity-75',
                  'hover:opacity-100',
                  'transition',
                  'ease-in',
                ])}
                width="300"
                height="300"
              />
            </div>

            <span>Scary, isn&apos;t it?</span>
          </div>
        </section>

        <section
          className={clsx(['my-5', 'bg-[#19161C]', 'p-5', 'rounded-lg'])}
        >
          <h1 className={clsx(['text-2xl', 'w-2/3'])}>
            We have some kind of workarund there, right???
          </h1>
          <h2 className={clsx(['text-base', 'mt-3', 'w-2/3'])}>
            Well, actually no. But, I have something better to propose!
          </h2>
        </section>

        <section
          className={clsx(['my-5', 'bg-[#19161C]', 'p-5', 'rounded-lg'])}
        >
          <h1 className={clsx(['text-2xl', 'w-2/3'])}>
            AI-generated NFT Martketplace
          </h1>
          <h2 className={clsx(['text-base', 'mt-3', 'w-2/3', 'text-ellipsis'])}>
            This technology is already in the air! When you want a nice set of
            icons for your project where do you go? Correct, you go to Dribbble
            and buy something that clever people have already drawn for ya! This
            is just the same, instead of sitting and clicking{' '}
            <span className={clsx(['italic'])}>generate</span> button again and
            again you can simply purchase nft of the picture that other users
            have already generated for you after hours of trying to get
            something decent.
          </h2>
        </section>

        <section
          className={clsx(['my-5', 'bg-[#19161C]', 'p-5', 'rounded-lg'])}
        >
          <h1 className={clsx(['text-2xl', 'w-2/3'])}>How does it work?</h1>
          <h2 className={clsx(['text-base', 'mt-3', 'w-2/3', 'text-ellipsis'])}>
            What you see in front of you is a simple application written via
            Next.js. In order to generate NFT I use Replicate API. All
            smartcontracts are written in Solidity and deployed on different
            sidechains of ethereum.
          </h2>
        </section>

        <section
          className={clsx(['my-5', 'bg-[#19161C]', 'p-5', 'rounded-lg'])}
        >
          <h1 className={clsx(['text-2xl', 'w-2/3'])}>
            <span className={clsx(['text-red-700'])}>! WARNING !</span>
          </h1>
          <h2 className={clsx(['text-base', 'mt-3', 'w-2/3', 'text-ellipsis'])}>
            I&apos;m not responsible for what neuronetwork generate hence all
            nfts listed on the marketplace do not imply any insult, hatred or
            humiliation. This project is raw, untested in production environment
            and prone to hacking. Use it only for entartainment studying.
          </h2>
        </section>
      </div>
    </div>
  );
};

export default Home;
