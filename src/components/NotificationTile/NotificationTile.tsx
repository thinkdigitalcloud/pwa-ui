import { useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  FaRegBell,
  FaRegEnvelope,
  FaUnlockAlt,
} from 'react-icons/fa';
import {
  IoCalendarOutline,
  IoHammerOutline,
  IoHomeOutline,
  IoNewspaperOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { FiLock, FiUsers } from 'react-icons/fi';
import { BsChevronRight, BsCheck2 } from 'react-icons/bs';

/** A single notification/message record. */
export interface NotificationItem {
  /** Stable id used as a React key. */
  id: string;
  /** Backend notification id (passed through to handlers). */
  notificationId?: string;
  title: string;
  description?: string;
  subTitle?: string;
  /** Avatar/illustration URL; a placeholder shows when absent. */
  image?: string;
  /** `'SENT'` renders as unread (tinted + bold); anything else as read. */
  status?: string;
  /** Drives the badge icon (e.g. `visitor`, `payments`, `newsletter`). */
  type: string;
  /** Unix seconds for the created timestamp. */
  createdSeconds?: number;
  url?: string;
  [key: string]: unknown;
}

export interface NotificationTileProps {
  notification: NotificationItem;
  onClick?: () => void;
  /** Fired on long-press / right-click (enter multi-select). */
  onLongPress?: () => void;
  /** Renders the selected (checkmark) state. */
  selected?: boolean;
  /** Fallback image when `notification.image` is empty. */
  defaultImage?: string;
}

const ICON_BY_KEY = {
  'mail-outline': FaRegEnvelope,
  'notifications-outline': FaRegBell,
  'hammer-outline': IoHammerOutline,
  'calendar-outline': IoCalendarOutline,
  'newspaper-outline': IoNewspaperOutline,
  'home-outline': IoHomeOutline,
  'lock-closed-outline': FiLock,
  'lock-open-outline': FaUnlockAlt,
  'people-outline': FiUsers,
  'wallet-outline': IoWalletOutline,
} as const;

/** Map a notification `type` to an icon key (ported from balwin). */
export function iconKeyForType(rawType: string): keyof typeof ICON_BY_KEY {
  const type = (rawType === 'snag' ? 'fault' : rawType || '').toLowerCase();
  if (type.includes('payment')) return 'wallet-outline';
  if (type.includes('newsletter')) return 'newspaper-outline';
  if (type.includes('hoa')) return 'home-outline';
  if (type.includes('book') || type.includes('event')) return 'calendar-outline';
  if (type.includes('snag') || type.includes('fault') || type.includes('balwin'))
    return 'hammer-outline';
  if (type.includes('visitor')) return 'lock-open-outline';
  if (type.includes('access')) return 'lock-closed-outline';
  if (type.includes('alert') || type.includes('estate manager'))
    return 'notifications-outline';
  return 'notifications-outline';
}

const pad = (n: number) => String(n).padStart(2, '0');

/** `YYYY-MM-DD HH:mm` for a unix-seconds timestamp. */
export function formatCreatedDate(seconds?: number): string {
  if (!seconds) return '';
  const d = new Date(seconds * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Human "x minutes/hours ago" / "yesterday" / "x days ago". */
export function formatRelativeTime(seconds?: number, now: number = Date.now()): string {
  if (!seconds) return '';
  const hours = (now - seconds * 1000) / 3_600_000;
  if (hours >= 0 && hours < 1) {
    const m = Math.floor(hours * 60);
    return `${m} minute${m === 1 ? '' : 's'} ago`;
  }
  if (hours >= 1 && hours <= 24) {
    const h = Math.floor(hours);
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  if (hours > 24 && hours <= 48) return 'yesterday';
  return `${Math.floor(hours / 24)} days ago`;
}

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#e3e6ea"/></svg>`,
  );

/**
 * A single notification row (RN parity: circular image + type badge, title,
 * description, timestamps, and a chevron/check affordance). Supports long-press
 * to enter multi-select via `onLongPress`.
 */
export function NotificationTile({
  notification,
  onClick,
  onLongPress,
  selected = false,
  defaultImage = PLACEHOLDER,
}: NotificationTileProps) {
  const theme = useTheme();
  const { title, image, status, type, description, subTitle, createdSeconds } =
    notification;

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  const startPress = () => {
    longPressed.current = false;
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      onLongPress?.();
    }, 450);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  const handleClick = () => {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    onClick?.();
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onLongPress?.();
  };

  const Icon = ICON_BY_KEY[iconKeyForType(type)];
  const unread = (status || '').toUpperCase() === 'SENT';
  const createdDate = formatCreatedDate(createdSeconds);
  const relative = formatRelativeTime(createdSeconds);

  return (
    <Card
      $bg={selected || unread ? theme.colors.lightGrey : theme.colors.background}
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onContextMenu={handleContextMenu}
    >
      <ImageWrap>
        <Avatar style={{ backgroundImage: `url(${image || defaultImage})` }} />
        <Badge style={{ backgroundColor: theme.colors.secondary }}>
          <Icon size={13} color="#fff" />
        </Badge>
      </ImageWrap>
      <Body>
        <Title $color={theme.colors.text} $unread={unread} title={title}>
          {title}
        </Title>
        {subTitle && subTitle !== 'Visitor Information' && (
          <Line $color={theme.colors.text}>{subTitle}</Line>
        )}
        {description && <Line $color={theme.colors.text}>{description}</Line>}
        {createdDate && <Stamp $color={theme.colors.text}>{createdDate}</Stamp>}
        {relative && <Stamp $color={theme.colors.text}>{relative}</Stamp>}
      </Body>
      <Trailing>
        {selected ? (
          <BsCheck2 color={theme.colors.secondary} size={22} />
        ) : (
          <BsChevronRight color={theme.colors.primary} size={18} />
        )}
      </Trailing>
    </Card>
  );
}

const Card = styled.div<{ $bg: string }>`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 10px 0;
  min-height: 80px;
  border-top: 1px solid #eeeeee;
  cursor: pointer;
  background-color: ${({ $bg }) => $bg};
`;

const ImageWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const Badge = styled.div`
  position: absolute;
  bottom: 0;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 15px;
`;

const ellipsis = `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;

const Title = styled.span<{ $color: string; $unread: boolean }>`
  font-size: 14px;
  color: ${({ $color }) => $color};
  font-weight: ${({ $unread }) => ($unread ? 500 : 400)};
  ${ellipsis}
`;

const Line = styled.span<{ $color: string }>`
  font-size: 12px;
  color: ${({ $color }) => $color};
  ${ellipsis}
`;

const Stamp = styled.span<{ $color: string }>`
  font-size: 10px;
  color: ${({ $color }) => $color};
`;

const Trailing = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  justify-content: flex-end;
  padding-right: 13px;
`;
