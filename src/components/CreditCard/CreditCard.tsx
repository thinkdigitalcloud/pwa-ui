import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand as BrandEnum, BrandScope } from '../../theme/brands';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

/** Which field is currently being edited (highlights it on the card). */
export type CardField = 'number' | 'name' | 'expiry' | 'cvc';

export interface CreditCardProps {
  /** Card number (digits; spacing/masking is applied for you). */
  number?: string;
  /** Cardholder name. */
  name?: string;
  /** Expiry as `MM/YY`. */
  expiry?: string;
  /** CVC/CVV (shown on the back face). */
  cvc?: string;
  /** Field being edited — highlights it, and flips to the back for `cvc`. */
  focused?: CardField;
  /** Force the flip state; when unset, the card flips when `focused === 'cvc'`. */
  flipped?: boolean;
  /** Placeholder shown when `name` is empty. */
  namePlaceholder?: string;
  /** Two-stop background gradient; defaults to the theme's online gradient. */
  gradient?: [string, string];
  /** Notified when the detected brand changes (the apps' `type` callback). */
  onBrandChange?: (brand: CardBrand) => void;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: BrandEnum;
}

const BRAND_ICON: Record<CardBrand, JSX.Element | null> = {
  visa: <FaCcVisa size={38} />,
  mastercard: <FaCcMastercard size={38} />,
  amex: <FaCcAmex size={38} />,
  discover: <FaCcDiscover size={38} />,
  unknown: null,
};

export function detectBrand(num: string): CardBrand {
  const n = num.replace(/\D/g, '');
  if (/^3[47]/.test(n)) return 'amex';
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^6(011|5|4[4-9]|22)/.test(n)) return 'discover';
  return 'unknown';
}

function formatNumber(num: string, brand: CardBrand): string {
  const digits = num.replace(/\D/g, '');
  const isAmex = brand === 'amex';
  const total = isAmex ? 15 : 16;
  const groups = isAmex ? [4, 6, 5] : [4, 4, 4, 4];
  const padded = (digits + '•'.repeat(Math.max(0, total - digits.length))).slice(0, total);
  const out: string[] = [];
  let i = 0;
  groups.forEach((g) => {
    out.push(padded.slice(i, i + g));
    i += g;
  });
  return out.join(' ');
}

function CreditCardContent({
  number = '',
  name,
  expiry,
  cvc,
  focused,
  flipped,
  namePlaceholder = 'Full name',
  gradient,
  onBrandChange,
}: CreditCardProps) {
  const theme = useResolvedTheme();
  const brand = detectBrand(number);
  const [c1, c2] = gradient ?? (theme.gradient.online as [string, string]);
  const isFlipped = flipped ?? focused === 'cvc';

  const lastBrand = useRef<CardBrand | null>(null);
  useEffect(() => {
    if (lastBrand.current !== brand) {
      lastBrand.current = brand;
      onBrandChange?.(brand);
    }
  }, [brand, onBrandChange]);

  return (
    <Scene>
      <Card $flipped={isFlipped}>
        <Face $c1={c1} $c2={c2}>
          <TopRow>
            <Chip />
            <Brand>{BRAND_ICON[brand]}</Brand>
          </TopRow>
          <Number $focused={focused === 'number'}>{formatNumber(number, brand)}</Number>
          <BottomRow>
            <FieldBlock $focused={focused === 'name'}>
              <FieldLabel>Card Holder</FieldLabel>
              <FieldValue>{name || namePlaceholder}</FieldValue>
            </FieldBlock>
            <FieldBlock $focused={focused === 'expiry'} style={{ textAlign: 'right' }}>
              <FieldLabel>Valid Thru</FieldLabel>
              <FieldValue>{expiry || 'MM/YY'}</FieldValue>
            </FieldBlock>
          </BottomRow>
        </Face>
        <Face $back $c1={c1} $c2={c2}>
          <Magstripe />
          <SignatureRow>
            <Signature />
            <Cvc $focused={focused === 'cvc'}>{cvc || '•••'}</Cvc>
          </SignatureRow>
          <BackBrand>{BRAND_ICON[brand]}</BackBrand>
        </Face>
      </Card>
    </Scene>
  );
}

/**
 * Presentational credit-card visual — the flippy card face from the apps'
 * `CreditCard` (which wrapped `react-credit-cards`), reimplemented dependency-free
 * with styled-components. Brand is detected from the number and surfaced via
 * `onBrandChange`; pass `focused` to highlight the field being edited.
 */
export function CreditCard({ brand, ...props }: CreditCardProps) {
  return (
    <BrandScope brand={brand}>
      <CreditCardContent {...props} />
    </BrandScope>
  );
}

const Scene = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1.586;
`;

const Card = styled.div<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  transform: rotateY(${({ $flipped }) => ($flipped ? '180deg' : '0deg')});
`;

const Face = styled.div<{ $back?: boolean; $c1: string; $c2: string }>`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 18px;
  box-sizing: border-box;
  color: #fff;
  font-family: ${({ theme }) => theme.typography?.fontFamily ?? 'sans-serif'};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  background: linear-gradient(120deg, ${({ $c1 }) => $c1}, ${({ $c2 }) => $c2});
  display: flex;
  flex-direction: column;
  ${({ $back }) => ($back ? 'transform: rotateY(180deg); justify-content: flex-start;' : 'justify-content: space-between;')}
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Chip = styled.div`
  width: 42px;
  height: 30px;
  border-radius: 6px;
  background: linear-gradient(135deg, #d9c27a, #b8963f);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

const Number = styled.div<{ $focused: boolean }>`
  font-size: 20px;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  padding: 4px 2px;
  border-radius: 6px;
  outline: ${({ $focused }) => ($focused ? '2px solid rgba(255,255,255,0.8)' : 'none')};
`;

const BottomRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

const FieldBlock = styled.div<{ $focused: boolean }>`
  min-width: 0;
  padding: 2px 4px;
  border-radius: 6px;
  outline: ${({ $focused }) => ($focused ? '2px solid rgba(255,255,255,0.8)' : 'none')};
`;

const FieldLabel = styled.div`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
`;

const FieldValue = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Magstripe = styled.div`
  height: 38px;
  background: #000;
  margin: 10px -18px 0;
`;

const SignatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const Signature = styled.div`
  flex: 1;
  height: 28px;
  border-radius: 4px;
  background: repeating-linear-gradient(45deg, #fff, #fff 6px, #e8e8e8 6px, #e8e8e8 12px);
`;

const Cvc = styled.div<{ $focused: boolean }>`
  min-width: 48px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #fff;
  color: #000;
  font-size: 14px;
  letter-spacing: 2px;
  outline: ${({ $focused }) => ($focused ? '2px solid rgba(255,255,255,0.9)' : 'none')};
`;

const BackBrand = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;
