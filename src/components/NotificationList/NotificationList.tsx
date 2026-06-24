import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { FaRegEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { Page, type PageProps } from '../Page';
import { NoData } from '../NoData';
import {
  NotificationTile,
  type NotificationItem,
} from '../NotificationTile';

/** Resolve the id used for selection (backend id preferred, falls back to `id`). */
const keyOf = (n: NotificationItem) => n.notificationId ?? n.id;

export interface NotificationListProps {
  notifications: NotificationItem[];
  /** Open/handle a single notification (read flow). */
  onOpen: (notification: NotificationItem) => void;

  /** Bulk actions (receive the selected backend ids). Omit to hide that action. */
  onMarkRead?: (ids: string[]) => void | Promise<void>;
  onMarkUnread?: (ids: string[]) => void | Promise<void>;
  onDelete?: (ids: string[]) => void | Promise<void>;

  /** Header title. Ignored if `header` is provided. */
  title?: string;
  /** Sub-header above the list (e.g. `All Notifications` / `From "Payments"`). */
  categoryLabel?: string;
  /** Hint shown under the list. Pass `null` to hide. */
  footerHint?: string | null;
  /** Empty-state message. */
  emptyText?: string;
  /** Fallback avatar for tiles without an image. */
  defaultImage?: string;

  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/notifications/:section` inner page: a list of `NotificationTile`s with
 * RN-parity long-press multi-select. Selection + edit-mode are managed here;
 * the parent supplies the data and the async bulk-action handlers.
 */
export function NotificationList({
  notifications,
  onOpen,
  onMarkRead,
  onMarkUnread,
  onDelete,
  title = 'Messages',
  categoryLabel = 'All Notifications',
  footerHint = 'Press and hold a notification for more options.',
  emptyText = 'No Notifications found.',
  defaultImage,
  header,
  bottomNav,
  backgroundColor,
}: NotificationListProps) {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const exitEdit = () => {
    setEditMode(false);
    setSelectedIds([]);
  };
  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const selectAll = () =>
    setSelectedIds((prev) =>
      prev.length === notifications.length ? [] : notifications.map(keyOf),
    );

  const runAction = async (
    action: ((ids: string[]) => void | Promise<void>) | undefined,
  ) => {
    if (!action || selectedIds.length === 0) return;
    await action(selectedIds);
    exitEdit();
  };

  const onCardClick = (n: NotificationItem) => {
    if (editMode) {
      toggle(keyOf(n));
      return;
    }
    onOpen(n);
  };
  const onCardLongPress = (n: NotificationItem) => {
    if (editMode) {
      toggle(keyOf(n));
      return;
    }
    setEditMode(true);
    setSelectedIds([keyOf(n)]);
  };

  const allSelected =
    notifications.length > 0 && selectedIds.length === notifications.length;

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      {editMode ? (
        <Toolbar>
          <Side>
            <IconBtn onClick={exitEdit} aria-label="Cancel">
              <IoClose size={24} color={theme.colors.primary} />
            </IconBtn>
            <Counter $color={theme.colors.text}>{selectedIds.length}</Counter>
          </Side>
          <Side>
            {selectedIds.length > 0 && (
              <>
                {onMarkRead && (
                  <IconBtn onClick={() => runAction(onMarkRead)} aria-label="Mark as read">
                    <FaRegEnvelopeOpen size={18} color={theme.colors.text} />
                  </IconBtn>
                )}
                {onMarkUnread && (
                  <IconBtn onClick={() => runAction(onMarkUnread)} aria-label="Mark as unread">
                    <FaRegEnvelope size={18} color={theme.colors.text} />
                  </IconBtn>
                )}
                {onDelete && (
                  <IconBtn onClick={() => runAction(onDelete)} aria-label="Delete">
                    <FiTrash2 size={18} color={theme.colors.danger} />
                  </IconBtn>
                )}
              </>
            )}
            <IconBtn onClick={selectAll} aria-label="Select all">
              {allSelected ? (
                <MdCheckBox size={20} color={theme.colors.text} />
              ) : (
                <MdCheckBoxOutlineBlank size={20} color={theme.colors.text} />
              )}
            </IconBtn>
          </Side>
        </Toolbar>
      ) : (
        <CategoryLabel $color={theme.colors.text}>{categoryLabel}</CategoryLabel>
      )}

      {notifications.length > 0 ? (
        <ListBody>
          {notifications.map((n) => (
            <TileWrap key={n.id}>
              <NotificationTile
                notification={n}
                selected={selectedIds.includes(keyOf(n))}
                onClick={() => onCardClick(n)}
                onLongPress={() => onCardLongPress(n)}
                defaultImage={defaultImage}
              />
            </TileWrap>
          ))}
          {footerHint != null && (
            <FooterHint $color={theme.colors.text}>{footerHint}</FooterHint>
          )}
        </ListBody>
      ) : (
        <EmptyWrap>
          <NoData text={emptyText} />
        </EmptyWrap>
      )}
    </Page>
  );
}

const CategoryLabel = styled.p<{ $color: string }>`
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  color: ${({ $color }) => $color};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
`;

const Side = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
`;

const Counter = styled.span<{ $color: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

const ListBody = styled.div`
  flex: 1;
  width: 100%;
  padding-bottom: 24px;
`;

const TileWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FooterHint = styled.p<{ $color: string }>`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  margin: 16px 0;
  opacity: 0.7;
  color: ${({ $color }) => $color};
`;
