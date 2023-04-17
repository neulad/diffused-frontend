import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Header.module.scss';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { size } from 'lodash';
import { style } from '@dicebear/avatars/dist/utils';



interface HeaderProps {
  headerRef: any;
}

enum Page {
  Default,
  Generate,
  Marketplace,
  MyTokens,
  History,
}

const Header = ({ headerRef }: HeaderProps) => {
  const [isActiveHamburger, setActiveHamburger] = useState(false);
  const [activePage, setActivePage] = useState(Page.Default);
  const screenSize = useRef(0);

  useEffect(() => {
    if (isActiveHamburger) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'scroll';
  }, [isActiveHamburger]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 680) {
        setActiveHamburger(false);
        
      }

      screenSize.current = window.innerWidth;
    });

    switch (window.location.pathname) {
      case '/tokens/generate':
        setActivePage(Page.Generate);
        break;
      case '/marketplace':
        setActivePage(Page.Marketplace);
        break;
      case '/tokens':
        setActivePage(Page.MyTokens);
        break;
      case '/history':
        setActivePage(Page.History);
        break;
      default:
        setActivePage(Page.Default);
    }

    return () => {
      window.removeEventListener('resize', () => {
        screenSize.current = window.innerWidth;
      });
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={clsx([
        !isActiveHamburger,
        'sticky',
        'top-0',
        'mb-5',
        'left-0',
        'right-0',
        'z-50',
        'flex',
        'items-center',
        'justify-between',
        'tablet:px-6',
        'px-3',
        'py-5',
        'bg-[#121212]',
        'shadow-md',
        'backdrop-blur-xl'
      ])}
    >
      <a
        href="/"
        className={clsx(['flex', 'items-center', 'gap-3', 'text-xl'])}
      >
        <svg
          width="30"
          viewBox="0 0 891 1105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M320.467 2.46667C305.667 6.06665 293.4 13 282.467 24.2C273.4 33.2667 269.8 38.8667 248.867 75C91.5333 346.6 18.4666 513.667 2.8666 637.267C0.0666015 659.8 0.0666015 695.533 2.8666 713C14.4666 783.8 54.0666 826.333 135.8 855.8C148.733 860.467 150.733 860.867 165 860.867C179.533 861 180.733 860.733 189.4 856.733C222.733 840.867 234.733 799 216.6 761.667C213 754.2 206.6 747.133 168.333 708.333C121.667 660.867 117.133 655.267 111.533 637.667C109.8 632.6 108.467 623.8 108.067 616.333C107.267 600.867 109.667 589.4 116.6 575C121.133 565.667 125.133 561.4 177 509C228.867 456.6 232.867 452.333 237.933 442.333C241 436.467 244.733 427.133 246.2 421.667C248.867 412.333 249.533 406.333 252.867 369C258.2 309.667 295.667 255.133 349.8 227.933C359.933 222.733 382.333 215.4 395.4 212.733C411.667 209.533 445.533 209.533 461 212.733C497.8 220.6 526.067 235.8 552.467 262.2C580.467 290.2 595.933 319.933 602.467 358.733C603.133 362.867 604.333 379.267 604.867 395C606.2 427.267 608.333 437.8 616.6 454.867C621.267 464.6 625 468.6 709 553C757.133 601.4 797.933 642.867 799.4 645.267C809.4 659.667 814.333 675.933 814.333 694.333C814.333 711.667 809.8 726.067 799.533 741.267C797.133 744.733 752.467 790.6 700.333 843C607.667 935.933 605.133 938.6 600.467 948.6C585.4 980.067 591 1017.27 614.333 1041.4C623.667 1051.13 673.933 1089.67 684.467 1095.27C689.667 1098.07 697.8 1101.13 702.467 1102.33C713.4 1104.87 731.533 1104.87 741.667 1102.33C767.933 1095.67 791.8 1074.33 799.533 1050.6C801 1046.07 822.067 934.333 846.333 802.2C893.4 545.667 892.733 549.267 888.333 531.667C887.267 527.267 884.067 519.133 881.4 513.667C876.733 503.933 870.6 497.8 631.8 258.867C390.6 17.6666 386.867 14.0667 376.867 9.1333C359.267 0.733398 338.067 -1.80005 320.467 2.46667Z"
            fill="#5A5FFA"
          />
          <path
            d="M407 238.6C343.267 248.733 294.734 295.267 282.067 358.333C278.334 377.267 279.267 406.2 284.2 424.333C307.667 508.6 393.667 554.467 476.334 526.867C553.667 501 595.8 414.733 568.734 337.667C560.2 313.667 549.534 297 531.267 279.4C517 265.8 508.334 259.667 491 251.533C471.133 242.067 456.334 238.733 431.667 238.333C420.333 238.067 409.267 238.2 407 238.6Z"
            fill="#5A96FA"
          />
        </svg>

        <div className={clsx(['tracking-wide'])}>
          <span className={clsx(['font-black'])}>Diffused</span>
          <span className={clsx([
            'font-light'
          ])}>Market</span>
        </div>
      </a>

      <ul
        className={clsx([
          'items-center',
          'gap-9',
          'tracking-[0.6px]',
          'text-base',
          "md: hidden",
          'wider:flex',
        ])}
      >
        <li
          className={clsx([
            'cursor-pointer',
            'transition',
            'ease-in',
            activePage == Page.Generate && 'font-semibold',
          ])}
        >
          <Link href="/tokens/generate">Generate</Link>
        </li>
        <li
          className={clsx([
            'cursor-pointer',
            'transition',
            'ease-in',
            activePage == Page.Marketplace && 'font-semibold',
          ])}
        >
          <Link href="/marketplace">Marketplace</Link>
        </li>
        <li
          className={clsx([
            'cursor-pointer',
            'transition',
            'ease-in',
            activePage == Page.MyTokens && 'font-semibold',
          ])}
        >
          <Link href="/tokens">My Tokens</Link>
        </li>
        <li
          className={clsx([
            'cursor-pointer',
            'transition',
            'ease-in',
            activePage == Page.History && 'font-semibold',
          ])}
        >
          <Link href="/history">History</Link>
        </li>
      </ul>

      <div className={clsx(['wider:block', 'hidden'])}>
        <ConnectButton />
      </div>

      <div
       className={clsx([
          styles.hamburgerSmall,
          isActiveHamburger && styles['hamburgerSmall-open'],
          'flex',
          'justify-center',
          'items-center',
          'wider:hidden',
        ])}
        
        onClick={() => {
          setActiveHamburger(!isActiveHamburger);
        }}
      >
        <div className="icon"></div>
      </div>

      <div
        className={clsx([
          !isActiveHamburger && 'hidden',
          'wider:hidden',
          'fixed',
          'top-20',
          'bottom-0',
          'left-0',
          'right-0',
          
        ])}
      >
        <ul
          className={clsx([
            'items-center',
            'gap-9',
            'tracking-[0.6px]',
            'text-base',
            'hidden',
            'wider:flex',
          ])}
        >
          <li
            className={clsx([
              'cursor-pointer',
              'transition',
              'ease-in',
              activePage == Page.Generate && 'font-semibold',
            ])}
          >
            <Link href="/tokens/generate">Generate</Link>
          </li>
          <li
            className={clsx([
              'cursor-pointer',
              'transition',
              'ease-in',
              activePage == Page.Marketplace && 'font-semibold',
            ])}
          >
            <Link href="/marketplace">Marketplace</Link>
          </li>
          <li
            className={clsx([
              'cursor-pointer',
              'transition',
              'ease-in',
              activePage == Page.MyTokens && 'font-semibold',
            ])}
          >
            <Link href="/tokens">My Tokens</Link>
          </li>
          <li
            className={clsx([
              'cursor-pointer',
              'transition',
              'ease-in',
              activePage == Page.History && 'font-semibold',
            ])}
          >
            <Link href="/history">History</Link>
          </li>
        </ul>


        <section id="mobile-version" className={clsx([
        'text-base',
        'h-11/12',
        'w-screen'
        ])}>
          
          <ul  className={clsx([
            'bg-[#121212]',
            'bg-auto',
            'flex',
            'flex-col',
            'ss:items-start',
            'font-light',
            'tracking-wider',
            'p-6',
            'pt-0',
            'sm:items-center'
          ])} >
            <hr className='
          mx-auto
          w-full
          opacity-5
          mb-6'

          />
            <li
              className={clsx([
                'cursor-pointer',
                'transition',
                'ease-in',
                'mb-9',
                activePage == Page.Generate && 'font-semibold',
              ])}
            >
              <Link href="/tokens/generate">Generate</Link>
            </li>
            <li
              className={clsx([
                'cursor-pointer',
                'transition',
                'ease-in',
                'mb-9',
                activePage == Page.Marketplace && 'font-semibold',
              ])}
            >
              <Link href="/marketplace">Marketplace</Link>
            </li>
            <li
              className={clsx([
                'cursor-pointer',
                'transition',
                'ease-in',
                'mb-9',
                activePage == Page.MyTokens && 'font-semibold',
              ])}
            >
              <Link href="/tokens">My Tokens</Link>
            </li>
            <li
              className={clsx([
                'cursor-pointer',
                'transition',
                'ease-in',
                'mb-6',
                activePage == Page.History && 'font-semibold',
              ])}
            >
              <Link href="/history">History</Link>
            </li>
            <hr
              className='
              mx-auto
              w-full
              opacity-5
              mb-6'/>
              <ConnectButton />
        </ul>
        <div className={clsx([
          'blur-sm',
          'h-screen'
        ])}>
        </div>
        </section>
        
      </div>
    </header> 
  );
};

export default Header;
