import styled, { useTheme } from 'styled-components';
import { PiTrash } from 'react-icons/pi';
import { Page, type PageProps } from '../Page';
import { NoData } from '../NoData';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { Text } from '../Text';

/** One row of a profile list (address / account / contact / vehicle). */
export interface ProfileListItemData {
  id: string | number;
  /** Bold first line. */
  title: string;
  /** Additional muted lines below the title. */
  lines?: string[];
  /** Leading thumbnail (logo/photo). */
  image?: string;
}

export interface ProfileListPageProps {
  items: ProfileListItemData[];
  /** Open an item (e.g. edit). */
  onItemClick: (item: ProfileListItemData) => void;
  /** Delete an item — omit to hide the trash icon. */
  onItemDelete?: (item: ProfileListItemData) => void;
  /** "Add …" button label. */
  addLabel: string;
  onAdd: () => void;
  /** Empty-state message. */
  emptyText: string;

  loading?: boolean;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * Generic profile sub-list page (the apps' Addresses / Accounts / Contacts /
 * Vehicles screens, which were identical): a list of deletable items each with
 * a thumbnail + text lines that open on tap, an empty state, and a green
 * "Add …" button. Data + handlers come from the parent.
 */
export function ProfileListPage({
  items,
  onItemClick,
  onItemDelete,
  addLabel,
  onAdd,
  emptyText,
  loading = false,
  title,
  header,
  bottomNav,
  backgroundColor,
}: ProfileListPageProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title: title ?? '', noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.danger} text="Loading" />
        </Overlay>
      )}
      <Column>
        {items.length > 0 ? (
          <List>
            {items.map((item) => (
              <Item key={item.id}>
                <ItemMain
                  role="button"
                  tabIndex={0}
                  onClick={() => onItemClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onItemClick(item);
                  }}
                >
                  {item.image && <Thumb src={item.image} alt="" />}
                  <ItemText>
                    <Text variant="label" color="#414143">
                      {item.title}
                    </Text>
                    {item.lines?.map((line, i) => (
                      <Text key={i} variant="small" color="#414143">
                        {line}
                      </Text>
                    ))}
                  </ItemText>
                </ItemMain>
                {onItemDelete && (
                  <TrashButton
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => onItemDelete(item)}
                  >
                    <PiTrash size={28} color={theme.colors.danger} />
                  </TrashButton>
                )}
              </Item>
            ))}
          </List>
        ) : (
          <EmptyWrap>
            <NoData text={emptyText} />
          </EmptyWrap>
        )}

        <AddWrap>
          <Button text={addLabel} variant="success" block onClick={onAdd} />
        </AddWrap>
      </Column>
    </Page>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
`;

const ItemMain = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  user-select: none;
`;

const Thumb = styled.img`
  width: 90px;
  height: 65px;
  object-fit: contain;
  margin-right: 12px;
  flex-shrink: 0;
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const TrashButton = styled.button`
  border: none;
  background: none;
  display: flex;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 10px;
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-top: 30px;
`;

const AddWrap = styled.div`
  width: 85%;
  max-width: 950px;
  margin: 20px 0 50px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
