import styled from 'styled-components';
import { Text } from '../Text';

export interface CategoryCardProps {
  heading: string;
  description?: string;
  time?: string;
  price?: string;
  /** Image URL; rendered on the right when valid. */
  image?: string;
  onClick?: () => void;
}

const Wrapper = styled.div<{ $clickable: boolean }>`
  width: 100%;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const Image = styled.img`
  width: 90px;
  height: 90px;
  flex: 0 0 auto;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: cover;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
`;

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/** Lifestyle/event listing card with optional image and price (the apps' `CategoryCard`). */
export function CategoryCard({
  heading,
  description,
  time,
  price,
  image,
  onClick,
}: CategoryCardProps) {
  return (
    <Wrapper $clickable={Boolean(onClick)} onClick={onClick}>
      <Row>
        <Details>
          <Text variant="bodyBold">{heading}</Text>
          {time && (
            <Text variant="small" color="#7B7B7B">
              {time}
            </Text>
          )}
          {description && (
            <Text variant="small" color="#7B7B7B">
              {description}
            </Text>
          )}
          {price && <Text variant="label">{price}</Text>}
        </Details>
        {isValidUrl(image) && <Image src={image} alt="" />}
      </Row>
      <Divider />
    </Wrapper>
  );
}
