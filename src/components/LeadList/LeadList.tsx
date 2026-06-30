import styled, { useTheme } from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { Page, type PageProps } from '../Page';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { Spinner } from '../Spinner';

export interface LeadVisitor {
  firstName?: string;
  surname?: string;
  phone?: string;
  plate?: string;
  agentName?: string;
  [key: string]: unknown;
}

export interface LeadListProps {
  visitors: LeadVisitor[];
  loading?: boolean;
  onSelect: (visitor: LeadVisitor) => void;
  emptyText?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * Visitor list for the sales-agent lead-exit flow: each row is an avatar, the
 * visitor's name / phone / plate / nominated agent, and a chevron. Port of
 * balwin's `LeadExitScreen` with data fetching and navigation lifted to the
 * parent (`visitors` + `onSelect`).
 */
export function LeadList({
  visitors,
  loading = false,
  onSelect,
  emptyText = 'No Visitors',
  title = 'Lead Exit',
  header,
  bottomNav,
  backgroundColor,
}: LeadListProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : visitors.length > 0 ? (
        <List>
          {visitors.map((item, i) => {
            const name = `${item.firstName ?? ''} ${item.surname ?? ''}`.trim();
            return (
              <Tile
                key={(item.id as string) || String(i)}
                style={{ borderTopColor: theme.colors.lightGrey }}
                onClick={() => onSelect(item)}
              >
                <Avatar name={item.firstName || 'user'} size={50} />
                <TileText>
                  {!!name && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {name}
                    </Text>
                  )}
                  {!!item.phone && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {item.phone}
                    </Text>
                  )}
                  {!!item.plate && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {item.plate}
                    </Text>
                  )}
                  {!!item.agentName && (
                    <Text variant="label" color={theme.colors.text}>
                      {`Nominated: ${item.agentName}`}
                    </Text>
                  )}
                </TileText>
                <FiChevronRight size={25} color={theme.colors.text} />
              </Tile>
            );
          })}
        </List>
      ) : (
        <ScreenTitle style={{ color: theme.colors.text }}>{emptyText}</ScreenTitle>
      )}
    </Page>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 24px;
`;
const Tile = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid;
  cursor: pointer;
`;
const TileText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;
const ScreenTitle = styled.p`
  padding: 15px 30px;
  margin-top: 100px;
  text-align: center;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 80px;
`;
