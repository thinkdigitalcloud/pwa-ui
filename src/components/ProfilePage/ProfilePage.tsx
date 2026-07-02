import React from 'react';
import styled from 'styled-components';
import { PiCamera } from 'react-icons/pi';
import { Page, type PageProps } from '../Page';
import { ProfileBase } from '../ProfileBase';
import { ListRow } from '../ListRow';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { Spinner } from '../Spinner';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand, BrandScope } from '../../theme/brands';

export interface ProfileMenuItem {
  key: string;
  label: string;
  /** Leading icon node (react-icons glyph, <img/>, …). */
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface ProfilePageProps {
  name?: string;
  email?: string;
  /** Profile photo (overlapping avatar). */
  photoUrl?: string;
  /** Banner cover image behind the avatar. */
  bannerImage?: string;
  menuItems: ProfileMenuItem[];
  /** Show a camera badge on the avatar and call this when tapped. */
  onEditPhoto?: () => void;
  logoutLabel?: string;
  onLogout?: () => void;
  loading?: boolean;
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function ProfilePageContent({
  name,
  email,
  photoUrl,
  bannerImage,
  menuItems,
  onEditPhoto,
  logoutLabel = 'Log Out',
  onLogout,
  loading = false,
  bottomNav,
  backgroundColor,
}: ProfilePageProps) {
  const theme = useResolvedTheme();
  const bg = backgroundColor ?? theme.colors.background;

  return (
    <Page bottomNav={bottomNav} backgroundColor={bg} padded={false}>
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.danger} text="Loading" />
        </Overlay>
      )}
      <ProfileBase homeBanner={bannerImage} imageHeight="32vh">
        <Card style={{ background: bg }}>
          <AvatarWrap>
            <Avatar src={photoUrl} name={name} size={110} round={false} backgroundColor={theme.colors.secondary} />
            {onEditPhoto && (
              <CameraBadge
                type="button"
                aria-label="Edit profile picture"
                style={{ background: theme.colors.secondary }}
                onClick={onEditPhoto}
              >
                <PiCamera color="#fff" size={18} />
              </CameraBadge>
            )}
          </AvatarWrap>

          {name && <Text variant="heading" color={theme.colors.text}>{name}</Text>}
          {email && <Text variant="small" color={theme.colors.textMuted}>{email}</Text>}

          <Menu>
            {menuItems.map((item) => (
              <ListRow
                key={item.key}
                title={item.label}
                icon={item.icon}
                hasArrow
                arrowColor={theme.colors.text}
                onClick={item.disabled ? undefined : item.onClick}
              />
            ))}
          </Menu>

          {onLogout && (
            <LogoutWrap>
              <Button
                text={logoutLabel}
                block
                uppercase={false}
                onClick={onLogout}
                style={{ background: theme.colors.danger, borderRadius: 10 }}
              />
            </LogoutWrap>
          )}
        </Card>
      </ProfileBase>
    </Page>
  );
}

/**
 * The main `/profile` screen: a banner + overlapping avatar (with optional
 * camera-upload badge) over the user's name/email, a tappable menu, and a
 * full-width Logout button. Presentational — data and handlers come from props;
 * theming from the ThemeProvider (gocity fallback).
 */
export function ProfilePage({ brand, ...props }: ProfilePageProps) {
  return (
    <BrandScope brand={brand}>
      <ProfilePageContent {...props} />
    </BrandScope>
  );
}

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-top: -48px;
  padding: 0 5% 40px;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
`;

const AvatarWrap = styled.div`
  position: relative;
  margin-top: -55px;
  margin-bottom: 10px;
`;

const CameraBadge = styled.button`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 18px;
`;

const LogoutWrap = styled.div`
  width: 100%;
  margin-top: 24px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
