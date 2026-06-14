import React from 'react';
import styled from 'styled-components';
import { Spinner } from '../Spinner';

export interface ProfileBaseProps {
  /** Profile photo URL. When absent, the `homeBanner` cover image is shown. */
  photoURL?: string;
  /** Fallback cover image shown when there is no `photoURL`. */
  homeBanner?: string;
  /** Blur applied (in px) to the displayed image — used while a fresh upload
   * is processing. When set, `tempImage` is shown blurred instead of `photoURL`. */
  blurRadius?: number;
  /** Temporary local image shown (blurred) while `blurRadius` is active. */
  tempImage?: string;
  /** Hide the image block entirely (status strip + children only). */
  hideProfileImage?: boolean;
  /** Show the centred loading overlay. */
  loading?: boolean;
  /** Height of the image block. Defaults to `40vh`. */
  imageHeight?: string;
  children?: React.ReactNode;
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const StatusStrip = styled.div`
  height: env(safe-area-inset-top, 0px);
  width: 100%;
  background: ${({ theme }) => theme.header.background};
`;

const ImageContainer = styled.div<{ $height: string; $filled: boolean }>`
  position: relative;
  height: ${({ $height }) => $height};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme, $filled }) =>
    $filled ? theme.colors.primary : theme.colors.backgroundSecondary};
`;

const Pic = styled.img<{ $blur?: number }>`
  height: 100%;
  width: 100%;
  object-fit: cover;
  ${({ $blur }) => ($blur ? `filter: blur(${$blur}px);` : '')}
`;

/**
 * Profile header banner (status strip + 40vh cover/profile image + optional
 * loading overlay + children). Presentational: the consuming app supplies
 * `photoURL`/`homeBanner` from its own auth/Redux context; theming comes from
 * the styled-components `ThemeProvider`.
 */
export function ProfileBase({
  photoURL,
  homeBanner,
  blurRadius,
  tempImage,
  hideProfileImage = false,
  loading = false,
  imageHeight = '40vh',
  children,
}: ProfileBaseProps) {
  const showPhoto = Boolean(photoURL);
  const src = blurRadius ? tempImage : photoURL;

  return (
    <Container>
      <StatusStrip />
      {!hideProfileImage &&
        (showPhoto ? (
          <ImageContainer $height={imageHeight} $filled>
            <Pic src={src} $blur={blurRadius} alt="" />
          </ImageContainer>
        ) : (
          <ImageContainer $height={imageHeight} $filled={false}>
            {homeBanner && <Pic src={homeBanner} alt="" />}
          </ImageContainer>
        ))}
      {loading && <Spinner fullscreen />}
      {children}
    </Container>
  );
}
